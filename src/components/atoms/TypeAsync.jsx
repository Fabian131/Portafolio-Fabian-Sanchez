import React, { useState, useEffect, memo } from 'react';

const TypeAsync = memo(({ words, className = '' }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getTypeInterval = () => {
    // Slower typing: 50-200ms per character
    const randomMs = 150 * Math.random() + 50;
    return randomMs;
  };

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      const currentWord = words[currentWordIndex];

      if (isPaused) {
        // Longer display duration: 3.5 seconds
        await sleep(3500);
        if (cancelled) return;
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      if (isDeleting) {
        // Deleting mode (slower deletion)
        if (displayText.length > 0) {
          await sleep(getTypeInterval() * 0.7);
          if (cancelled) return;
          setDisplayText(prev => prev.slice(0, -1));
        } else {
          // Move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        // Typing mode
        if (displayText.length < currentWord.length) {
          await sleep(getTypeInterval());
          if (cancelled) return;
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          // Word complete, pause before deleting
          setIsPaused(true);
        }
      }
    };

    runAnimation();

    return () => {
      cancelled = true;
    };
  }, [displayText, isDeleting, isPaused, currentWordIndex, words]);

  return (
    <span className={`${className}`}>
      {displayText}
      <span className="blinking-cursor">_</span>
    </span>
  );
});

export default TypeAsync;
