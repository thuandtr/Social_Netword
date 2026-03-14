import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_EMAIL, GET_USER_BY_ID, GET_USER_BY_USERNAME } from "../mysql/queries";
import { INSERT_USER_STATEMENT, UPSERT_USER_DETAILS_STATEMENT, UPDATE_USER_BASIC_BY_ID } from "../mysql/mutations";
import bcrypt from "bcrypt";
import { generateJWTToken, saveRefreshToken } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";
import { TOKEN_CONFIG, getCookieExpiration } from "../config/token-config";
import { generateActivitiesFromProfileUpdate } from "../utils/activity-generator";

/**
 * Sets authentication cookies for access and refresh tokens
 * @param accessToken - JWT access token for API authentication
 * @param refreshToken - Encrypted refresh token for token renewal
 * @param res - Express response object to set cookies on
 */
const setCookies = (
    accessToken: string, 
    refreshToken: string,
    res: Response
) => {
    // Clear any existing access token cookie to prevent conflicts
    res.clearCookie('access_token', { 
        httpOnly: true,       // Prevent JavaScript access (XSS protection)
        path: "/",            // Cookie available for all paths
        sameSite: 'lax'       // CSRF protection
    });

    // Clear any existing refresh token cookie to prevent conflicts
    res.clearCookie('refresh_token', { 
        httpOnly: true,       // Prevent JavaScript access (XSS protection)
        path: "/",            // Cookie available for all paths
        sameSite: 'lax'       // CSRF protection
    });

    // Calculate expiration time for access token using centralized config
    const expireAccessToken = getCookieExpiration(TOKEN_CONFIG.ACCESS_TOKEN_COOKIE_MAX_AGE);
    
    // Set the access token cookie with security configurations
    res.cookie("access_token", accessToken, {
        ...TOKEN_CONFIG.COOKIE_SETTINGS,
        expires: expireAccessToken,   // Auto-expire after configured time
    });

    // Calculate expiration time for refresh token using centralized config
    const expireRefreshToken = getCookieExpiration(TOKEN_CONFIG.REFRESH_TOKEN_COOKIE_MAX_AGE);
    
    // Set the refresh token cookie with security configurations
    res.cookie("refresh_token", refreshToken, {
        ...TOKEN_CONFIG.COOKIE_SETTINGS,
        expires: expireRefreshToken,  // Auto-expire after configured time
    });

    return; // Explicit return (function completes successfully)
}

/**
 * Generates and sets authentication tokens for a user session
 * @param id - User's unique identifier from database
 * @param email - User's email address for token payload
 * @param res - Express response object to set cookies on
 * @param role - User's role ('user' | 'admin')
 */
const setAuthTokens = async (id: string, email: string, res: Response, role: string = 'user') => {
    try {
        console.log("=== SETTING AUTH TOKENS - START ===");
        console.log("User ID:", id);
        console.log("User Email:", email);

        // Generate access token (short-lived, used for API requests)
        const accessToken = generateJWTToken(id, email, "access", role);
        console.log("✅ Access token generated");
        
        // Generate refresh token (long-lived, used to get new access tokens)
        const refreshToken = generateJWTToken(id, email, "refresh", role);
        console.log("✅ Refresh token generated");

        // Encrypt the refresh token for security before storing
        // Adds extra layer of protection against token theft
        const encryptRefreshToken = encryptData(refreshToken);
        console.log("✅ Refresh token encrypted");
        console.log("Encrypted token length:", encryptRefreshToken.length);
        
        // Store the encrypted refresh token in Redis cache
        // Maps original token to encrypted version for validation
        try {
            await saveRefreshToken(refreshToken, encryptRefreshToken);
            console.log("✅ Refresh token saved to Redis successfully");
        } catch (saveError) {
            console.error("❌ CRITICAL: Failed to save refresh token to Redis");
            console.error("Save error:", saveError);
            throw new Error("Failed to save authentication session");
        }

        // Set both tokens as HTTP-only cookies in the browser
        // Uses encrypted refresh token for additional security
        setCookies(accessToken, encryptRefreshToken, res);
        console.log("✅ Cookies set successfully");
        console.log("=== SETTING AUTH TOKENS - COMPLETE ===");
    } catch (error) {
        // Log any errors that occur during token generation/storage
        console.error("❌ Error setting auth token:", error);
        console.error("Stack trace:", (error as Error).stack);
        // Re-throw error to be handled by calling function
        throw error;
    }
}

