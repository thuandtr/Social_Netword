"use client";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { ExclamationCircleIcon, CheckCircleIcon, XCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid'
import React, { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type props = {
    isSignup: boolean;
    action: (prevState: unknown, f: FormData) => Promise<{
        errors?: {
            email?: { errors: string[] } | undefined;
            password?: { errors: string[] } | undefined;
            firstName?: { errors: string[] } | undefined;
            lastName?: { errors: string[] } | undefined;
        } | undefined;
        message?: string | undefined;
        error?: string | undefined;
        type?: string | undefined;
        success?: boolean | undefined;
    }>;
}

const AuthForm = ({ isSignup, action }: props) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    //@ts-ignore
    const [state, formAction] = useActionState(action, undefined);

    // Handle redirect after successful login/signup
    useEffect(() => {
        if (state?.success || (!state?.error && !state?.errors)) {
            // Check if there's a stored redirect path
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
                router.push(redirectPath);
            }
        }
        // Reset submitting state when we get a response
        if (state) {
            setIsSubmitting(false);
        }
    }, [state, router]);

    // Handle form submission
    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        await formAction(formData);
    };

    // Handle Google OAuth login
    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth endpoint
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        window.location.href = `${backendUrl}/api/v1/auth/google`;
    };

    return (
        <section className='w-full max-w-md'>
            <form action={handleSubmit}>
                
                <div className="space-y-12">
                    <div className="border-b border-white/10 pb-4">
                        <h2 className="text-base/7 font-semibold text-white">
                            {isSignup ? "Create Your Account" : "Welcome Back"}
                        </h2>
                        <p className="text-sm/6 text-gray-400 mb-4">
                            {isSignup 
                                ? "Please provide your information to create a new account." 
                                : "Please sign in to your account to continue."
                            }
                        </p>

                        <div className="flex flex-col gap-4">

                            {isSignup && (
                                <div className='flex gap-4 items-start justify-between'>
                                    <div className="flex-1">
                                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-white">
                                            First name
                                        </label>
                                        <div className="mt-2 relative">
                                            <input
                                                id="first-name"
                                                name="first-name"
                                                type="text"
                                                autoComplete="given-name"
                                                disabled={isSubmitting}
                                                className={`block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 transition-colors ${
                                                    state?.errors?.firstName ? 'outline-red-500/50 focus:outline-red-500' : ''
                                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            />
                                            {state?.errors?.firstName && (
                                                <ExclamationCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-red-400" />
                                            )}
                                        </div>
                                        {/* <div className="min-h-[20px] mt-1">
                                            {state?.errors?.firstName && (
                                                <p className="text-xs text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {state.errors.firstName.errors[0]}
                                                </p>
                                            )}
                                        </div> */}
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-white">
                                            Last name
                                        </label>
                                        <div className="mt-2 relative">
                                            <input
                                                id="last-name"
                                                name="last-name"
                                                type="text"
                                                autoComplete="family-name"
                                                disabled={isSubmitting}
                                                className={`block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 transition-colors ${
                                                    state?.errors?.lastName ? 'outline-red-500/50 focus:outline-red-500' : ''
                                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            />
                                            {state?.errors?.lastName && (
                                                <ExclamationCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-red-400" />
                                            )}
                                        </div>
                                        {/* <div className="min-h-[20px] mt-1">
                                            {state?.errors?.lastName && (
                                                <p className="text-xs text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {state.errors.lastName.errors[0]}
                                                </p>
                                            )}
                                        </div> */}
                                    </div>


                                </div>
                            )}


                            <div className='flex flex-col gap-4'>
                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                                        Email address
                                    </label>
                                    <div className="mt-2 relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            disabled={isSubmitting}
                                            placeholder="you@example.com"
                                            className={`block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 transition-colors ${
                                                state?.errors?.email ? 'outline-red-500/50 focus:outline-red-500' : ''
                                            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                        {state?.errors?.email && (
                                            <ExclamationCircleIcon className="absolute right-3 top-2.5 h-5 w-5 text-red-400" />
                                        )}
                                    </div>
                                    {/* <div className="min-h-[20px] mt-1">
                                        {state?.errors?.email && (
                                            <p className="text-xs text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {state.errors.email.errors[0]}
                                            </p>
                                        )}
                                    </div> */}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                                        Password
                                    </label>
                                    <div className="mt-2 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete={isSignup ? "new-password" : "current-password"}
                                            disabled={isSubmitting}
                                            placeholder={isSignup ? "Min 6 characters with special char" : "Enter your password"}
                                            className={`block w-full rounded-md bg-white/5 px-3 py-2 pr-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 transition-colors ${
                                                state?.errors?.password ? 'outline-red-500/50 focus:outline-red-500' : ''
                                            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isSubmitting}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {/* <div className="min-h-[20px] mt-1">
                                        {state?.errors?.password ? (
                                            <p className="text-xs text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {state.errors.password.errors[0]}
                                            </p>
                                        ) : isSignup ? (
                                            <p className="text-xs text-gray-500">
                                                Must be at least 6 characters with 1 special character
                                            </p>
                                        ) : null}
                                    </div> */}
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {/* General error messages at the bottom */}
                <div className="min-h-[60px]">
                    {state?.error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-start gap-2">
                                <XCircleIcon className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-red-400">
                                        {state.error}
                                    </p>
                                    {state.type === "auth_error" && (
                                        <p className="text-xs text-red-300/70 mt-0.5">
                                            {isSignup 
                                                ? "Please check your information or try logging in."
                                                : "Please verify your credentials and try again."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {state?.success && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-start gap-2">
                                <CheckCircleIcon className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs font-medium text-green-400">
                                    {state.message}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-x-6">
                    <button 
                        type="button" 
                        className="text-sm/6 font-semibold text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-500 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{isSignup ? "Creating..." : "Signing in..."}</span>
                            </>
                        ) : (
                            <span>{isSignup ? "Create Account" : "Sign In"}</span>
                        )}
                    </button>
                </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-zinc-900 px-4 text-gray-400">Or continue with</span>
                </div>
            </div>

            {/* Google OAuth Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                Sign {isSignup ? 'up' : 'in'} with Google
            </button>
        </section>
    )
}

export default AuthForm