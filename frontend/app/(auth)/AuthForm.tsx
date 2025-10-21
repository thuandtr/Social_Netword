"use client";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import React, { useActionState } from 'react'

type props = {
    isSignup: boolean;
    action: (prevState: unknown, f: FormData) => Promise<{
        errors?: {
            email?: { errors: string[] } | undefined;
            password?: { errors: string[] } | undefined;
        } | undefined;
        message?: string | undefined;
    }>;
}

const AuthForm = ({ isSignup, action }: props) => {

    //@ts-ignore
    const [state, formAction] = useActionState(action, undefined);

    return (
        <section className='w-1/4'>
            <form action={formAction}>
                State: {JSON.stringify(state)}
                <div className="space-y-12">
                    <div className="border-b border-white/10 pb-12">
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
                                <div className='flex no-wrap items-center justify-between'>
                                    <div className="">
                                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-white">
                                            First name
                                        </label>
                                        <div className="">
                                            <input
                                                id="first-name"
                                                name="first-name"
                                                type="text"
                                                autoComplete="given-name"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>

                                    <div className="">
                                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-white">
                                            Last name
                                        </label>
                                        <div className="">
                                            <input
                                                id="last-name"
                                                name="last-name"
                                                type="text"
                                                autoComplete="family-name"
                                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>


                                </div>
                            )}


                            <div className='flex flex-col gap-4'>
                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                                        Email address
                                    </label>
                                    <div className="">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                                        Password
                                    </label>
                                    <div className="">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm/6 font-semibold text-white">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        { isSignup ? "Create Account" : "Login"}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default AuthForm