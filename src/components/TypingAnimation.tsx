import { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  className?: string;
}

export function TypingAnimation({ text, className = '' }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const typeText = (startIndex = 0) => {
      let currentIndex = startIndex;
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
          
          // Start erasing after a pause
          const eraseTimer = setTimeout(() => {
            eraseText();
          }, 1000);
          
          timers.push(eraseTimer);
        }
      }, 50);
      
      timers.push(typingInterval);
    };

    const eraseText = () => {
      let eraseIndex = text.length;
      const erasingInterval = setInterval(() => {
        if (eraseIndex > 0) {
          setDisplayedText(text.substring(0, eraseIndex - 1));
          eraseIndex--;
        } else {
          clearInterval(erasingInterval);
          
          // Restart typing after a pause
          const restartTimer = setTimeout(() => {
            setDisplayedText('');
            setIsTyping(true);
            typeText(0);
          }, 500);
          
          timers.push(restartTimer);
        }
      }, 50);
      
      timers.push(erasingInterval);
    };

    // Start the animation
    setDisplayedText('');
    setIsTyping(true);
    typeText(0);

    // Cleanup
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
}