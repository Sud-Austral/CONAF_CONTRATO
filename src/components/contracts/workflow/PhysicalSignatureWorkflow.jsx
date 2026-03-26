import React, { useState } from 'react';
import { 
  CheckCircle2, Printer, UploadCloud, FileText, 
  ShieldCheck, Clock
} from 'lucide-react';
import { contratosService } from '../../../services/api';

const ActionButton = ({ onClick, icon: Icon, label, disabled, primary, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      flex-1 h-16 flex items-center justify-center gap-3 rounded-[24px] text-[11px] font-black uppercase tracking-extreme transition-all active:scale-95 shadow-premium group
      ${loading ? 'opacity-50 cursor-wait' : ''}
      ${primary 
        ? 'bg-primary-dark text-white hover:bg-primary shadow-primary/20' 
        : 'bg-white text-neutral-900 border border-neutral-100 hover:bg-neutral-50'}
      ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}
    `}
  >
    {loading ? (
      <div className="w-5 h-5 border-3 border-current/20 border-t-current rounded-full animate-spin" />
    ) : (
      <>
        <Icon size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
        <span>{label}</span>
      </>
    )}
  </button>
);

const PhysicalSignatureWorkflow = ({ contract, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  if (!contract) return (
    <div className="p-8 text-center text-neutral-400">
      <p className="text-[10px] font-black uppercase tracking-widest">Genera el primer contrato para iniciar</p>
    </div>
  );

  const handleAction = async (action) => {
    try {
      setLoading(true);
      let updated;
      if (action === 'revisar') updated = await contratosService.revisar(contract.id);
      
      if (action === 'imprimir') {
        updated = await contratosService.imprimir(contract.id);
        window.open(contratosService.getPdfViewUrl(contract.id), '_blank');
      }

      if (action === 'esperando-firma') updated = await contratosService.marcarEsperandoFirma(contract.id);
      
      if (updated) {
        onUpdate(updated);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Error en la transición");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const updated = await contratosService.uploadScan(contract.id, file);
      onUpdate(updated);
    } catch (err) {
      alert("Error al subir el escaneado");
    } finally {
      setLoading(false);
    }
  };

  const state = contract.estado;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      {/* Indicador de Estado Actual */}
      <div className="flex items-center gap-4 p-5 rounded-[30px] border relative overflow-hidden bg-neutral-50 border-neutral-100">
        <div className={`absolute inset-0 bg-gradient-to-r opacity-[0.03] ${
          state === 'COMPLETADO' ? 'from-success to-primary' : 'from-primary to-primary-dark'
        }`} />
        
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          state === 'COMPLETADO' ? 'bg-success text-white' : 'bg-primary text-white'
        }`}>
          <CheckCircle2 size={24} strokeWidth={3} className={state === 'COMPLETADO' ? 'animate-bounce-subtle' : ''} />
        </div>
        
        <div className="flex-1">
          <p className="text-[9px] font-black uppercase tracking-extreme mb-0.5 text-primary/60">Estado Operacional</p>
          <p className="text-xl font-black text-neutral-900 leading-none">{state}</p>
        </div>
      </div>

      {/* Acceso directo al PDF si existe */}
      {contract.hasPdf && (
        <div className="flex items-center justify-between p-4 bg-primary/[0.03] rounded-2xl border border-primary/10 transition-all hover:bg-primary/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText size={16} className="text-primary" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-800 leading-none">Documento Original</span>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Generado por el sistema</span>
            </div>
          </div>
          <button 
            onClick={() => window.open(contratosService.getPdfViewUrl(contract.id, 'generado'), '_blank')}
            className="px-4 py-2 bg-white border border-neutral-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-soft active:scale-95 transition-all"
          >
            Ver PDF Generado
          </button>
        </div>
      )}

      {/* Acciones por estado */}
      <div className="grid grid-cols-1 gap-4">
        {state === 'PENDIENTE' && (
          <div className="space-y-3">
            <ActionButton 
              label="Aprobar para Impresión" 
              icon={ShieldCheck} 
              primary 
              loading={loading}
              onClick={() => handleAction('revisar')} 
            />
            <p className="px-4 text-[10px] font-bold text-neutral-400 italic">
              * Esto moverá el contrato a revisión jurídica para su posterior impresión.
            </p>
          </div>
        )}

        {state === 'REVISADO' && (
          <div className="space-y-3">
            <ActionButton 
              label="Confirmar Impresión Física" 
              icon={Printer} 
              primary 
              loading={loading}
              onClick={() => handleAction('imprimir')} 
            />
             <p className="px-4 text-[10px] font-bold text-neutral-400 italic">
              * Confirma que el documento fue impreso y está listo para ser entregado al funcionario.
            </p>
          </div>
        )}

        {state === 'IMPRESO' && (
          <div className="space-y-4">
             <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl">
               <p className="text-[10px] font-bold text-violet-700 leading-relaxed uppercase tracking-wider">
                 Paso Actual: Entrega Física
               </p>
               <p className="text-[11px] text-violet-600/80 mt-1">
                 El documento ya está marcado como impreso. Ahora debe ser entregado al funcionario para su firma presencial.
               </p>
             </div>
             
             <ActionButton 
               label="Marcar como Entregado a Firma" 
               icon={ShieldCheck} 
               primary 
               loading={loading}
               onClick={() => handleAction('esperando-firma')} 
             />
             
             <p className="px-4 text-[10px] font-bold text-neutral-400 italic">
               * Una vez marcado, se habilitará la opción de subir el PDF escaneado.
             </p>
          </div>
        )}

        {state === 'ESPERANDO_FIRMA' && (
          <div className="space-y-4">
             <label className="group relative block w-full h-32 border-2 border-dashed border-neutral-200 rounded-[32px] hover:border-primary hover:bg-primary/[0.02] transition-all cursor-pointer overflow-hidden p-4">
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} disabled={loading} />
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <UploadCloud className="text-primary-light group-hover:scale-110 transition-transform" size={28} />
                <div className="text-center">
                  <p className="text-xs font-black text-neutral-900 uppercase tracking-widest">Cargar PDF Escaneado</p>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-extreme mt-1">Arrastra el archivo firmado físicamente</p>
                </div>
              </div>
            </label>
            <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 h-px bg-neutral-100" />
                <span className="text-[9px] font-black text-neutral-300 uppercase tracking-extreme">o</span>
                <div className="flex-1 h-px bg-neutral-100" />
            </div>
            <ActionButton 
                label="Volver a Imprimir" 
                icon={Printer} 
                onClick={() => handleAction('imprimir')} 
            />
          </div>
        )}

        {state === 'COMPLETADO' && (
          <div className="p-8 text-center bg-success/5 border border-success/10 rounded-[40px] shadow-sm animate-in zoom-in-95 duration-500">
             <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-premium shadow-success/20">
               <CheckCircle2 size={32} strokeWidth={3} />
             </div>
             <h4 className="text-xl font-black text-slate-900 mb-2">Ciclo Completado</h4>
             <p className="text-xs font-bold text-slate-500 max-w-[280px] mx-auto mb-8">
               El contrato ha sido firmado físicamente y el registro digital se encuentra cerrado e íntegro.
             </p>
             
             <button 
               onClick={() => window.open(contratosService.getPdfViewUrl(contract.id, 'escaneado'), '_blank')}
               className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:shadow-soft transition-all active:scale-95"
             >
               <FileText size={14} />
               Ver Escaneo Original
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicalSignatureWorkflow;
