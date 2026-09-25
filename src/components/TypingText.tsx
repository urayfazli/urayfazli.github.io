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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;

    // Initial delay before typing begins
    const startDelay = setTimeout(() => {
      const typeNextChar = () => {
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
    }, delay);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay]);

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
