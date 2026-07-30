import React from "react";
import { motion } from "framer-motion";

export function AuroraTextEffect({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.span
      className={`relative inline-flex bg-clip-text text-transparent bg-gradient-to-r from-[#00ff9d] via-[#00e5ff] to-[#00ff9d] ${className}`}
      style={{
        backgroundSize: "200% auto",
      }}
      animate={{
        backgroundPosition: ["0% center", "200% center"],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}
