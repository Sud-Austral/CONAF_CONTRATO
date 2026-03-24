import React, { useMemo, useState } from 'react';
import { useConafData } from '../../context/DataContext';
import { useFilters } from '../../hooks/useFilters';
import FilterSidebar from '../layout/FilterSidebar';
import KpiRow from './KpiRow';
import ChartsGrid from './ChartsGrid';
import SectionTitle from '../common/SectionTitle';

const DashboardPage = () => {
  const { rows } = useConafData();
  const { filters, setFilter, resetFilters, filteredRows } = useFilters(rows);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-full bg-bg overflow-hidden">
      {/* Sidebar de filtros */}
      <FilterSidebar 
        filters={filters} 
        setFilter={setFilter} 
        resetFilters={resetFilters} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionTitle 
            title="Cuadro de Mando Integrado — Personal CONAF"
            subtitle={`Visualización analítica de ${new Intl.NumberFormat('es-CL').format(filteredRows.length)} registros de personal encontrados.`}
          />
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${filteredRows.length > 0 ? 'bg-conaf-100 text-conaf-700' : 'bg-red-100 text-red-700'}`}>
              Estado: {filteredRows.length > 0 ? 'Datos Activos' : 'Sin Resultados'}
            </div>
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm font-bold text-xs text-conaf-600 border border-conaf-100 hover:bg-conaf-50"
              >
                Filtros
              </button>
            )}
          </div>
        </header>

        {filteredRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[20px] shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <span className="text-3xl font-display">?</span>
            </div>
            <h2 className="text-xl font-bold font-display text-gray-800 mb-2">Sin resultados para los filtros seleccionados</h2>
            <p className="text-gray-500 mb-8 max-w-sm text-center">Intenta ajustando los criterios de búsqueda en el panel lateral para visualizar la información.</p>
            <button 
              onClick={resetFilters}
              className="bg-conaf-600 hover:bg-conaf-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md active:scale-95 transition-all text-sm"
            >
              Restablecer todos los filtros
            </button>
          </div>
        ) : (
          <>
            <KpiRow filteredRows={filteredRows} />
            <ChartsGrid filteredRows={filteredRows} />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
