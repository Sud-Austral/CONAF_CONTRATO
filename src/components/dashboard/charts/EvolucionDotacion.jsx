import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getEvolucionDotacion } from '../../../utils/aggregations';

const COLORS = ['#2d6a2d', '#c8a84b', '#4a9e4a', '#6ab86a', '#1a3d1a', '#94a3b8'];

const EvolucionDotacion = ({ rows }) => {
  const data = useMemo(() => getEvolucionDotacion(rows), [rows]);
  
  // Extraer nombres de contratos de la primera fila (excluyendo el campo periodo)
  const contractTypes = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(k => k !== 'periodo');
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
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
          domain={[0, 'auto']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
          }}
          labelStyle={{ fontWeight: 'bold', color: '#1e4d1e', marginBottom: '4px' }}
        />
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle" 
          iconSize={8}
          wrapperStyle={{ paddingBottom: 10, fontSize: 11, color: '#334155', fontWeight: 500 }}
        />
        {contractTypes.map((type, idx) => (
          <Line 
            key={type}
            type="monotone" 
            dataKey={type} 
            stroke={COLORS[idx % COLORS.length]} 
            strokeWidth={2.5}
            dot={{ r: 3, fill: COLORS[idx % COLORS.length], strokeWidth: 1, stroke: '#fff' }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EvolucionDotacion;
