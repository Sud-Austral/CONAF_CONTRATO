import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { getDotacionPorContrato } from '../../../utils/aggregations';

const COLORS = ['#2d6a2d', '#4a9e4a', '#6ab86a', '#a8d8a8', '#c8a84b', '#1a3d1a'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.value;
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 shadow-xl border border-conaf-100 rounded-lg">
        <p className="font-bold text-conaf-800 text-sm mb-1">{label}</p>
        <p className="text-sm font-medium text-text-muted">
          Funcionarios: <span className="font-bold text-conaf-600">{total}</span>
        </p>
      </div>
    );
  }
  return null;
};

const DotacionPorContrato = ({ rows }) => {
  const data = useMemo(() => getDotacionPorContrato(rows), [rows]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false}
          tickLine={false}
          width={100}
          tick={{ fontSize: 11, fill: '#4b5563', fontWeight: 600 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <Bar 
          dataKey="value" 
          radius={[0, 8, 8, 0]} 
          barSize={24}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DotacionPorContrato;
