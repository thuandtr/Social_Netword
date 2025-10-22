"use client";

import { motion } from "framer-motion";

type User = {
    id: number,
    username: string,
    email: string,
    created_at: string
}

const ProfileCard = (props: User) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4"
        >
            <h2 className="text-2xl font-bold">Profile Card</h2>
            {/* Display user information here */}
        </motion.div>
    );
}

export default ProfileCard;