import React from 'react';

const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="space-y-1 relative group">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-conaf-900 border-l-4 border-conaf-500 pl-4 tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-sm font-semibold text-gray-700 pl-5 border-l-4 border-transparent">
          {subtitle}
        </p>
      )}
      <div className="absolute -bottom-2 left-5 w-24 h-1 bg-conaf-400 rounded-full group-hover:bg-gold group-hover:w-full transition-all duration-700" />
    </div>
  );
};

export default SectionTitle;
