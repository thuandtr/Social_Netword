"use server";

import { z } from "zod";
import { LoginFormSchema, SignupFormSchema } from "../lib/definitions";
import axios from "axios";
import setCookieParse from 'set-cookie-parser';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export const loginAction = async (prevState: unknown, formData: FormData) => {
    console.log("prevState:", prevState);

    const validateFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validateFields.success) {
        // return { errorsTypeA: validateFields.error.flatten().fieldErrors };
        return { errors: z.treeifyError(validateFields.error).properties };
    }

    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const res = await axios.post("/user/login", {
            email,
            password
        });
        const data = await res.data;

        console.log("Login response data:", data);
        console.log("Login response headers:", res.headers['set-cookie']);
        console.log("All response headers:", Object.keys(res.headers));
        
        if (!res.headers["set-cookie"]) {
            console.error("No set-cookie header found in response");
            throw new Error("Authentication cookies not received from server");
        }

        const cookieStore = await cookies();
        const cookieData = setCookieParse(res.headers["set-cookie"]!);
        
        console.log("Parsed cookie data:", cookieData);
        
        cookieData.forEach((cookie) => {
            // Skip empty cookies (used for clearing)
            if (!cookie.value) {
                console.log("Skipping empty cookie:", cookie.name);
                return;
            }
            
            console.log("Setting cookie:", cookie.name, "with value length:", cookie.value?.length);
            
            try {
                // Simplified cookie setting with minimal options
                cookieStore.set(cookie.name, cookie.value, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'lax',
                    // Only set secure in production
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: cookie.name === 'access_token' ? 3600 : 30 * 24 * 3600 // 1 hour for access, 30 days for refresh
                });
                console.log("Successfully set cookie:", cookie.name);
            } catch (error) {
                console.error("Error setting cookie:", cookie.name, error);
            }
        });

        console.log("About to redirect to /profile");
        
    } catch (error) {
        console.error("Login error:", error);
        
        // Check if this is a Next.js redirect - if so, let it propagate
        if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }
        
        // Return a proper error response instead of throwing
        if (error instanceof Error) {
            return { 
                error: error.message || "Login failed. Please try again.",
                type: "auth_error"
            };
        }
        
        return { 
            error: "An unexpected error occurred. Please try again.",
            type: "unknown_error"
        };
    }
    
    // Redirect to profile page after successful login
    redirect('/profile');
}

export const signupAction = async (prevState: unknown, formData: FormData) => {
    console.log("prevState:", prevState);
    
    const validateFields = SignupFormSchema.safeParse({
        firstName: formData.get("first-name"),
        lastName: formData.get("last-name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validateFields.success) {
        // return { errorsTypeA: validateFields.error.flatten().fieldErrors };
        return { errors: z.treeifyError(validateFields.error).properties };
    }

    const email = formData.get("email");
    const password = formData.get("password");
    const username = `${formData.get("first-name")} ${formData.get("last-name")}`.replace(/\s+/g, ' ').trim();

    try {
        const res = await axios.post("/user/signup", {
            username,
            email,
            password
        });
        const data = await res.data;

        console.log("Signup response data:", data);
        console.log("Signup response headers:", res.headers['set-cookie']);

        const cookieStore = await cookies();
        const cookieData = setCookieParse(res.headers["set-cookie"]!);
        cookieData.forEach((cookie) => {
            // Keep cookies httpOnly for security (matching backend configuration)
            cookieStore.set(cookie.name, cookie.value, {
                path: cookie.path || '/',
                maxAge: cookie.maxAge,
                expires: cookie.expires,
                secure: cookie.secure,
                sameSite: (cookie.sameSite as "lax" | "strict" | "none") || "lax",
                // Keep httpOnly true for security - cookies are handled server-side only
                httpOnly: cookie.httpOnly !== false // Use the same setting as backend
            });
        });

    } catch (error) {
        console.error("Signup error:", error);
        
        // Check if this is a Next.js redirect - if so, let it propagate
        if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }
        
        // Return a proper error response for other errors
        if (error instanceof Error) {
            return { 
                error: error.message || "Signup failed. Please try again.",
                type: "auth_error"
            };
        }
        
        return { 
            error: "An unexpected error occurred. Please try again.",
            type: "unknown_error"
        };
    }
    
    redirect('/profile');
}

export const logoutAction = async () => {
    const cookieStore = await cookies();
    
    // Clear the authentication cookies
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    
    console.log("User logged out, cookies cleared");
    
    // Redirect to login page
    redirect('/login');
}