import React from 'react';
import { useConafData } from '../../context/DataContext';
import KpiRow from './KpiRow';
import ChartsGrid from './ChartsGrid';
import { LayoutDashboard, Trees, Activity, Info } from 'lucide-react';

const DashboardPage = () => {
  const { rows, contratos, loading, total } = useConafData();

  if (loading && rows.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50/10 h-full">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 animate-pulse">Sincronizando Auditoría...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-700 bg-neutral-50/10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-extreme text-primary">
            <LayoutDashboard size={12} />
            <span>Panel de Gestión Integral</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black font-display text-neutral-900 tracking-tight leading-tight">
            Métricas de <span className="text-primary">Auditoría</span>
          </h1>
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest max-w-xl">
             Análisis de {rows.length} empleados activos y {contratos.length} contratos en el ciclo de vida actual.
          </p>
        </div>

        <div className="px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3 text-primary animate-in slide-in-from-right-4">
          <Activity size={16} strokeWidth={3} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-extreme">API: Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <div className="bg-white p-8 rounded-[40px] shadow-premium border border-neutral-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trees size={120} />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-extreme text-neutral-400 mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-neutral-200" />
            Indicadores Clave de Proceso (KPIs)
          </h2>
          <KpiRow filteredRows={rows} contracts={contratos} />
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-premium border border-neutral-100">
          <h2 className="text-[10px] font-black uppercase tracking-extreme text-neutral-400 mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-neutral-200" />
            Distribución de la Dotación por Modalidad y Cargos
          </h2>
          <ChartsGrid filteredRows={rows} />
        </div>
      </div>

      <footer className="bg-neutral-900 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
         <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
         <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
               <Info size={20} className="text-primary-light" />
            </div>
            <div>
               <p className="text-white text-xs font-black uppercase tracking-widest">Información Crítica</p>
               <p className="text-white/40 text-[9px] font-bold uppercase tracking-extreme mt-1">Los datos actuales provienen directamente de la base de datos de producción sincronizada con Railway.</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
