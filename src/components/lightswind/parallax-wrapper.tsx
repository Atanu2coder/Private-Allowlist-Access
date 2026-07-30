import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxWrapperProps {
  children: React.ReactNode;
  /**
   * The speed multiplier for the parallax effect.
   * Positive values move the element up as you scroll down (faster than scroll).
   * Negative values move the element down as you scroll down (slower than scroll).
   * E.g., 0.5 for a subtle effect, 2 for a dramatic effect.
   */
  speed?: number;
  className?: string;
}

export function ParallaxWrapper({ 
  children, 
  speed = 1, 
  className = "" 
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track the element's scroll progress relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // Triggers when the top of the element hits the bottom of the viewport, until the bottom hits the top
  });

  // Map the 0-1 progress to a pixel range.
  // We use the speed prop to scale the translation amount.
  const yRange = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  
  // Spring provides a buttery-smooth easing effect, removing any jitter
  const smoothY = useSpring(yRange, { 
    damping: 30, 
    stiffness: 100, 
    mass: 0.8 
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div 
        style={{ y: smoothY, willChange: "transform" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
