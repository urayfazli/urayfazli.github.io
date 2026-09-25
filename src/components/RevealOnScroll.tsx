import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number; // Delay in milliseconds for staggered animation
  className?: string;
  threshold?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  delay = 0,
  className = '',
  threshold = 0.12,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If user prefers reduced motion, reveal instantly
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    // Fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      style={{
        transitionDuration: '750ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all will-change-[opacity,transform] ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};
