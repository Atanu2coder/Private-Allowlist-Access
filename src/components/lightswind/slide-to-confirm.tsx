import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

export interface SlideToConfirmProps {
  onConfirm: () => void;
  text?: string;
  loadingText?: string;
  isLoading?: boolean;
  className?: string;
}

export function SlideToConfirm({
  onConfirm,
  text = "Slide to Connect",
  loadingText = "Connecting...",
  isLoading = false,
  className = ""
}: SlideToConfirmProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useAnimation();
  const x = useMotionValue(0);

  useEffect(() => {
    if (isLoading) {
      setIsConfirmed(true);
    } else {
      setIsConfirmed(false);
      dragControls.start({ x: 0 });
    }
  }, [isLoading, dragControls]);

  const handleDragEnd = (event: any, info: any) => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const buttonWidth = 56; 
    const threshold = containerWidth - buttonWidth;

    if (info.offset.x >= threshold * 0.7) {
      dragControls.start({ x: threshold - 4 });
      setIsConfirmed(true);
      onConfirm();
    } else {
      dragControls.start({ x: 0 });
    }
  };

  const textOpacity = useTransform(x, [0, 100], [1, 0]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-[320px] h-[64px] bg-primary-container/20 rounded-full flex items-center p-2 border border-primary-container/30 overflow-hidden shadow-[0_0_20px_rgba(0,255,157,0.1)] ${className}`}
    >
      <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-headline-sm text-primary-container font-medium ml-8">
          {text}
        </span>
      </motion.div>

      {isLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center z-20 bg-primary-container rounded-full"
        >
           <span className="w-6 h-6 rounded-full border-2 border-background/30 border-t-background animate-spin mr-3"></span>
           <span className="font-headline-sm text-background font-bold">{loadingText}</span>
        </motion.div>
      ) : (
        <motion.div
          className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-[0_0_15px_rgba(0,255,157,0.4)] relative"
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.05}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={dragControls}
          style={{ x }}
        >
          <span className="material-symbols-outlined text-background font-bold">arrow_forward</span>
        </motion.div>
      )}
    </div>
  );
}
