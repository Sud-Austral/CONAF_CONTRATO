import React from 'react';

const KpiCard = ({ title, value, icon, trend, unit, color = 'primary' }) => {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-soft border border-neutral-100 border-l-4 border-l-primary relative overflow-hidden group hover:shadow-premium transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4 flex-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl lg:text-4xl font-data font-black text-neutral-900 leading-none tracking-tight tabular-nums">
              {value}
            </span>
            {unit && <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest self-end mb-1">{unit}</span>}
          </div>
          {trend && (
            <div className="flex items-center gap-2 mt-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
              <span className="text-[9px] font-black text-primary-dark uppercase tracking-widest opacity-80">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-neutral-50/50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
          {React.cloneElement(icon, { size: 22, strokeWidth: 1.5 })}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
