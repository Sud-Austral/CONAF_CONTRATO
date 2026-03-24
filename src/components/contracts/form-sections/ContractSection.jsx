import React from 'react';
import { useConafData } from '../../../context/DataContext';
import { fmtFechaISO } from '../../../utils/formatters';

const InputField = ({ label, name, value, onChange, type = "text", options = [], original }) => {
  const isChanged = String(value) !== String(original);
  
  return (
    <div className={`flex flex-col gap-1.5 p-3.5 rounded-xl transition-all border ${isChanged ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100 hover:border-conaf-200'}`}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider font-body leading-none">{label}</label>
        {isChanged && <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full uppercase">Editado</span>}
      </div>
      
      {type === 'select' ? (
        <select 
          name={name} 
          value={value || ''} 
          onChange={(e) => onChange(name, e.target.value)}
          className="text-sm font-bold text-conaf-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-gold rounded transition-all cursor-pointer"
        >
          <option value="">Seleccione una opción</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type} 
          name={name} 
          value={value || ''} 
          onChange={(e) => onChange(name, e.target.value)}
          className="text-sm font-bold text-conaf-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-gold rounded transition-all placeholder:text-gray-300"
          placeholder={`Ingrese ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );
};

const ContractSection = ({ formData, originalData, onChange }) => {
  const { uniqueValues } = useConafData();

  return (
    <div className="p-6 grid grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-500">
      <InputField 
        label="Organismo" 
        name="organismo_nombre" 
        value={formData.organismo_nombre} 
        onChange={onChange} 
        original={originalData?.organismo_nombre}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField 
          label="Año" 
          name="anyo" 
          type="number"
          value={formData.anyo} 
          onChange={onChange} 
          original={originalData?.anyo}
        />
        <InputField 
          label="Mes" 
          name="mes" 
          type="select"
          options={uniqueValues.meses}
          value={formData.mes} 
          onChange={onChange} 
          original={originalData?.mes}
        />
      </div>
      <div className="col-span-2">
        <InputField 
          label="Cargo / Función" 
          name="tipo_cargo" 
          value={formData.tipo_cargo} 
          onChange={onChange} 
          original={originalData?.tipo_cargo}
        />
      </div>
      <InputField 
        label="Modalidad" 
        name="tipo_de_contrato" 
        type="select"
        options={uniqueValues.tipoContrato}
        value={formData.tipo_de_contrato} 
        onChange={onChange} 
        original={originalData?.tipo_de_contrato}
      />
      <InputField 
        label="Tipo de Pago" 
        name="tipo_pago" 
        value={formData.tipo_pago} 
        onChange={onChange} 
        original={originalData?.tipo_pago}
      />
      <InputField 
        label="Fecha de Ingreso" 
        name="fecha_ingreso" 
        type="date"
        value={fmtFechaISO(formData.fecha_ingreso)} 
        onChange={onChange} 
        original={fmtFechaISO(originalData?.fecha_ingreso)}
      />
       <InputField 
        label="Término de Contrato" 
        name="fecha_termino" 
        type="date"
        value={fmtFechaISO(formData.fecha_termino)} 
        onChange={onChange} 
        original={fmtFechaISO(originalData?.fecha_termino)}
      />
    </div>
  );
};

export default ContractSection;
