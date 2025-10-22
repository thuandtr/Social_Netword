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

        redirect('/profile');
        // return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
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
        redirect('/profile');
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
}