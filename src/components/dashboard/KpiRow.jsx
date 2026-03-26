import React, { useMemo } from 'react';
import KpiCard from '../common/KpiCard';
import { Users, TrendingUp, Wallet, FileCheck, Shield } from 'lucide-react';
import { getKpis } from '../../utils/aggregations';
import { fmtCLP } from '../../utils/formatters';

const KpiRow = ({ filteredRows, contracts = [] }) => {
  const kpis = useMemo(() => getKpis(filteredRows), [filteredRows]);
  
  // Métricas adicionales de auditoría de contratos
  const auditMetrics = useMemo(() => {
    // Cuántos empleados únicos tienen al menos un contrato en la lista
    const uniqueEmpsInContracts = new Set(contracts.map(c => c.empleado_id)).size;
    const completedContracts = contracts.filter(c => c.estado === 'completado').length;
    
    return {
      cobertura: Math.round((contracts.length / (filteredRows.length || 1)) * 100),
      totalCompletos: completedContracts,
      pctEficiencia: Math.round((completedContracts / (contracts.length || 1)) * 100)
    };
  }, [contracts, filteredRows]);

  const cards = [
    {
      title: "Dotación Total",
      value: new Intl.NumberFormat('es-CL').format(kpis.dotacionTotal),
      unit: "Funcionarios",
      icon: <Users size={24} />,
      trend: "Personal Activo",
      color: "primary"
    },
    {
      title: "Cobertura Contratos",
      value: `${contracts.length} / ${kpis.dotacionTotal}`,
      unit: `${auditMetrics.cobertura}%`,
      icon: <FileCheck size={24} />,
      trend: "Contratos Generados"
    },
    {
      title: "Eficiencia Auditoría",
      value: `${auditMetrics.totalCompletos}`,
      unit: `${auditMetrics.pctEficiencia}%`,
      icon: <Shield size={24} />,
      trend: "Estado: Completados"
    },
    {
      title: "Gasto Mensual",
      value: fmtCLP(kpis.gastoTotalMes),
      icon: <Wallet size={24} />,
      trend: "Estimado (Brutos)"
    },
    {
      title: "Rem. Bruta Promedio",
      value: fmtCLP(kpis.brutaPromedio),
      icon: <TrendingUp size={24} />,
      trend: "Histórico"
    },
    {
      title: "Contrato Principal",
      value: kpis.contratoMasFrecuente,
      unit: `${kpis.pctContrato}%`,
      icon: <Shield size={22} />,
      trend: "Moda Contractual"
    },
    {
      title: "Diversidad de Cargos",
      value: kpis.cargosUnicos,
      unit: "Cargos",
      icon: <Users size={22} />,
      trend: "Selección Única"
    },
    {
      title: "Efectividad Digital",
      value: `${Math.round(contracts.filter(c => c.pdf_generado_path).length)}`,
      unit: "PDFs",
      icon: <FileCheck size={24} />,
      trend: "Archivos Firmados"
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
