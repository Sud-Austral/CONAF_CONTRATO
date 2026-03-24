import React, { useMemo, useState } from 'react';
import { useConafData } from '../../context/DataContext';
import { useFilters } from '../../hooks/useFilters';
import FilterSidebar from '../layout/FilterSidebar';
import KpiRow from './KpiRow';
import ChartsGrid from './ChartsGrid';
import { Filter, ChevronRight, LayoutDashboard, Trees } from 'lucide-react';

const DashboardPage = () => {
  const { rows } = useConafData();
  const { filters, setFilter, resetFilters, filteredRows } = useFilters(rows);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const Breadcrumb = () => (
    <nav className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-extreme text-neutral-400">
        <Trees size={12} className="text-primary-light" />
        <span>CONAF</span>
      </div>
      <ChevronRight size={10} className="text-neutral-200" />
      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-extreme text-primary">
        <LayoutDashboard size={12} />
        <span>Dashboard de Personal</span>
      </div>
    </nav>
  );

  return (
    <div className="flex h-full bg-bg overflow-hidden relative font-body">
      {/* Sidebar de filtros */}
      <FilterSidebar 
        filters={filters} 
        setFilter={setFilter} 
        resetFilters={resetFilters} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Recomendación 16: Mobile Filter FAB */}
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-8 left-8 z-[60] bg-primary text-white p-4 rounded-3xl shadow-premium flex items-center gap-3 active:scale-95 transition-all lg:hidden animate-in zoom-in-50 duration-300"
        >
          <Filter size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-extreme">Filtrar</span>
        </button>
      )}

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
        {/* Recomendación 14: Breadcrumb Contextual */}
        <Breadcrumb />

        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
          <div className="space-y-3">
             <h1 className="text-3xl lg:text-4xl font-black font-display text-neutral-900 tracking-tight leading-tight">
               Cuadro de Mando <span className="text-primary">Integrado</span>
             </h1>
             <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest max-w-xl">
               Inteligencia de Datos RR.HH. — {new Intl.NumberFormat('es-CL').format(filteredRows.length)} registros bajo auditoría.
             </p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
             {/* Recomendación 6: Badge Consistente */}
            <div className={`px-5 py-2.5 rounded-2xl flex items-center gap-3 border shadow-soft transition-all duration-500 ${filteredRows.length > 0 ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/20 text-error'}`}>
              <div className={`w-2 h-2 rounded-full ${filteredRows.length > 0 ? 'bg-success animate-pulse' : 'bg-error'}`} />
              <span className="text-[10px] font-black uppercase tracking-extreme whitespace-nowrap">
                {filteredRows.length > 0 ? 'Datos Activos' : 'Filtro Sin Resultados'}
              </span>
            </div>
          </div>
        </header>

        {filteredRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] shadow-premium border border-neutral-100 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-200 mb-8 shadow-inner ring-4 ring-neutral-50/50">
              <Filter size={32} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-black font-display text-neutral-900 mb-3 tracking-tight">Criterios de búsqueda sin coincidencias</h2>
            <p className="text-neutral-400 mb-10 max-w-sm text-center text-xs font-bold uppercase tracking-widest">Ajusta los filtros laterales para regenerar las métricas dinámicas.</p>
            <button 
              onClick={resetFilters}
              className="bg-primary hover:bg-primary-dark text-white font-black py-4 px-10 rounded-2xl shadow-premium active:scale-95 transition-all text-[11px] uppercase tracking-extreme"
            >
              Cargar datos por defecto
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-12">
              <KpiRow filteredRows={filteredRows} />
              
              <div className="pt-4 border-t border-neutral-100/50">
                 <h2 className="text-[10px] font-black uppercase tracking-extreme text-neutral-400 mb-10 flex items-center gap-3">
                    <span className="w-8 h-px bg-neutral-200" />
                    Analítica Transversal y Tendencias
                 </h2>
                 <ChartsGrid filteredRows={filteredRows} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
