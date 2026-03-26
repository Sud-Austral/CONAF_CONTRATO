import React from 'react';
import { fmtCLP } from '../../../utils/formatters';

const SalaryField = ({ label, name, value, onChange, original }) => {
  const numVal = typeof value === 'string' ? parseFloat(value) : (value || 0);
  const numOriginal = typeof original === 'string' ? parseFloat(original) : (original || 0);
  const isChanged = numVal !== numOriginal;
  
  return (
    <div className={`flex flex-col gap-1.5 p-4 rounded-2xl transition-all border ${isChanged ? 'bg-emerald-50 border-emerald-200' : 'bg-neutral-50 border-neutral-100'}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[9px] uppercase font-black text-neutral-400 tracking-extreme">{label}</label>
        {isChanged && <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full uppercase">Actualizado</span>}
      </div>
      
      <div className="relative group/input">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">$</span>
        <input 
          type="number" 
          name={name} 
          value={numVal} 
          onChange={(e) => onChange(name, parseFloat(e.target.value) || 0)}
          className="w-full pl-5 py-1 text-lg font-black text-neutral-900 bg-transparent focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <div className="text-[9px] font-black text-neutral-400 mt-1 flex justify-between items-center uppercase tracking-widest">
          <span>Previsualización:</span>
          <span className="text-primary font-black">{fmtCLP(numVal)}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Sección de remuneración: usa el campo normalizado NO-SQL (.bruta)
 */
const RemuneracionSection = ({ formData, originalData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-right-8 duration-500">
      <SalaryField 
        label="Remuneración Bruta Mensual" 
        name="bruta" 
        value={formData.bruta} 
        onChange={onChange}
        original={originalData?.bruta}
      />
      <SalaryField 
        label="Sueldo Base (Para PDF)" 
        name="base" 
        value={formData.base} 
        onChange={onChange}
        original={originalData?.base}
      />
    </div>
  );
};

export default RemuneracionSection;
