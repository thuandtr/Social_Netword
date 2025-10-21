import { z } from 'zod';

const LoginFormSchema = z.object({
    email: z.string().trim().pipe(z.email({message: "Invalid email address"})),
    password: z.string()
        .min(1, {message: "Password is required"})
        .trim(),
});

const SignupFormSchema = z.object({
    firstName: z.string().min(1, {message: "First name is required"}).trim(),
    lastName: z.string().min(1, {message: "Last name is required"}).trim(),
    email: z.string().trim().pipe(z.email({message: "Invalid email address"})),
    password: z.string()
        .min(6, {message: "Password must be at least 6 characters"})
        .trim()
        .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
            message: "Password must contain at least 1 special character"
        }),
});


export { LoginFormSchema, SignupFormSchema };