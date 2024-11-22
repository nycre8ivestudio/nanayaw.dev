"use client"

import React from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

export function RotatingText({ className }) {
  return (
    <div className={cn("relative w-40 h-40 select-none", className)}>
      {/* Outer circle with rotating text */}
      <motion.div
        className="absolute w-full h-full border-dashed border border-gray-900 dark:border-gray-100 rounded-full p-1"
        animate={{ rotate: 360 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path 
            id="textPath"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
            className="text-gray-900 dark:text-gray-100"
          />
          <text className="text-[8px] uppercase tracking-[0.3em] fill-current">
            <textPath href="#textPath">
              My Projects • My Latest Projects •
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Down arrow in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ArrowDown className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </div>
    </div>
  );
}