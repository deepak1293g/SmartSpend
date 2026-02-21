
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterBrandProps {
  className?: string;
  large?: boolean;
  animate?: boolean;
}

const TypewriterBrand: React.FC<TypewriterBrandProps> = ({ className = "", large = false, animate = true }) => {
  const fullText = "SmartSpend";
  const [displayText, setDisplayText] = useState(animate ? "" : fullText);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    if (!animate) return;

    const handleType = () => {
      if (!isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setSpeed(150);

        if (displayText === fullText) {
          setIsDeleting(true);
          setSpeed(3000); // Longer pause at the end
        }
      } else {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setSpeed(75);

        if (displayText === "") {
          setIsDeleting(false);
          setSpeed(1000);
        }
      }
    };

    const timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, speed, animate]);

  const smartPart = displayText.substring(0, 5);
  const spendPart = displayText.substring(5);

  if (large) {
    return (
      <div className={`flex flex-row md:flex-col items-baseline md:items-start ${className}`}>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none pr-1 md:pr-4">
          {smartPart}
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none flex items-center pr-6 md:pr-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-white to-emerald-400">
            {spendPart}
          </span>
        </h1>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-xl font-extrabold tracking-tighter text-white uppercase italic pr-2">
        {displayText.substring(0, 5)}
        <span className="text-indigo-500">{displayText.substring(5)}</span>
      </span>
    </div>
  );
};

export default TypewriterBrand;
