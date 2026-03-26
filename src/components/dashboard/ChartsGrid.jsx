import React from 'react';
import DotacionPorContrato from './charts/DotacionPorContrato';
import TopCargos from './charts/TopCargos';

// Simularemos o generaremos componentes rápidos para las nuevas métricas si no existen
const CardChart = ({ title, children }) => (
  <div className="bg-white p-6 rounded-[22px] shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300">
    <h3 className="text-sm font-bold font-display text-neutral-800 mb-6 flex items-center gap-3">
      <span className="w-1.5 h-4 bg-primary rounded-full" />
      {title}
    </h3>
    <div className="h-[300px] w-full">
      {children}
    </div>
  </div>
);

const ChartsGrid = ({ filteredRows }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
      
      <CardChart title="Distribución por Modalidad de Contrato">
        <DotacionPorContrato rows={filteredRows} />
      </CardChart>

      <CardChart title="Top Cargos por Dotación">
        <TopCargos rows={filteredRows} />
      </CardChart>

      {/* Aquí podríamos añadir un gráfico de Histogramas de sueldos si tienes Recharts configurado */}
      <div className="lg:col-span-2 p-10 bg-slate-50 border border-dashed border-slate-200 rounded-[32px] text-center">
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Los datos históricos y de género han sido removidos para priorizar métricas de auditoría vigentes.
         </p>
      </div>

    </div>
  );
};

export default ChartsGrid;