const getUser = async (req: Request, res: Response) => {
    let conn;
    try {
        const id = res.locals.jwtData.id;

        if (!id || isNaN(Number(id))) return res.status(400).json({ message: "User ID is required"});

        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_USER_BY_ID, [id]);
        const users = rows as any[];

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Also fetch user_details for this user (same behavior as getUserDetails)
        const [detailRows] = await conn.query("SELECT * FROM user_details WHERE user_id = ?", [id]);
        let details: any = null;
        const detailsArr = detailRows as any[];
        if (detailsArr && detailsArr.length > 0) {
            details = { ...detailsArr[0] };
            const safeParse = (val: any) => {
                if (val === null || val === undefined) return null;
                if (typeof val !== 'string') return val;
                try { return JSON.parse(val); } catch { return null; }
            };
            details.experiences = safeParse(details.experiences);
            details.educations = safeParse(details.educations);
            details.certificates = safeParse(details.certificates);
            details.projects = safeParse(details.projects);
        }

        return res.status(200).json({ message: "User Retrieved", user: users[0], details }); //also return user_details data base on the user id (same as getUserDetails)
    } catch (error) {
        console.log("Error occured", error);
        return res.status(500).json({ message: "Unexprected Error occurred, Try agian later" });
    } finally {
        if (conn) conn.release();
    }
}

const getUserById = async (req: Request, res: Response) => {
    let conn;
    try {
        const id = req.params.id;
        if (!id || isNaN(Number(id))) return res.status(400).json({ message: "User ID is required" });

        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_USER_BY_ID, [id]);
        const users = rows as any[];

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User Retrieved", user: users[0] });
    } catch (error) {
        console.log("Error occured", error);
        return res.status(500).json({ message: "Unexprected Error occurred, Try agian later" });
    } finally {
        if (conn) conn.release();
    }
}

const getUserByUsername = async (req: Request, res: Response) => {
    let conn;
    try {
        const username = req.params.username;
        if (!username) return res.status(400).json({ message: "Username is required" });

        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_USER_BY_USERNAME, [username]);
        const users = rows as any[];

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];

        // Also fetch user_details for this user
        const [detailRows] = await conn.query("SELECT * FROM user_details WHERE user_id = ?", [user.id]);
        let details: any = null;
        const detailsArr = detailRows as any[];
        if (detailsArr && detailsArr.length > 0) {
            details = { ...detailsArr[0] };
            const safeParse = (val: any) => {
                if (val === null || val === undefined) return null;
                if (typeof val !== 'string') return val;
                try { return JSON.parse(val); } catch { return null; }
            };
            details.experiences = safeParse(details.experiences);
            details.educations = safeParse(details.educations);
            details.certificates = safeParse(details.certificates);
            details.projects = safeParse(details.projects);
        }

        return res.status(200).json({ message: "User Retrieved", user, details });
    } catch (error) {
        console.log("Error occured", error);
        return res.status(500).json({ message: "Unexpected Error occurred, Try again later" });
    } finally {
        if (conn) conn.release();
    }
}

