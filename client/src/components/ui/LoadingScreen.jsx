import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep ref up to date to avoid effect rebuilds
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Handle the progress interval purely
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(prev + Math.floor(Math.random() * 5) + 1, 100);
      });
    }, 250);

    return () => clearInterval(timer);
  }, []);

  // Handle side effects when progress hits 100
  useEffect(() => {
    if (progress >= 100) {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 1500);
      }
    }
    return () => {
      if (timeoutRef.current && progress < 100) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-atmosphere-deep"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Elegant Logo Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="font-display text-[44px] tracking-tight text-foreground/80 leading-none" style={{ textShadow: "0 0 40px rgba(var(--foreground), 0.1)" }}>
            Midnight
          </span>
          <div className="h-8 w-px bg-primary/20" />
          <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-muted-foreground/80">
            A workspace for thought
          </span>
        </motion.div>

        {/* Minimalist Progress Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative h-[1px] w-24 bg-border/30 overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary/60"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.4, ease: "linear" }}
            />
          </div>
          <span className="font-mono text-[8px] text-muted-foreground/40 tracking-[0.2em]">
            {Math.min(progress, 100).toString().padStart(3, '0')}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
