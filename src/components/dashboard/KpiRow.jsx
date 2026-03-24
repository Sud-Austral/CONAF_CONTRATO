import React, { useMemo } from 'react';
import KpiCard from '../common/KpiCard';
import { Users, TrendingUp, Wallet, Briefcase, Calendar } from 'lucide-react';
import { getKpis, getLatestPeriodInfo } from '../../utils/aggregations';
import { fmtCLP } from '../../utils/formatters';

const KpiRow = ({ filteredRows }) => {
  const kpis = useMemo(() => getKpis(filteredRows), [filteredRows]);
  const latestInfo = useMemo(() => getLatestPeriodInfo(filteredRows), [filteredRows]);

  const cards = [
    {
      title: "Corte de Datos",
      value: latestInfo?.label || "—",
      icon: <Calendar size={24} />,
      trend: "Último Periodo",
      color: "primary"
    },
    {
      title: "Dotación Total",
      value: new Intl.NumberFormat('es-CL').format(kpis.dotacionTotal),
      unit: "Funcionarios",
      icon: <Users size={24} />,
      trend: "Personal Único"
    },
    {
      title: "Gasto Mensual",
      value: fmtCLP(kpis.gastoTotalMes),
      icon: <Wallet size={24} />,
      trend: "Último Mes"
    },
    {
      title: "R. Bruta Promedio",
      value: fmtCLP(kpis.brutaPromedio),
      icon: <TrendingUp size={24} />,
      trend: "Histórico"
    },
    {
      title: "Contrato Principal",
      value: kpis.contratoMasFrecuente,
      unit: `${kpis.pctContrato}%`,
      icon: <Briefcase size={24} />,
      trend: "Moda"
    },
    {
      title: "Mujeres en Dotación",
      value: `${kpis.pctMujeres}%`,
      icon: <Users size={24} />,
      trend: "Género"
    },
    {
      title: "Rango Etario Mayor",
      value: kpis.rangoEtarioModa,
      icon: <Users size={22} />,
      trend: "Grupo Mayoritario"
    },
    {
      title: "R. Líquida Prom.",
      value: fmtCLP(kpis.liquidaPromedio),
      icon: <Wallet size={24} />,
      trend: "Estimado"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in slide-in-from-top-4 duration-500">
      {cards.map((card, idx) => (
        <KpiCard key={idx} {...card} />
      ))}
    </div>
  );
};

export default KpiRow;
