import React from 'react';
import { fmtRut, fmtFecha } from '../../../utils/formatters';

const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1.5 p-3.5 bg-neutral-50 border border-neutral-100 rounded-xl">
    <span className="text-[9px] uppercase font-black text-neutral-400 tracking-extreme leading-none">{label}</span>
    <span className="text-sm font-bold text-neutral-900 truncate mt-1">{value || '—'}</span>
  </div>
);

/**
 * Sección de solo lectura: utiliza campos NORMALIZADOS (.id, .nombre, .cargo, etc.)
 */
const ReadOnlySection = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
      <InfoField label="RUT del Funcionario" value={fmtRut(employee.rut)} />
      <InfoField label="Nombre del Funcionario" value={employee.nombre} />
      <InfoField label="Organismo / División" value={employee.organismo} />
      <InfoField label="Modalidad Actual" value={employee.contratoTipo} />
      <InfoField label="Fecha de Inicio" value={fmtFecha(employee.fechaInicio)} />
      <InfoField label="Cargo Institucional" value={employee.cargo} />
    </div>
  );
};

export default ReadOnlySection;
