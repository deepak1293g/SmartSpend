
import React from 'react';

interface TypewriterBrandProps {
  className?: string;
  large?: boolean;
  animate?: boolean;
}

const TypewriterBrand: React.FC<TypewriterBrandProps> = ({ className = "", large = false }) => {

  if (large) {
    return (
      <div className={`flex flex-col items-center gap-4 md:gap-5 ${className}`}>
        {/* Clean minimal heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-center leading-[1.1] select-none">
          <span className="text-white">Smart</span>
          <span className="text-indigo-400">Spend</span>
        </h1>
        {/* Minimal accent line */}
        <div className="w-12 h-0.5 bg-indigo-500/60 rounded-full" />
      </div>
    );
  }

  // Navbar / footer variant
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-lg md:text-xl font-bold tracking-tight text-white">
        Smart<span className="text-indigo-400">Spend</span>
      </span>
    </div>
  );
};

export default TypewriterBrand;
