import React, { forwardRef } from 'react';
import SignatureCanvas from '../SignatureCanvas';
import { User, Briefcase, Calendar } from 'lucide-react';

const SignatureSection = forwardRef(({ signer, onSignerChange, setHasSignature }, ref) => {
  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-12 duration-500">
      <div className="space-y-4">
        <label className="text-[11px] uppercase font-black text-conaf-700 tracking-widest font-body flex items-center gap-2">
          <span>Área de Firma Manuscrita</span>
          <div className="h-0.5 flex-1 bg-conaf-300" />
        </label>
        <SignatureCanvas ref={ref} onDraw={setHasSignature} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre del Firmante */}
        <div className="relative group/field px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus-within:border-conaf-400 focus-within:ring-2 focus-within:ring-conaf-300 transition-all">
          <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-conaf-400 group-focus-within/field:text-conaf-600 transition-colors" />
          <div className="pl-6 flex flex-col gap-0.5">
            <label className="text-[9px] uppercase font-bold text-gray-600 tracking-wider">Nombre del Responsable</label>
            <input 
              type="text" 
              value={signer.name} 
              onChange={(e) => onSignerChange('name', e.target.value)}
              className="w-full text-sm font-bold text-conaf-900 bg-transparent focus:outline-none placeholder:text-gray-200"
              placeholder="Juan Pérez..."
            />
          </div>
        </div>

        {/* Cargo del Firmante */}
        <div className="relative group/field px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus-within:border-conaf-400 focus-within:ring-2 focus-within:ring-conaf-300 transition-all">
          <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-conaf-400 group-focus-within/field:text-conaf-600 transition-colors" />
          <div className="pl-6 flex flex-col gap-0.5">
            <label className="text-[9px] uppercase font-bold text-gray-600 tracking-wider">Cargo / Departamento</label>
            <input 
              type="text" 
              value={signer.role} 
              onChange={(e) => onSignerChange('role', e.target.value)}
              className="w-full text-sm font-bold text-conaf-900 bg-transparent focus:outline-none placeholder:text-gray-200"
              placeholder="Jefe RR.HH..."
            />
          </div>
        </div>

        {/* Fecha (Solo lectura) */}
        <div className="md:col-span-2 relative group/field px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl shadow-inner cursor-not-allowed">
          <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <div className="pl-6 flex flex-col gap-0.5">
            <label className="text-[9px] uppercase font-bold text-gray-600 tracking-wider">Fecha de Validación Sistema</label>
            <input 
              type="date" 
              value={signer.date} 
              readOnly
              className="w-full text-sm font-bold text-gray-600 bg-transparent focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default SignatureSection;
