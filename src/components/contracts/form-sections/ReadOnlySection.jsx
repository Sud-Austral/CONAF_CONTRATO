import React from 'react';
import { fmtRut } from '../../../utils/formatters';

const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1.5 p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm">
    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-body leading-none">{label}</span>
    <span className="text-sm font-bold text-conaf-900 truncate">{value || '—'}</span>
  </div>
);

const ReadOnlySection = ({ employee }) => {
  if (!employee) return null;

  return (
    <div className="p-6 grid grid-cols-2 gap-4 animate-in fade-in duration-500">
      <InfoField label="RUT del Funcionario" value={fmtRut(employee.rut)} />
      <InfoField label="Nombre Registrado" value={employee.nombrecompleto_x} />
      <InfoField label="Nombre Encontrado" value={employee.nombreencontrado} />
      <div className="grid grid-cols-2 gap-4">
        <InfoField label="Sexo" value={employee.sexo === 'M' ? 'Masculino' : 'Femenino'} />
        <InfoField label="Tramo Etario" value={employee.age_label} />
      </div>
    </div>
  );
};

export default ReadOnlySection;
