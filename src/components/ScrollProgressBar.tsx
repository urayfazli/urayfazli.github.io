import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Smooth spring physics for responsive and fluid scroll tracking
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div 
      id="scroll-progress-container"
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        id="scroll-progress-indicator"
        className="h-full bg-[#2B6CB0] origin-left shadow-[0_0_8px_rgba(43,108,176,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
};
