import React, { useMemo } from 'react';
import KpiCard from '../common/KpiCard';
import { Users, TrendingUp, Wallet, Briefcase } from 'lucide-react';
import { getKpis } from '../../utils/aggregations';
import { fmtCLP } from '../../utils/formatters';

const KpiRow = ({ filteredRows }) => {
  const kpis = useMemo(() => getKpis(filteredRows), [filteredRows]);

  const cards = [
    {
      title: "Dotación Total",
      value: new Intl.NumberFormat('es-CL').format(kpis.dotacionTotal),
      unit: "Funcionarios",
      icon: <Users size={24} />,
      trend: "Personal Único"
    },
    {
      title: "R. Bruta Promedio",
      value: fmtCLP(kpis.brutaPromedio),
      icon: <TrendingUp size={24} />,
      trend: "Basado en registros"
    },
    {
      title: "R. Líquida Promedio",
      value: fmtCLP(kpis.liquidaPromedio),
      icon: <Wallet size={24} />,
      trend: "Neto estimado"
    },
    {
      title: "Contrato Principal",
      value: kpis.contratoMasFrecuente,
      unit: `${kpis.pctContrato}%`,
      icon: <Briefcase size={24} />,
      trend: "Moda de contrato"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in slide-in-from-top-4 duration-500 delay-150">
      {cards.map((card, idx) => (
        <KpiCard key={idx} {...card} />
      ))}
    </div>
  );
};

export default KpiRow;
