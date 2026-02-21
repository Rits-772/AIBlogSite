import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CardNav = ({
  items = [],
  onSelect = () => {},
  className = '',
  activeItemIndex = 0
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  return (
    <nav className={`flex items-center gap-1 p-2 bg-card/50 backdrop-blur-sm border border-border rounded-2xl ${className}`}>
      {items.map((item, index) => {
        const isActive = activeItemIndex === index;
        
        return (
          <button
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onSelect(index)}
            className={`relative px-4 py-2 rounded-xl text-sm font-mono tracking-wider transition-colors duration-200 outline-none
              ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            <AnimatePresence>
              {hoveredIndex === index && !isActive && (
                <motion.div
                  layoutId="nav-hover"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-muted rounded-xl -z-10"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                />
              )}
            </AnimatePresence>
            
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 bg-primary rounded-xl -z-10"
                transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
              />
            )}
            
            <span className="relative z-10">{item.label || item}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default CardNav;
