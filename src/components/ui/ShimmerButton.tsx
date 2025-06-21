"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ShimmerButton = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold transition-all duration-300 ease-out rounded-lg shadow-lg group",
      "bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-blue-500 hover:to-neon-magenta",
      "text-white border-0",
      "hover:shadow-xl hover:shadow-neon-cyan/25",
      "focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900",
      className
    )}
    {...props}
  >
    {/* Shimmer effect */}
    <span className="absolute inset-0 w-full h-full">
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
    </span>
    
    {/* Content */}
    <span className="relative flex items-center">
      {children}
    </span>
  </motion.button>
);

export default ShimmerButton;