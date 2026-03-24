import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { getEvolucionRemuneracion } from '../../../utils/aggregations';
import { fmtCLP, fmtCLPShort } from '../../../utils/formatters';

const EvolucionRemuneracion = ({ rows }) => {
  const data = useMemo(() => getEvolucionRemuneracion(rows), [rows]);
  const averageGlobal = useMemo(() => {
    if (data.length === 0) return 0;
    return data.reduce((acc, curr) => acc + curr.promedio, 0) / data.length;
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart 
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
        <defs>
          <linearGradient id="colorPromedio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2d6a2d" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#2d6a2d" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="periodo" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#64748b' }}
          interval={data.length > 24 ? 5 : data.length > 12 ? 2 : 0}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#64748b' }}
          tickFormatter={(val) => fmtCLPShort(val)}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px' }}
          labelStyle={{ fontWeight: 'bold', color: '#1e4d1e', marginBottom: '4px' }}
          formatter={(val) => [fmtCLP(val), "Bruto Promedio"]}
        />
        {averageGlobal > 0 && (
          <ReferenceLine 
            y={averageGlobal} 
            stroke="#94a3b8" 
            strokeDasharray="5 5"
            label={{ 
              value: `Prom: ${fmtCLPShort(averageGlobal)}`, 
              position: 'right', 
              fill: '#64748b', 
              fontSize: 10, 
              fontWeight: 'bold',
              offset: 10 
            }}
          />
        )}
        <Area 
          type="monotone" 
          dataKey="promedio" 
          stroke="#2d6a2d" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorPromedio)" 
          dot={{ r: 4, fill: '#2d6a2d', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 0, fill: '#c8a84b' }}
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EvolucionRemuneracion;
