import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursorClassName?: string;
}

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 45,
  delay = 400,
  className = '',
  cursorClassName = 'bg-[#9d613c]',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(() =>
    typeof document !== 'undefined' && document.body.hasAttribute('data-djbot-walking')
  );

  useEffect(() => {
    const handleWalkChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isWalking: boolean }>;
      setIsPaused(Boolean(customEvent.detail?.isWalking));
    };
    window.addEventListener('djbot-walk-change', handleWalkChange);
    return () => window.removeEventListener('djbot-walk-change', handleWalkChange);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let charIndex = displayedText.length;

    if (isPaused) {
      return;
    }

    if (charIndex >= text.length) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    // Initial delay only when starting from 0
    const initialWait = charIndex === 0 ? delay : speed;

    const startDelay = setTimeout(() => {
      const typeNextChar = () => {
        if (document.body.hasAttribute('data-djbot-walking')) {
          return;
        }
        if (charIndex < text.length) {
          charIndex++;
          setDisplayedText(text.slice(0, charIndex));

          // Slight pause after comma for natural punctuation cadence
          const currentChar = text[charIndex - 1];
          const charSpeed = currentChar === ',' ? speed * 3.5 : speed + (Math.random() * 20 - 10);

          timeoutId = setTimeout(typeNextChar, charSpeed);
        } else {
          setIsTyping(false);
        }
      };

      typeNextChar();
    }, initialWait);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay, isPaused]);

  // Reset displayedText when text prop changes (e.g. language switch)
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
  }, [text]);

  return (
    <p
      className={`relative inline-block ${className}`}
      aria-label={text}
    >
      <span>{displayedText}</span>
      {/* Animated Typing Cursor */}
      <span
        className={`inline-block w-[3px] sm:w-[3.5px] h-[1.15em] ml-1 rounded-sm align-middle animate-pulse ${cursorClassName}`}
        aria-hidden="true"
        style={{
          animationDuration: isTyping ? '0.6s' : '1.1s',
        }}
      />
    </p>
  );
};
