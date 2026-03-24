import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getEvolucionDotacion } from '../../../utils/aggregations';
import { Trees } from 'lucide-react';

const COLORS = ['#2E7D32', '#1565C0', '#F9A825', '#C62828', '#1B5E20', '#9E9E9E'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-dark/95 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-premium animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-primary-light uppercase tracking-extreme mb-3 border-b border-white/10 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-bold text-white/80">{entry.name}</span>
              </div>
              <span className="text-[11px] font-mono font-black text-white">{entry.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
           <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Total Periodo</span>
           <span className="text-[11px] font-mono font-black text-primary-light">
             {payload.reduce((acc, curr) => acc + curr.value, 0)}
           </span>
        </div>
      </div>
    );
  }
  return null;
};

const EvolucionDotacion = ({ rows }) => {
  const data = useMemo(() => getEvolucionDotacion(rows), [rows]);
  
  const contractTypes = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(k => k !== 'periodo');
  }, [data]);

  // Recomendación 13: Estado vacío
  if (!rows || rows.length === 0 || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neutral-300 space-y-4 animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center shadow-inner">
          <Trees size={32} strokeWidth={1} className="opacity-20" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-extreme">Sin datos históricos</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart 
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorDot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" strokeWidth={0.5} />
        <XAxis 
          dataKey="periodo" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 9, fill: '#A0A0A0', fontWeight: 800, fontFamily: 'Open Sans' }}
          interval={data.length > 24 ? 5 : data.length > 12 ? 2 : 0}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 9, fill: '#A0A0A0', fontWeight: 800, fontFamily: 'Roboto Mono' }}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle" 
          iconSize={6}
          wrapperStyle={{ paddingBottom: 25, fontSize: 10, color: '#A0A0A0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}
        />
        {contractTypes.map((type, idx) => (
          <Area 
            key={type}
            type="monotone" 
            dataKey={type} 
            stackId="1"
            stroke={COLORS[idx % COLORS.length]} 
            strokeWidth={3}
            fill={idx === 0 ? "url(#colorDot)" : "transparent"}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: COLORS[idx % COLORS.length] }}
            animationDuration={1500}
            animationBegin={idx * 100}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EvolucionDotacion;
