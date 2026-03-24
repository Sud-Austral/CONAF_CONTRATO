import React, { useRef, useEffect, useState } from 'react';
import { X, Download, RotateCcw, UserCheck, ShieldCheck, CreditCard, PenTool, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { useContractForm } from '../../hooks/useContractForm';
import { generateContractPdf } from '../../utils/pdfGenerator';
import ReadOnlySection from './form-sections/ReadOnlySection';
import ContractSection from './form-sections/ContractSection';
import RemuneracionSection from './form-sections/RemuneracionSection';
import FesSignatureSection from './form-sections/FesSignatureSection';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="bg-gradient-to-r from-primary-dark to-primary text-white px-6 py-4 flex items-center justify-between shadow-soft sticky top-0 z-30">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
        <Icon size={18} strokeWidth={2.5} className="text-white" />
      </div>
      <h3 className="text-[10px] font-black uppercase tracking-extreme">{title}</h3>
    </div>
  </div>
);

const StepIndicator = ({ steps, currentSection }) => (
  <div className="px-8 py-3 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0 overflow-x-auto scrollbar-none">
    {steps.map((step, idx) => (
      <React.Fragment key={step.id}>
        <div className="flex items-center gap-2 group flex-shrink-0">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all ${
            idx <= currentSection ? 'bg-primary border-primary text-white' : 'border-neutral-200 text-neutral-300'
          }`}>
            {idx < currentSection ? <CheckCircle2 size={10} strokeWidth={4} /> : idx + 1}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${
            idx <= currentSection ? 'text-neutral-900' : 'text-neutral-300'
          }`}>
            {step.label}
          </span>
        </div>
        {idx < steps.length - 1 && (
          <ChevronRight size={12} className="text-neutral-100 mx-2" />
        )}
      </React.Fragment>
    ))}
  </div>
);

