"use client";

import { motion } from "framer-motion";
import { logoutAction } from "../actions/form-actions";
import type { UserDetails } from "../lib/user";
import Image from "next/image";

type User = {
    id: number,
    username: string,
    email: string,
    created_at: string
}

type ProfileCardProps = User & {
    details?: UserDetails
}

const ProfileCard = (props: ProfileCardProps) => {
    const handleLogout = async () => {
        await logoutAction();
    };

    console.log("Rendering ProfileCard with props:", props);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 max-w-md mx-auto bg-white/5 rounded-xl shadow-lg space-y-6 border border-white/10"
        >
            <div className="text-center">
                {/* Display avatar if available */}
                {props.details?.avatar_url && (
                    <div className="mb-4 flex justify-center">
                        <img 
                            src={props.details.avatar_url} 
                            alt={`${props.username}'s avatar`}
                            className="size-24 rounded-full object-cover border-2 border-white/20"
                        />
                    </div>
                )}
                <h2 className="text-3xl font-bold text-white mb-2">Profile</h2>
                <p className="text-sm text-gray-400">Welcome back!</p>
            </div>
            
            <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Username</p>
                    <p className="text-white font-semibold">{props.username}</p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="text-white font-semibold">{props.email}</p>
                </div>

                {props.details?.about && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">About</p>
                        <p className="text-white">{props.details.about}</p>
                    </div>
                )}

                {props.details?.country && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Location</p>
                        <p className="text-white">{props.details.country}</p>
                    </div>
                )}
                
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">User ID</p>
                    <p className="text-white font-semibold">#{props.id}</p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Member Since</p>
                    <p className="text-white font-semibold">
                        {new Date(props.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="w-full mt-6 rounded-md bg-red-500 hover:bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
                Logout
            </button>
        </motion.div>
    );
}

export default ProfileCard;