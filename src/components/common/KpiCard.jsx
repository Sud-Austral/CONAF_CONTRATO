import React from 'react';

const KpiCard = ({ title, value, icon, trend, unit }) => {
  return (
    <div className="bg-white p-6 rounded-[20px] shadow-card border-l-4 border-conaf-600 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1.5 flex-1">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-muted/80">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-display font-bold text-conaf-900 leading-none truncate block">
              {value}
            </span>
            {unit && <span className="text-xs font-bold text-conaf-600 uppercase tracking-tighter self-end mb-1 opacity-70">{unit}</span>}
          </div>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-bold bg-conaf-100 text-conaf-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-conaf-50 rounded-2xl flex items-center justify-center text-conaf-600 shadow-inner group-hover:bg-conaf-100 group-hover:scale-110 transition-all duration-500">
          {icon}
        </div>
      </div>
      
      {/* Background Graphic Decoration */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-conaf-50 rounded-full opacity-50 group-hover:scale-150 transition-all duration-700 pointer-events-none" />
    </div>
  );
};

export default KpiCard;
