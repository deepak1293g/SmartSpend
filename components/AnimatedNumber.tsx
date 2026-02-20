
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, prefix = "", className = "" }) => {
  const springValue = useSpring(0, { stiffness: 45, damping: 15, mass: 1 });
  const displayValue = useTransform(springValue, (latest) => 
    `${prefix}${latest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return <motion.span className={className}>{displayValue}</motion.span>;
};

export default AnimatedNumber;
