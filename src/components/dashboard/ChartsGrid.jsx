import React from 'react';
import DotacionPorContrato from './charts/DotacionPorContrato';
import EvolucionDotacion from './charts/EvolucionDotacion';
import DistribucionSexo from './charts/DistribucionSexo';
import DistribucionEdad from './charts/DistribucionEdad';
import EvolucionRemuneracion from './charts/EvolucionRemuneracion';
import TopCargos from './charts/TopCargos';

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
      <CardChart title="Distribución por Tipo de Contrato">
        <DotacionPorContrato rows={filteredRows} />
      </CardChart>

      <CardChart title="Evolución Histórica de Dotación">
        <EvolucionDotacion rows={filteredRows} />
      </CardChart>

      <CardChart title="Distribución por Sexo">
        <DistribucionSexo rows={filteredRows} />
      </CardChart>

      <CardChart title="Dotación por Tramo Etario y Sexo">
        <DistribucionEdad rows={filteredRows} />
      </CardChart>

      <CardChart title="Evolución Remuneración Bruta Promedio">
        <EvolucionRemuneracion rows={filteredRows} />
      </CardChart>

      <CardChart title="Top 10 Cargos Institucionales">
        <TopCargos rows={filteredRows} />
      </CardChart>
    </div>
  );
};

export default ChartsGrid;