const getUserByEmail = async (email: string) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query(GET_USER_BY_EMAIL, [email]);

        const users = rows as any[];
        return users;
    } catch (error) {
        console.log("Error occurred in getUserByEmail:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}

const createUser = async (req: Request, res: Response) => {
    let conn;
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(422).json({ message: "Username, Email and Password are required" });
        }

        const users = await getUserByEmail(email);

        if (users && users.length > 0) {
            return res.status(409).json({ message: `User with this email already exists, userId: ${users[0].id}` });
        }

        const password_hash = await bcrypt.hash(password, 10);

        conn = await pool.getConnection();
        const [result] = await conn.query(INSERT_USER_STATEMENT, [username, email, password_hash]);
        const newUserId = (result as any).insertId;
        await setAuthTokens(newUserId, email, res, 'user');

        return res.status(201).json({ message: "User Created", result });
    } catch (error) {
        console.log("Error occured", error);
        return res.status(500).json({ message: "Unexprected Error occurred, Try again later" });
    } finally {
        if (conn) conn.release();
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ message: "Email and Password are required" });
        }

        const users = await getUserByEmail(email);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];
        const passwordHash = user.password_hash;

        if (!passwordHash) {
            return res.status(500).json({ message: "User data corrupted" });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        await setAuthTokens(user.id, user.email, res, user.role || 'user');

        return res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email, role: user.role || 'user' } });
    } catch (error) {
        console.log("Login failed by Error: ", error);
        return res.status(500).json({ message: "Login failed, Please check again your Password" });
    }
}

const getUserDetails = async (req: Request, res: Response) => {
    // Fetch user profile details for the authenticated user (or optional route param)
    let conn;
    try {
        const idFromJwt = res.locals?.jwtData?.id;
        const idFromParams = (req.params as any)?.userId;
        const userId = idFromParams ?? idFromJwt; // usersRouter.get("/details/:userId", usersHandler.getUserDetails);

        if (!userId || isNaN(Number(userId))) {
            return res.status(400).json({ message: "User ID is required" });
        }

        conn = await pool.getConnection();
        const [rows] = await conn.query("SELECT * FROM user_details WHERE user_id = ?", [userId]);
        const detailsRows = rows as any[];

        if (!detailsRows || detailsRows.length === 0) {
            return res.status(404).json({ message: "User details not found" });
        }

        const details = { ...detailsRows[0] } as any;

        // Safely parse JSON columns if they exist
        const safeParse = (val: any) => {
            if (val === null || val === undefined) return null;
            if (typeof val !== 'string') return val;
            try { return JSON.parse(val); } catch { return null; }
        };

        details.experiences = safeParse(details.experiences);
        details.educations = safeParse(details.educations);
        details.certificates = safeParse(details.certificates);
        details.projects = safeParse(details.projects);

        return res.status(200).json({ message: "User details retrieved", details });
    } catch (error) {
        console.log("Error retrieving user details:", error);
        return res.status(500).json({ message: "Unexpected error retrieving user details" });
    } finally {
        if (conn) conn.release();
    }
}

