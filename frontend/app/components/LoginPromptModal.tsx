"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LoginPromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  action?: string;
};

const LoginPromptModal = ({ 
  isOpen, 
  onClose, 
  message = "You need to be logged in to perform this action.",
  action = "continue"
}: LoginPromptModalProps) => {
  const pathname = usePathname();

  // Save the current path to redirect back after login
  const handleLoginClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', pathname);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Login Required</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Please sign in to {action}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 text-center mb-6">
                  {message}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={handleLoginClick}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    Login to Continue
                  </Link>

                  <Link
                    href="/signup"
                    onClick={handleLoginClick}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                  >
                    <UserPlus className="w-5 h-5" />
                    Create New Account
                  </Link>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
