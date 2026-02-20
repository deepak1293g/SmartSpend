
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title }) => {
  return (
    <div className={`glass rounded-2xl p-6 transition-all duration-300 hover:border-white/20 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-white/90">{title}</h3>}
      {children}
    </div>
  );
};

export default GlassCard;
