import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate slower, elegant loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1500); // Extended wait for smooth fade
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 1; // Slower progress increments
      });
    }, 250);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="loading-screen"
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
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "linear" }}
              />
            </div>
            <span className="font-mono text-[8px] text-muted-foreground/40 tracking-[0.2em]">
              {Math.min(progress, 100).toString().padStart(3, '0')}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
