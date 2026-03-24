import React, { useMemo } from 'react';
import { getLatestPeriodInfo } from '../../utils/aggregations';
import { fmtCLP, truncate } from '../../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';

const COLORS = ['#2E7D32', '#1565C0', '#9E9E9E'];

const LatestPeriodStats = ({ filteredRows }) => {
  const latestInfo = useMemo(() => getLatestPeriodInfo(filteredRows), [filteredRows]);

  if (!latestInfo) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Columna 1: Métricas Directas del Último Mes */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Award size={18} className="text-primary" />
          Métricas Actuales ({latestInfo.label})
        </h3>
        
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-all duration-500" />
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Gasto Mensual Total</span>
            <span className="text-2xl font-display font-bold text-neutral-900">{fmtCLP(latestInfo.gastoTotal)}</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary mt-2 bg-primary/10 w-fit px-2 py-0.5 rounded-full">
              <TrendingUp size={10} />
              Bruta Mensual
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-110 transition-all duration-500" />
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Dotación del Periodo</span>
            <span className="text-2xl font-display font-bold text-neutral-900">{latestInfo.dotacion}</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary mt-2 bg-secondary/10 w-fit px-2 py-0.5 rounded-full">
              <Users size={10} />
              Colaboradores Activos
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-6">
          <div className="h-24 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={latestInfo.sexDist}
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {latestInfo.sexDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Distribución de Género Actual</span>
            {latestInfo.sexDist.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </div>
                <span className="text-xs font-bold text-neutral-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna 2-3: Top 10 Remuneraciones Brutas */}
      <div className="xl:col-span-2">
        <div className="bg-white rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden h-full flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={18} className="text-secondary" />
              Top 10 Remuneraciones — {latestInfo.label}
            </h3>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">Pos</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">Funcionario</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">Cargo</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">Contrato</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 text-right">R. Bruta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {latestInfo.top10Brutas.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-6 py-3 text-sm font-display font-bold text-neutral-300 group-hover:text-primary">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-neutral-900">{truncate(row.nombre, 25)}</td>
                    <td className="px-6 py-3 text-xs text-neutral-500">{row.cargo}</td>
                    <td className="px-6 py-3 text-center text-[10px] font-bold text-neutral-400">{row.contrato}</td>
                    <td className="px-6 py-3 text-right font-display font-bold text-neutral-900">{fmtCLP(row.bruta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestPeriodStats;
