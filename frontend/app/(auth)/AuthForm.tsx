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

        </section>
    )
}

export default AuthForm