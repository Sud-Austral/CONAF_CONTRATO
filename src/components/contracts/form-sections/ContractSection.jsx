import React from 'react';
import { fmtFechaISO } from '../../../utils/formatters';

// Valores del dominio de negocio CONAF
const TIPOS_CONTRATO = [
  'Planta', 'Contrata', 'Honorarios', 'Código del Trabajo', 'Código Laboral', 'Otro'
];

const InputField = ({ label, name, value, onChange, type = "text", options = [], original }) => {
  const isChanged = String(value ?? '') !== String(original ?? '');
  
  return (
    <div className={`flex flex-col gap-1.5 p-3.5 rounded-xl transition-all border ${isChanged ? 'bg-amber-50 border-amber-200' : 'bg-white border-neutral-100 hover:border-primary/20'}`}>
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase font-black text-neutral-400 tracking-extreme leading-none">{label}</label>
        {isChanged && <span className="text-[9px] font-black text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full uppercase">Editado</span>}
      </div>
      
      {type === 'select' ? (
        <select 
          name={name} 
          value={value || ''} 
          onChange={(e) => onChange(name, e.target.value)}
          className="text-xs font-bold text-neutral-900 bg-transparent focus:outline-none cursor-pointer mt-1"
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
          className="text-xs font-bold text-neutral-900 bg-transparent focus:outline-none mt-1 placeholder:text-neutral-300"
          placeholder={`Ingrese ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );
};

/**
 * Sección de definición de contrato: usa nombres NORMALIZADOS (.organismo, .cargo, .contratoTipo, .fechaInicio)
 */
const ContractSection = ({ formData, originalData, onChange, templates = [], selectedTemplate, onTemplateChange }) => {
  return (
    <div className="flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500">
      
      {/* Selector de Plantilla */}
      <div className="p-5 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
            <span className="text-[10px] font-black italic">PDF</span>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-extreme text-primary-dark">Tipo de Documento</h4>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Seleccione el formato legal a generar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {templates.length > 0 ? (
            <select
              value={selectedTemplate}
              onChange={(e) => onTemplateChange(e.target.value)}
              className="w-full px-6 py-4 bg-white border border-neutral-100 rounded-2xl text-xs font-black text-neutral-900 focus:border-primary focus:ring-0 transition-all cursor-pointer appearance-none shadow-premium"
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.label.toUpperCase()}</option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-white/50 border border-dashed border-neutral-200 rounded-2xl text-center text-[9px] font-bold text-neutral-400 animate-pulse">
              Cargando formatos disponibles...
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <InputField 
            label="Organismo / Departamento" 
            name="organismo" 
            value={formData.organismo} 
            onChange={onChange} 
            original={originalData?.organismo}
          />
        </div>
        <div className="col-span-2">
          <InputField 
            label="Cargo / Función" 
            name="cargo" 
            value={formData.cargo} 
            onChange={onChange} 
            original={originalData?.cargo}
          />
        </div>
        <InputField 
          label="Modalidad de Contrato" 
          name="contratoTipo" 
          type="select"
          options={TIPOS_CONTRATO}
          value={formData.contratoTipo} 
          onChange={onChange} 
          original={originalData?.contratoTipo}
        />
        <InputField 
          label="Fecha de Inicio" 
          name="fechaInicio" 
          type="date"
          value={fmtFechaISO(formData.fechaInicio)} 
          onChange={onChange} 
          original={fmtFechaISO(originalData?.fechaInicio)}
        />
      </div>
    </div>
  );
};

export default ContractSection;
