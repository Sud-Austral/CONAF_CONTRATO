import React, { useState, useEffect } from 'react';

const KpiCard = ({ title, value, icon, trend, unit, loading = false }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading) return;
    
    const numericPart = String(value).replace(/[^0-9.-]+/g, "");
    if (!numericPart || isNaN(parseFloat(numericPart))) {
       setDisplayValue(value);
       return;
    }

    const end = parseFloat(numericPart);
    if (end === 0) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        if (typeof value === 'string' && value.includes('$')) {
           setDisplayValue(new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Math.floor(start)));
        } else if (typeof value === 'string' && value.includes('.')) {
           setDisplayValue(new Intl.NumberFormat('es-CL').format(Math.floor(start)));
        } else {
           setDisplayValue(Math.floor(start));
        }
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, loading]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-[32px] shadow-premium border-t-4 border-neutral-100 overflow-hidden relative">
        <div className="space-y-4">
          <div className="w-20 h-2 skeleton-shimmer rounded-full" />
          <div className="w-28 h-8 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    );
  }

  // Determinar tamaño de fuente dinámico según longitud del valor
  const valueLength = String(displayValue).length;
  const fontSizeClass = valueLength > 12 ? 'text-xl lg:text-2xl' : 
                        valueLength > 8  ? 'text-2xl lg:text-3xl' : 
                        'text-3xl lg:text-4xl';

  return (
    <div className="bg-white p-6 lg:p-8 rounded-[32px] shadow-premium border-t-4 border-primary relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[9px] font-black uppercase tracking-extreme text-neutral-400 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="w-10 h-10 bg-neutral-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner border border-neutral-100/50">
            {React.cloneElement(icon, { size: 18, strokeWidth: 2 })}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`${fontSizeClass} font-mono font-black text-neutral-900 leading-tight tracking-tighter tabular-nums break-words`}>
              {displayValue}
            </span>
            {unit && <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest pb-1">{unit}</span>}
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-50">
            <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(76,175,80,0.4)] animate-pulse" />
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
