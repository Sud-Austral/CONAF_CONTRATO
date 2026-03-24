import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getDistribucionEdad } from '../../../utils/aggregations';

const DistribucionEdad = ({ rows }) => {
  const data = useMemo(() => getDistribucionEdad(rows), [rows]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="horizontal"
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        barGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="age_label" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#64748b' }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#64748b' }} 
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px' }}
          labelStyle={{ fontWeight: 'bold', color: '#1e4d1e', marginBottom: '8px' }}
        />
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle" 
          iconSize={8}
          wrapperStyle={{ paddingBottom: 15, fontSize: 11, fontWeight: 500 }}
        />
        <Bar 
          name="Masculino" 
          dataKey="M" 
          fill="#2d6a2d" 
          radius={[4, 4, 0, 0]} 
          barSize={12}
          animationDuration={1500}
        />
        <Bar 
          name="Femenino" 
          dataKey="F" 
          fill="#c8a84b" 
          radius={[4, 4, 0, 0]} 
          barSize={12}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DistribucionEdad;
