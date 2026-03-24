import React, { useRef, useEffect } from 'react';
import { X, Download, RotateCcw, UserCheck, ShieldCheck, CreditCard, PenTool } from 'lucide-react';
import { useContractForm } from '../../hooks/useContractForm';
import { generateContractPdf } from '../../utils/pdfGenerator';
import ReadOnlySection from './form-sections/ReadOnlySection';
import ContractSection from './form-sections/ContractSection';
import RemuneracionSection from './form-sections/RemuneracionSection';
import SignatureSection from './form-sections/SignatureSection';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="bg-conaf-800 text-white px-5 py-3 flex items-center gap-3 shadow-md border-b-2 border-gold/50 sticky top-0 z-30">
    <Icon size={18} strokeWidth={2.5} className="text-conaf-200" />
    <h3 className="text-xs font-bold uppercase tracking-[0.15em] font-body">{title}</h3>
  </div>
);

const ContractDrawer = ({ isOpen, onClose, employee }) => {
  const { 
    formData, handleChange, signer, handleSignerChange, 
    changedFields, resetForm, isValid, setHasSignature 
  } = useContractForm(employee);
  
  const canvasRef = useRef(null);
  const drawerRef = useRef(null);

  // Handle closing on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleGeneratePdf = async () => {
    if (!isValid) return;
    
    const signatureDataUrl = canvasRef.current.toDataURL();
    await generateContractPdf({
      employee,
      formData,
      signatureDataUrl,
      signerName: signer.name,
      signerRole: signer.role,
      signDate: signer.date
    });
  };

  if (!employee && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-conaf-900/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-[110] transition-transform duration-500 ease-out flex flex-col w-full max-w-[540px] ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}
      >
        {/* Header Fijo */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-100 shadow-sm relative z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-conaf-50 rounded-full text-gray-400 hover:text-conaf-800 transition-all active:scale-90 border border-transparent hover:border-conaf-200"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold font-display text-conaf-900 leading-none truncate max-w-[300px]">
                {employee?.nombrecompleto_x || 'Cargando...'}
              </h2>
              <span className="text-[10px] uppercase font-bold text-conaf-500 tracking-widest mt-1">Gestión de Perfil e Instrumento Legal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${changedFields.length > 0 ? 'bg-amber-400 animate-pulse' : 'bg-conaf-200'}`} title={changedFields.length > 0 ? 'Existen cambios pendientes' : 'Sin cambios'} />
            <span className="text-[10px] font-bold text-gray-400 uppercase">{changedFields.length > 0 ? `${changedFields.length} cambios` : 'Sin cambios'}</span>
          </div>
        </header>

        {/* Body Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50/50 space-y-px pb-24">
          <section>
            <SectionHeader icon={UserCheck} title="I. Antecedentes del Funcionario" />
            <ReadOnlySection employee={employee} />
          </section>

          <section>
            <SectionHeader icon={ShieldCheck} title="II. Términos del Contrato" />
            <ContractSection 
               formData={formData} 
               originalData={employee} 
               onChange={handleChange} 
            />
          </section>

          <section>
            <SectionHeader icon={CreditCard} title="III. Remuneraciones" />
            <RemuneracionSection 
              formData={formData} 
              originalData={employee} 
              onChange={handleChange} 
            />
          </section>

          <section>
            <SectionHeader icon={PenTool} title="IV. Firma del Responsable" />
            <SignatureSection 
              ref={canvasRef}
              signer={signer}
              onSignerChange={handleSignerChange}
              setHasSignature={setHasSignature}
            />
          </section>
        </div>

        {/* Footer Fijo */}
        <footer className="absolute bottom-0 left-0 w-full p-5 bg-white border-t border-conaf-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] flex items-center justify-between z-50">
          <button 
            onClick={resetForm}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-conaf-200 rounded-2xl text-conaf-700 text-sm font-bold hover:bg-conaf-50 hover:border-conaf-400 active:scale-95 transition-all shadow-sm"
          >
            <RotateCcw size={18} />
            Descartar Cambios
          </button>

          <button 
            onClick={handleGeneratePdf}
            disabled={!isValid}
            className={`
              flex items-center gap-3 px-8 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95
              ${isValid 
                ? 'bg-conaf-600 text-white hover:bg-conaf-700 cursor-pointer scale-100' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70 border border-gray-300'
              }
            `}
            title={!isValid ? 'Firma y nombre del responsable requeridos' : 'Descargar documento PDF'}
          >
            <Download size={20} className={isValid ? 'animate-bounce-subtle' : ''} />
            Generar Contrato PDF
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
      `}</style>
    </>
  );
};

export default ContractDrawer;
