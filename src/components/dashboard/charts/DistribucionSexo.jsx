import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getDistribucionSexo } from '../../../utils/aggregations';

const COLORS = {
  "Masculino": '#2d6a2d',
  "Femenino": '#c8a84b'
};

const DistribucionSexo = ({ rows }) => {
  const data = useMemo(() => getDistribucionSexo(rows), [rows]);
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: 11, fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
            formatter={(value) => `${new Intl.NumberFormat('es-CL').format(value)} Funcionarios`}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Central label for the donut */}
      <div className="absolute top-[42.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total</p>
        <p className="text-2xl font-display font-bold text-conaf-900 leading-tight">
          {new Intl.NumberFormat('es-CL').format(total)}
        </p>
      </div>
    </div>
  );
};

export default DistribucionSexo;
