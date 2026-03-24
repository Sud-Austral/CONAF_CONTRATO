import React, { useRef, useEffect, useState } from 'react';
import { X, Download, RotateCcw, UserCheck, ShieldCheck, CreditCard, PenTool, CheckCircle2 } from 'lucide-react';
import { useContractForm } from '../../hooks/useContractForm';
import { generateContractPdf } from '../../utils/pdfGenerator';
import ReadOnlySection from './form-sections/ReadOnlySection';
import ContractSection from './form-sections/ContractSection';
import RemuneracionSection from './form-sections/RemuneracionSection';
import FesSignatureSection from './form-sections/FesSignatureSection';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="bg-primary text-white px-5 py-4 flex items-center justify-between shadow-soft border-b border-primary-dark sticky top-0 z-30">
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-white/10 rounded-lg">
        <Icon size={16} strokeWidth={2.5} className="text-white" />
      </div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.15em]">{title}</h3>
    </div>
  </div>
);

const ContractDrawer = ({ isOpen, onClose, employee }) => {
  const { 
    formData, handleChange, signer, handleSignerChange, 
    changedFields, resetForm, isValid, setHasSignature, isDirty
  } = useContractForm(employee);
  
  const [lastSignaturePayload, setLastSignaturePayload] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    setLastSignaturePayload(null);
  }, [employee]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleGeneratePdf = async (isPreview = false) => {
    if (!isPreview && !isValid) return;
    
    if (!isPreview) setIsSigning(true);
    
    try {
      await generateContractPdf({
        employee,
        formData,
        signerName: signer.name,
        signerRole: signer.role,
        signDate: signer.date,
        signaturePayload: isPreview ? null : lastSignaturePayload,
        isPreview
      });
      
      showToast(isPreview ? "Borrador generado con éxito" : "Contrato firmado y generado formalmente");
    } catch (error) {
      showToast("Error al generar el documento", "error");
    } finally {
      setIsSigning(false);
    }
  };

  if (!employee && !isOpen) return null;

  return (
    <>
      {/* Toast Notification (Recomendación 17) */}
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${toast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-2xl shadow-premium border flex items-center gap-3 ${toast?.type === 'error' ? 'bg-error text-white border-red-400' : 'bg-primary-dark text-white border-primary'}`}>
          <CheckCircle2 size={18} strokeWidth={3} />
          <span className="text-xs font-black uppercase tracking-widest">{toast?.message}</span>
        </div>
      </div>

      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div 
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 bg-white shadow-premium z-[110] transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col w-full max-w-[580px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white border-b border-neutral-100 relative z-50">
          <div className="flex items-center gap-5">
            <button 
              onClick={onClose}
              className="p-3 hover:bg-neutral-50 rounded-2xl text-neutral-400 hover:text-primary transition-all active:scale-90 border border-neutral-100 group shadow-sm"
            >
              <X size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-black font-display text-neutral-900 leading-tight tracking-tight truncate max-w-[340px]">
                {employee?.nombrecompleto_x || 'Cargando...'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] uppercase font-black text-primary tracking-[0.2em]">Ficha de Funcionario</span>
                <span className="w-1 h-1 bg-neutral-200 rounded-full" />
                <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-widest">ID: {employee?.rut}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-warning animate-pulse' : 'bg-success'}`} />
                <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest leading-none">
                  {isDirty ? 'Borrador Editado' : 'Sin Cambios'}
                </span>
             </div>
             {changedFields.length > 0 && (
               <span className="text-[9px] font-bold text-neutral-400 uppercase">{changedFields.length} campos modificados</span>
             )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin bg-neutral-50/30 space-y-4 pb-32 p-4">
          <section className="bg-white rounded-[24px] border border-neutral-100 shadow-soft overflow-hidden">
            <SectionHeader icon={UserCheck} title="I. Antecedentes" />
            <div className="p-6"><ReadOnlySection employee={employee} /></div>
          </section>

          <section className="bg-white rounded-[24px] border border-neutral-100 shadow-soft overflow-hidden">
            <SectionHeader icon={ShieldCheck} title="II. Términos del Contrato" />
            <div className="p-6">
              <ContractSection 
                 formData={formData} 
                 originalData={employee} 
                 onChange={handleChange} 
              />
            </div>
          </section>

          <section className="bg-white rounded-[24px] border border-neutral-100 shadow-soft overflow-hidden">
            <SectionHeader icon={CreditCard} title="III. Remuneraciones" />
            <div className="p-6">
              <RemuneracionSection 
                formData={formData} 
                originalData={employee} 
                onChange={handleChange} 
              />
            </div>
          </section>

          <section className="bg-white rounded-[24px] border border-neutral-100 shadow-soft overflow-hidden">
            <SectionHeader icon={PenTool} title="IV. Firma Electrónica (FES)" />
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Responsable</label>
                  <input 
                    type="text" 
                    value={signer.name} 
                    onChange={(e) => handleSignerChange('name', e.target.value)}
                    className="w-full px-5 py-4 text-xs font-black text-neutral-900 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-300"
                    placeholder="Nombre completo..."
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Cargo</label>
                  <input 
                    type="text" 
                    value={signer.role} 
                    onChange={(e) => handleSignerChange('role', e.target.value)}
                    className="w-full px-5 py-4 text-xs font-black text-neutral-900 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-300"
                    placeholder="Ej: Jefe RR.HH..."
                  />
                </div>
              </div>

              <FesSignatureSection 
                documentInfo={{ 
                  id: `cont_${employee?.rut}`, 
                  name: `Contrato de ${employee?.nombrecompleto_x}` 
                }}
                userInfo={{
                  id: 'usr_admin_01',
                  email: 'gestion.rrhh@conaf.cl',
                  name: signer.name
                }}
                onSignSuccess={(payload) => {
                  setLastSignaturePayload(payload);
                  setHasSignature(true);
                  showToast("Firma capturada correctamente");
                }}
              />
            </div>
          </section>
        </div>

        <footer className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-white/80 backdrop-blur-xl border-t border-neutral-100 flex items-center gap-4 z-50">
          <button 
            onClick={resetForm}
            className="flex items-center justify-center p-4 bg-white border border-neutral-200 rounded-[22px] text-neutral-400 hover:text-error hover:border-error/20 active:scale-95 transition-all shadow-soft group"
            title="Revertir cambios"
          >
            <RotateCcw size={20} className="group-hover:-rotate-90 transition-transform" />
          </button>

          <button 
            onClick={() => handleGeneratePdf(true)}
            className="flex-1 flex items-center justify-center gap-3 h-14 bg-white border-2 border-primary rounded-[22px] text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 active:scale-95 transition-all shadow-soft"
          >
            <Download size={16} strokeWidth={3} />
            Borrador
          </button>

          <button 
            onClick={() => handleGeneratePdf(false)}
            disabled={!isValid || isSigning}
            className={`
              flex-[1.5] flex items-center justify-center gap-4 h-14 rounded-[22px] text-xs font-black uppercase tracking-[0.15em] shadow-premium transition-all active:scale-95 relative overflow-hidden group/btn
              ${isValid 
                ? 'bg-primary-dark text-white cursor-pointer' 
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }
            `}
          >
            {isSigning ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck size={20} className={`${isValid ? 'animate-bounce-subtle' : ''} group-hover/btn:scale-125 transition-transform`} />
                <span>Firmar y Sellar</span>
              </>
            )}
            {isValid && !isSigning && (
               <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            )}
          </button>
        </footer>
      </div>
    </>
  );
};

export default ContractDrawer;