const logoutUser = async (_req: Request, res: Response) => {
    try {
        res.clearCookie('access_token', {
            ...TOKEN_CONFIG.COOKIE_SETTINGS,
            path: '/'
        });
        res.clearCookie('refresh_token', {
            ...TOKEN_CONFIG.COOKIE_SETTINGS,
            path: '/'
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout failed:', error);
        return res.status(500).json({ message: 'Logout failed' });
    }
}

export { getUser, createUser, loginUser, setCookies, getUserById, getUserByUsername, getUserDetails };
export { logoutUser };
 
// Update or create user details (profile info)
export const updateUserDetails = async (req: Request, res: Response) => {
    let conn;
    try {
        const userId = res.locals.jwtData?.id;
        if (!userId || isNaN(Number(userId))) {
            return res.status(400).json({ message: "Invalid user context" });
        }

        const {
            username,
            email,
            about,
            country,
            address,
            avatar_url,
            cover_url,
            experiences,
            educations,
            certificates,
            projects,
        } = req.body || {};

        const street = address?.street || null;
        const city = address?.city || null;
        const region = address?.region || null;
        const postalCode = address?.postalCode || null;

        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Get old data for activity generation
        let oldData: any = null;
        try {
            const [oldRows] = await conn.query("SELECT * FROM user_details WHERE user_id = ?", [userId]);
            const oldDetailsRows = oldRows as any[];
            if (oldDetailsRows && oldDetailsRows.length > 0) {
                oldData = oldDetailsRows[0];
                // Parse JSON fields
                const safeParse = (val: any) => {
                    if (val === null || val === undefined) return null;
                    if (typeof val !== 'string') return val;
                    try { return JSON.parse(val); } catch { return null; }
                };
                oldData.experiences = safeParse(oldData.experiences);
                oldData.educations = safeParse(oldData.educations);
                oldData.certificates = safeParse(oldData.certificates);
                oldData.projects = safeParse(oldData.projects);
            }
        } catch (err) {
            console.log("Could not fetch old data for comparison:", err);
        }

        // Optionally update basic account info if provided
        if (username || email) {
            try {
                await conn.query(UPDATE_USER_BASIC_BY_ID, [
                    username ?? null,
                    email ?? null,
                    userId
                ]);
            } catch (err: any) {
                // Handle unique constraint violations gracefully
                if (err && err.code === 'ER_DUP_ENTRY') {
                    await conn.rollback();
                    return res.status(409).json({ message: 'Username or email already in use' });
                }
                throw err;
            }
        }

        await conn.query(UPSERT_USER_DETAILS_STATEMENT, [
            userId,
            about ?? null,
            country ?? null,
            street,
            city,
            region,
            postalCode,
            avatar_url ?? null,
            cover_url ?? null,
            experiences ? JSON.stringify(experiences) : null,
            educations ? JSON.stringify(educations) : null,
            certificates ? JSON.stringify(certificates) : null,
            projects ? JSON.stringify(projects) : null,
        ]);

        await conn.commit();

        // Generate activities based on profile changes (async, don't block response)
        const newData = {
            experiences,
            educations,
            certificates,
            projects
        };
        
        // Fire and forget - generate activities in background
        generateActivitiesFromProfileUpdate(parseInt(userId), oldData, newData)
            .catch(err => console.error("Error generating activities:", err));

        return res.status(200).json({ message: "User details saved" });
    } catch (error) {
        console.log("Error updating user details:", error);
        if (conn) try { await conn.rollback(); } catch {}
        return res.status(500).json({ message: "Unexpected error updating details" });
    } finally {
        if (conn) conn.release();
    }
}

// Download CV as PDF (requires authentication) - Temporary blank PDF implementation
export const downloadCV = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        const authUserId = res.locals?.jwtData?.id;
        if (!authUserId) {
            return res.status(401).json({ message: "Authentication required to download CV" });
        }

        const username = req.params.username;
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Generate a minimal blank PDF (Base64 encoded)
        // This is a valid blank PDF file
        const blankPDF = Buffer.from(
            'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURl' +
            'Y29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMABCM0MjBXNzSzMFQwszQwUAFe4DRAJ0bmRzdHJlYW0K' +
            'ZW5kb2JqCgozIDAgb2JqCjM2CmVuZG9iagoKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50' +
            'IDQgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyAyIDAgUgovUmVzb3VyY2Vz' +
            'IDw8Cj4+Cj4+CmVuZG9iagoKNCAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMg' +
            'WyA1IDAgUiBdCj4+CmVuZG9iagoKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgNCAw' +
            'IFIKL0xhbmcgKGVuKQo+PgplbmRvYmoKCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAw' +
            'MDAwMDIxNCAwMDAwMCBuIAowMDAwMDAwMDE5IDAwMDAwIG4gCjAwMDAwMDAxMzEgMDAwMDAgbiAK' +
            'MDAwMDAwMDI2MiAwMDAwMCBuIAowMDAwMDAwMTUwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUg' +
            'Ngovcm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzIxCiUlRU9G',
            'base64'
        );

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${username}_CV.pdf"`);
        res.setHeader('Content-Length', blankPDF.length.toString());
        
        return res.status(200).send(blankPDF);
    } catch (error) {
        console.log("Error downloading CV:", error);
        return res.status(500).json({ message: "Unexpected error downloading CV" });
    }
}