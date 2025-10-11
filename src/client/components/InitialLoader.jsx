import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InitialLoader({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish(); // hide splash after animation
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-red-100 z-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Logo Text */}
          <motion.h1
            className="text-6xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent select-none"
          >
            LSH
          </motion.h1>

          {/* Shine Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: "easeInOut",
            }}
            style={{
              mixBlendMode: "overlay",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
