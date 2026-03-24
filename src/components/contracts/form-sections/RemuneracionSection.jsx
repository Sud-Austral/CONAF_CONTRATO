import React from 'react';
import { fmtCLP } from '../../../utils/formatters';

const SalaryField = ({ label, name, value, onChange, original }) => {
  const isChanged = parseFloat(value) !== parseFloat(original);
  
  return (
    <div className={`flex flex-col gap-1.5 p-4 rounded-2xl transition-all border ${isChanged ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] uppercase font-bold text-gray-700 tracking-wider font-body">{label}</label>
        {isChanged && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">Actualizado</span>}
      </div>
      
      <div className="relative group/input">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-conaf-400 font-bold">$</span>
        <input 
          type="number" 
          name={name} 
          value={value || 0} 
          onChange={(e) => onChange(name, parseFloat(e.target.value) || 0)}
          className="w-full pl-5 py-1 text-lg font-display font-bold text-conaf-900 bg-transparent focus:outline-none focus:ring-b-2 focus:ring-emerald-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <div className="text-[10px] font-bold text-gray-600 mt-1 flex justify-between items-center group-focus-within/input:text-emerald-700 transition-colors">
          <span>Vista Previa:</span>
          <span>{fmtCLP(value)}</span>
        </div>
      </div>
    </div>
  );
};

const RemuneracionSection = ({ formData, originalData, onChange }) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-right-8 duration-500">
      <SalaryField 
        label="Remuneración Bruta Mensual" 
        name="remuneracionbruta_mensual" 
        value={formData.remuneracionbruta_mensual} 
        onChange={onChange}
        original={originalData?.remuneracionbruta_mensual}
      />
      <SalaryField 
        label="Remuneración Líquida Mensual" 
        name="remuliquida_mensual" 
        value={formData.remuliquida_mensual} 
        onChange={onChange}
        original={originalData?.remuliquida_mensual}
      />
      <div className="col-span-1 md:col-span-2">
        <SalaryField 
          label="Sueldo Base" 
          name="base" 
          value={formData.base} 
          onChange={onChange}
          original={originalData?.base}
        />
      </div>
    </div>
  );
};

export default RemuneracionSection;
