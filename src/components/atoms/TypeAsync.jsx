import React, { useState, useEffect, memo } from 'react';

const TypeAsync = memo(({ words, className = '' }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getTypeInterval = () => {
    const baseMs = 100 * Math.random() + 40;
    return baseMs;
  };

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      const currentWord = words[currentWordIndex];

      if (isPaused) {
        await sleep(2800);
        if (cancelled) return;
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      if (isDeleting) {
        if (displayText.length > 0) {
          await sleep(getTypeInterval() * 0.5);
          if (cancelled) return;
          setDisplayText(prev => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        if (displayText.length < currentWord.length) {
          await sleep(getTypeInterval());
          if (cancelled) return;
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          setIsPaused(true);
        }
      }
    };

    runAnimation();

    return () => {
      cancelled = true;
    };
  }, [displayText, isDeleting, isPaused, currentWordIndex, words]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={`${className}`}>
      {displayText}
      <span style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 80ms' }}>|</span>
    </span>
  );
});

export default TypeAsync;
