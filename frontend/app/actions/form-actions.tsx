"use server";

import { z } from "zod";
import { LoginFormSchema, SignupFormSchema } from "../lib/definitions";
import axios from "../lib/axios";
import { getAuthHeaders } from "../lib/validateAuth";
import setCookieParse from 'set-cookie-parser';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export const loginAction = async (prevState: unknown, formData: FormData) => {
    // Validate fields
    const validateFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validateFields.success) {
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
        
        if (!res.headers["set-cookie"]) {
            console.error("No set-cookie header found in response");
            return {
                error: "Authentication failed. Please try again.",
                type: "auth_error"
            };
        }

        const cookieStore = await cookies();
        const cookieData = setCookieParse(res.headers["set-cookie"]!);
        
        cookieData.forEach((cookie) => {
            // Skip empty cookies (used for clearing)
            if (!cookie.value) {
                return;
            }
            
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
            } catch (error) {
                console.error("Error setting cookie:", cookie.name, error);
            }
        });
        
    } catch (error: any) {
        console.error("Login error:", error);
        
        // Check if this is a Next.js redirect - if so, let it propagate
        if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }
        
        // Handle axios errors with response
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error;
            
            if (status === 401 || status === 400) {
                return { 
                    error: message || "Invalid email or password. Please try again.",
                    type: "auth_error"
                };
            } else if (status === 404) {
                return {
                    error: "Account not found. Please check your email or sign up.",
                    type: "auth_error"
                };
            } else if (status === 429) {
                return {
                    error: "Too many login attempts. Please try again later.",
                    type: "rate_limit_error"
                };
            } else if (status >= 500) {
                return {
                    error: "Server error. Please try again later.",
                    type: "server_error"
                };
            }
            
            return { 
                error: message || "Login failed. Please try again.",
                type: "auth_error"
            };
        }
        
        // Handle network errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            return {
                error: "Cannot connect to server. Please check your internet connection.",
                type: "network_error"
            };
        }
        
        // Generic error fallback
        return { 
            error: error.message || "An unexpected error occurred. Please try again.",
            type: "unknown_error"
        };
    }
    
    redirect('/');
}

export const signupAction = async (prevState: unknown, formData: FormData) => {
    // Validate fields
    const validateFields = SignupFormSchema.safeParse({
        firstName: formData.get("first-name"),
        lastName: formData.get("last-name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validateFields.success) {
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

    } catch (error: any) {
        console.error("Signup error:", error);
        
        // Check if this is a Next.js redirect - if so, let it propagate
        if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }
        
        // Handle axios errors with response
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error;
            
            if (status === 409 || status === 400) {
                return { 
                    error: message || "This email is already registered. Please try logging in.",
                    type: "auth_error"
                };
            } else if (status === 422) {
                return {
                    error: message || "Invalid data provided. Please check your information.",
                    type: "validation_error"
                };
            } else if (status === 429) {
                return {
                    error: "Too many signup attempts. Please try again later.",
                    type: "rate_limit_error"
                };
            } else if (status >= 500) {
                return {
                    error: "Server error. Please try again later.",
                    type: "server_error"
                };
            }
            
            return { 
                error: message || "Signup failed. Please try again.",
                type: "auth_error"
            };
        }
        
        // Handle network errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            return {
                error: "Cannot connect to server. Please check your internet connection.",
                type: "network_error"
            };
        }
        
        // Generic error fallback
        return { 
            error: error.message || "An unexpected error occurred. Please try again.",
            type: "unknown_error"
        };
    }
    
    redirect('/');
}

export const logoutAction = async () => {
    const cookieStore = await cookies();
    
    // Clear the authentication cookies
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    
    // console.log("User logged out, cookies cleared");
    
    // Redirect to login page
    redirect('/login');
}

// Update user details (server action)
export const updateDetailsAction = async (prevState: unknown, formData: FormData) => {
    // Build payload from form fields (form inputs with name attr only)
    // console.log("formData entries:", Array.from(formData.entries()));

    // Parse dynamic lists serialized as JSON by hidden inputs
    const parseJSON = <T,>(raw: FormDataEntryValue | null, fallback: T): T => {
        if (typeof raw !== 'string') return fallback;
        try {
            const obj = JSON.parse(raw);
            return obj as T;
        } catch (e) {
            console.warn('Failed to parse JSON field:', e);
            return fallback;
        }
    };

    const experiences = parseJSON<any[]>(formData.get('experiences'), []);
    const educations = parseJSON<any[]>(formData.get('educations'), []);
    const certificates = parseJSON<any[]>(formData.get('certificates'), []);
    const projects = parseJSON<any[]>(formData.get('projects'), []);

    // Log to confirm we actually received certificate info
    // console.log('Received certificates:', certificates);
    // console.log('Received projects:', projects);

    // Prepare optional file uploads
    const uploadIfPresent = async (fileEntry: FormDataEntryValue | null): Promise<string | null> => {
        try {
            // Check if it's a file-like object with size property (works in both browser and Node.js)
            if (!fileEntry || typeof fileEntry === 'string' || !fileEntry.size || fileEntry.size === 0) return null;

            const headers = await getAuthHeaders();

            const fd = new FormData();
            fd.append('file', fileEntry, fileEntry.name);

            const res = await axios.post('/user/upload', fd, {
                headers: {
                    ...headers,
                    // Let axios set Content-Type for multipart/form-data automatically
                }
            });
            
            return res.data?.url ?? null;
        } catch (e) {
            console.warn('File upload skipped due to error:', e);
            return null;
        }
    };

    const avatarFile = formData.get('avatar');
    const coverFile = formData.get('cover');

    const [avatarUrl, coverUrl] = await Promise.all([
        uploadIfPresent(avatarFile),
        uploadIfPresent(coverFile)
    ]);

    const payload = {
        // Also allow updating basic account fields when provided
        username: (formData.get('username') as string) || null,
        email: (formData.get('email') as string) || null,
        about: (formData.get('about') as string) || null,
        country: (formData.get('country') as string) || null,
        address: {
            street: (formData.get('street-address') as string) || null,
            city: (formData.get('city') as string) || null,
            region: (formData.get('region') as string) || null,
            postalCode: (formData.get('postal-code') as string) || null,
        },
        // Not persisted yet on backend, but kept here for future use
        experiences,
        educations,
        certificates,
        projects,
        // Uploaded file URLs if provided
        avatar_url: avatarUrl,
        cover_url: coverUrl,
    };

    try {
        const headers = await getAuthHeaders();
        const res = await axios.put('/user/details', payload, { headers });
        const data = await res.data;

        return { ok: true, message: data?.message || 'Profile updated' };
    } catch (error) {
        console.error('Update details error:', error);
        if (error instanceof Error) {
            return { ok: false, message: error.message };
        }
        return { ok: false, message: 'An unexpected error occurred' };
    }
}