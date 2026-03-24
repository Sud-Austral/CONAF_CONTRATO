import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { getTopCargos } from '../../../utils/aggregations';

const TopCargos = ({ rows }) => {
  const data = useMemo(() => getTopCargos(rows, 10), [rows]);

  // Color gradient based on index (darker to lighter)
  const getFill = (index) => {
    const opacity = 1 - (index * 0.08); // Decrease opacity for lower ranks
    return `rgba(45, 106, 45, ${opacity})`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="cargo" 
          type="category" 
          axisLine={false}
          tickLine={false}
          width={180}
          tick={{ fontSize: 10, fill: '#4b5563', fontWeight: 600 }}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px' }}
          labelStyle={{ fontWeight: 'bold', color: '#1e4d1e', marginBottom: '4px' }}
          formatter={(value) => [`${value} Funcionarios`, "Total"]}
        />
        <Bar 
          dataKey="count" 
          radius={[0, 8, 8, 0]} 
          barSize={20}
          animationDuration={2000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getFill(index)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopCargos;
