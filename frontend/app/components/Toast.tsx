"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
};

const Toast = ({ 
  message, 
  type = "info", 
  isOpen, 
  onClose, 
  duration = 4000 
}: ToastProps) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-4 left-1/2 z-[60] min-w-[300px] max-w-md"
        >
          <div className={`${colors[type]} text-white rounded-lg shadow-2xl p-4 flex items-center gap-3`}>
            <div className="flex-shrink-0">
              {icons[type]}
            </div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
