import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList 
} from 'recharts';
import { getDotacionPorContrato } from '../../../utils/aggregations';
import { FileText } from 'lucide-react';

const COLORS = ['#1B5E20', '#2E7D32', '#43A047', '#66BB6A', '#A5D6A7', '#C8E6C9'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-primary-dark/95 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-premium animate-in zoom-in-95 duration-200">
        <p className="text-[9px] font-black text-primary-light uppercase tracking-extreme mb-2 border-b border-white/10 pb-1">{name}</p>
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-[10px] font-bold">Dotación:</span>
          <span className="text-sm font-mono font-black text-white">{value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const DotacionPorContrato = ({ rows }) => {
  const data = useMemo(() => getDotacionPorContrato(rows), [rows]);

  if (!rows || rows.length === 0 || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neutral-300 space-y-4 animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center shadow-inner">
          <FileText size={32} strokeWidth={1} className="opacity-20" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-extreme">Sin datos de contrato</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 10, right: 60, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F0F0F0" strokeWidth={0.5} />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false}
          tickLine={false}
          width={120}
          tick={{ fontSize: 9, fill: '#A0A0A0', fontWeight: 800, fontFamily: 'Open Sans' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(46, 125, 50, 0.03)' }} />
        <Bar 
          dataKey="value" 
          radius={[0, 16, 16, 0]} 
          barSize={20}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          {/* Recomendación 12: Etiquetas de valor directas */}
          <LabelList 
            dataKey="value" 
            position="right" 
            style={{ fontSize: 10, fill: '#1B5E20', fontWeight: 900, fontFamily: 'Roboto Mono' }}
            offset={15}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DotacionPorContrato;