const TimelineEntry = ({ date, event, type }) => (
  <div className="flex items-start gap-4 relative pb-6 last:pb-0">
    <div className="absolute left-1.5 top-6 bottom-0 w-0.5 bg-neutral-100 last:hidden" />
    <div className={`w-3 h-3 rounded-full mt-1.5 z-10 border-2 border-white ${
      type === 'active' ? 'bg-success ring-4 ring-success/10' : 'bg-neutral-300'
    }`} />
    <div className="flex-1">
      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{date}</p>
      <p className="text-xs font-bold text-neutral-900 mt-1">{event}</p>
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
  const [currentSection, setCurrentSection] = useState(0); // Para el Stepper
  const drawerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const steps = [
    { id: 'identificacion', label: 'Antecedentes' },
    { id: 'contrato', label: 'Contrato' },
    { id: 'remuneraciones', label: 'Sueldo' },
    { id: 'firma', label: 'Firma' },
  ];

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    setLastSignaturePayload(null);
    setCurrentSection(0);
  }, [employee]);

  // Manejador de scroll para el stepper
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const sections = e.target.querySelectorAll('section');
    sections.forEach((section, idx) => {
      if (scrollTop >= section.offsetTop - 150) {
        setCurrentSection(idx);
      }
    });
  };

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
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${toast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-2xl shadow-premium border flex items-center gap-3 ${toast?.type === 'error' ? 'bg-error text-white border-red-400' : 'bg-primary-dark text-white border-primary-light'}`}>
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
        className={`fixed inset-y-0 right-0 bg-white shadow-premium z-[110] transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col w-full max-w-[620px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white relative z-50">
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
                <span className="text-[9px] uppercase font-black text-primary tracking-extreme">Legislación Vigente</span>
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-warning animate-pulse' : 'bg-success'}`} />
                <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest leading-none">
                  {isDirty ? 'Borrador Editado' : 'Datos Íntegros'}
                </span>
             </div>
             {changedFields.length > 0 && (
               <span className="text-[9px] font-bold text-neutral-400 px-2 py-0.5 bg-neutral-100 rounded-full">{changedFields.length} cambios</span>
             )}
          </div>
        </header>

        {/* Recomendación 15: Progress Stepper */}
        <StepIndicator steps={steps} currentSection={currentSection} />

        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scrollbar-thin bg-neutral-50/30 space-y-8 pb-40 p-6"
        >
          <section id="identificacion" className="bg-white rounded-[32px] border border-neutral-100 shadow-premium overflow-hidden scroll-mt-20">
            <SectionHeader icon={UserCheck} title="I. Antecedentes" />
            <div className="p-8 space-y-8">
              <ReadOnlySection employee={employee} />
              
              {/* Recomendación 20: Timeline de Trayectoria */}
              <div className="pt-8 border-t border-neutral-100">
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={14} className="text-primary-light" />
                  <h4 className="text-[10px] font-black uppercase tracking-extreme text-neutral-400">Trayectoria Institucional</h4>
                </div>
                <div className="pl-2 space-y-4">
                  <TimelineEntry date="Marzo 2026" event="Contrato Actual (Activo)" type="active" />
                  <TimelineEntry date="Enero 2025" event="Promoción de Cargo" type="past" />
                  <TimelineEntry date={`${employee.fecha_ingreso || 'S/FI'}`} event="Ingreso a la Corporación" type="past" />
                </div>
              </div>
            </div>
          </section>

          <section id="contrato" className="bg-white rounded-[32px] border border-neutral-100 shadow-premium overflow-hidden scroll-mt-20">
            <SectionHeader icon={ShieldCheck} title="II. Términos del Contrato" />
            <div className="p-8">
              <ContractSection 
                 formData={formData} 
                 originalData={employee} 
                 onChange={handleChange} 
              />
            </div>
          </section>

          <section id="remuneraciones" className="bg-white rounded-[32px] border border-neutral-100 shadow-premium overflow-hidden scroll-mt-20">
            <SectionHeader icon={CreditCard} title="III. Remuneraciones" />
            <div className="p-8">
              <RemuneracionSection 
                formData={formData} 
                originalData={employee} 
                onChange={handleChange} 
              />
            </div>
          </section>

          <section id="firma" className="bg-white rounded-[32px] border border-neutral-100 shadow-premium overflow-hidden scroll-mt-20">
            <SectionHeader icon={PenTool} title="IV. Firma Electrónica (FES)" />
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-extreme ml-1">Responsable Legal</label>
                  <input 
                    type="text" 
                    value={signer.name} 
                    onChange={(e) => handleSignerChange('name', e.target.value)}
                    className="w-full px-6 py-4 text-xs font-black text-neutral-900 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-neutral-300"
                    placeholder="Certificador..."
                  />
                </div>
                <div className="space-y-3">
                   <label className="text-[9px] font-black text-neutral-400 uppercase tracking-extreme ml-1">Cargo Autorizado</label>
                  <input 
                    type="text" 
                    value={signer.role} 
                    onChange={(e) => handleSignerChange('role', e.target.value)}
                    className="w-full px-6 py-4 text-xs font-black text-neutral-900 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-neutral-300"
                    placeholder="Ej: Jefe RR.HH..."
                  />
                </div>
              </div>

              <FesSignatureSection 
                documentInfo={{ 
                  id: `cont_${employee?.rut}`, 
                  name: `Contrato de ${employee?.nombrecompleto_x}` 
                }}
                userInfo={{ id: 'usr_admin_01', email: 'rrhh@conaf.cl', name: signer.name }}
                onSignSuccess={(payload) => {
                  setLastSignaturePayload(payload);
                  setHasSignature(true);
                  showToast("Firma validada correctamente");
                }}
              />
            </div>
          </section>
        </div>

        <footer className="absolute bottom-0 left-0 w-full p-8 pb-12 bg-white/90 backdrop-blur-2xl border-t border-neutral-100 flex items-center gap-4 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
          <button 
            onClick={resetForm}
            className="btn-premium flex items-center justify-center p-5 bg-white border border-neutral-200 rounded-[24px] text-neutral-400 hover:text-error hover:border-error/20 shadow-soft group"
            title="Revertir"
          >
            <RotateCcw size={20} className="group-hover:-rotate-90 transition-transform duration-500" />
          </button>

          <button 
            onClick={() => handleGeneratePdf(true)}
            className="btn-premium flex-1 flex items-center justify-center gap-3 h-16 bg-white border-2 border-primary rounded-[24px] text-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary/5 shadow-soft"
          >
            <Download size={18} strokeWidth={3} />
            Borrador PDF
          </button>

          <button 
            onClick={() => handleGeneratePdf(false)}
            disabled={!isValid || isSigning}
            className={`
              btn-premium flex-[1.5] flex items-center justify-center gap-4 h-16 rounded-[24px] text-[11px] font-black uppercase tracking-extreme shadow-premium transition-all relative overflow-hidden group/btn
              ${isValid 
                ? 'bg-primary-dark text-white cursor-pointer active:scale-95' 
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }
            `}
          >
            {isSigning ? (
              <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck size={20} className={`${isValid ? 'animate-bounce-subtle' : ''} group-hover/btn:scale-125 transition-transform duration-500`} />
                <span>Firmar y Sellar</span>
              </>
            )}
          </button>
        </footer>
      </div>
    </>
  );
};

export default ContractDrawer;
