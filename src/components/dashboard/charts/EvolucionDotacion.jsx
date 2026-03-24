import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getEvolucionDotacion } from '../../../utils/aggregations';

const COLORS = ['#2E7D32', '#1565C0', '#F9A825', '#C62828', '#1B5E20', '#9E9E9E'];

const EvolucionDotacion = ({ rows }) => {
  const data = useMemo(() => getEvolucionDotacion(rows), [rows]);
  
  const contractTypes = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(k => k !== 'periodo');
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart 
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
        <defs>
          <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.05}/>
          </linearGradient>
          <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1565C0" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#1565C0" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="periodo" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700, fontFamily: 'Inter' }}
          interval={data.length > 24 ? 5 : data.length > 12 ? 2 : 0}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700, fontFamily: 'Inter' }}
          domain={[0, 'auto']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1B5E20', 
            borderRadius: '16px', 
            border: 'none', 
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
            padding: '12px',
            color: '#fff'
          }}
          labelStyle={{ fontWeight: 'black', color: '#fff', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase' }}
          itemStyle={{ color: '#fff', fontSize: '10px', padding: '2px 0' }}
        />
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle" 
          iconSize={6}
          wrapperStyle={{ paddingBottom: 20, fontSize: 10, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
        />
        {contractTypes.map((type, idx) => (
          <Area 
            key={type}
            type="monotone" 
            dataKey={type} 
            stackId="1"
            stroke={COLORS[idx % COLORS.length]} 
            strokeWidth={3}
            fill={idx === 0 ? "url(#colorPrimary)" : idx === 1 ? "url(#colorSecondary)" : "transparent"}
            activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[idx % COLORS.length] }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EvolucionDotacion;
