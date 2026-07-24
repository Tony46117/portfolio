import React, { useCallback, useEffect, useRef, useState } from 'react';

interface TextScrambleProps {
  texts: string[];
  className?: string;
  letterSpeed?: number;
  nextLetterSpeed?: number;
  pauseTime?: number;
}

export default function TextScramble({
  texts,
  className = '',
  letterSpeed = 40,
  nextLetterSpeed = 30,
  pauseTime = 3000,
}: TextScrambleProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const chars = '!<>-_\\/[]{}—=+*^?#$%&@';

  const scramble = useCallback((finalText: string, onComplete?: () => void) => {
    setIsAnimating(true);
    const textLength = finalText.length;
    let currentPos = 0;

    const doInterval = () => {
      if (currentPos >= textLength) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(finalText);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      const newDisplay = finalText.split('').map((char, idx) => {
        if (idx < currentPos) return char;
        // Random scramble character
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      setDisplayText(newDisplay);

      // Move to next position
      const ms = currentPos === 0 ? nextLetterSpeed * 3 : nextLetterSpeed;
      timeoutRef.current = window.setTimeout(() => {
        currentPos++;
        // Set the actual character at this position
        const updatedDisplay = finalText.split('').map((char, idx) => {
          if (idx <= currentPos - 1) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        setDisplayText(updatedDisplay);
      }, ms);
    };

    intervalRef.current = window.setInterval(doInterval, letterSpeed);
    // Run immediately
    doInterval();
  }, []);

  useEffect(() => {
    let currentIdx = 0;
    const textsLen = texts.length;

    const startScramble = (text: string) => {
      // Quick scramble introduction
      const scrambleLength = Math.min(8, text.length);
      let count = 0;
      const scrambleInterval = setInterval(() => {
        const scrambled = text.split('').map((char, idx) => {
          if (idx < count * Math.ceil(text.length / scrambleLength)) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        setDisplayText(scrambled);
        count++;
        if (count > scrambleLength) {
          clearInterval(scrambleInterval);
          // Full typewriter scramble
          scramble(text);
        }
      }, 50);
    };

    const cycleText = () => {
      currentIdx = (currentIdx + 1) % textsLen;
      const nextText = texts[currentIdx];
      startScramble(nextText);
      setCurrentTextIndex(currentIdx);
    };

    // Start with first text
    scramble(texts[0]);

    const mainInterval = setInterval(cycleText, pauseTime + texts[0].length * letterSpeed);

    return () => {
      clearInterval(mainInterval);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={`inline-block ${className}`}>
      {displayText || texts[0]}
      {isAnimating && (
        <span className="inline-block w-[3px] h-[0.9em] bg-indigo-400 ml-1 align-middle animate-pulse" />
      )}
    </span>
  );
}
