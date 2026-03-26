import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  X, CheckCircle2, ChevronRight, UserCheck, 
  ShieldCheck, CreditCard, PenTool, History, 
  AlertTriangle, RotateCcw 
} from 'lucide-react';
import { useContractForm } from '../../hooks/useContractForm';
import { contratosService } from '../../services/api';
import { normalizeContrato } from '../../utils/schemaMapping';
import { useConafData } from '../../context/DataContext';


// Componentes de Workflow
import PhysicalSignatureWorkflow from './workflow/PhysicalSignatureWorkflow';
import ContractTimeline from './workflow/ContractTimeline';

import ReadOnlySection from './form-sections/ReadOnlySection';
import ContractSection from './form-sections/ContractSection';
import RemuneracionSection from './form-sections/RemuneracionSection';

const SectionHeader = ({ icon: Icon, title, active, variant = 'default' }) => (
  <div className={`px-6 py-4 flex items-center justify-between shadow-soft sticky top-0 z-30 transition-all ${
    active 
      ? (variant === 'danger' ? 'bg-error text-white' : 'bg-primary text-white') 
      : 'bg-white text-neutral-400 border-b border-neutral-100'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl backdrop-blur-md ${active ? 'bg-white/10' : 'bg-neutral-50 border border-neutral-100'}`}>
        <Icon size={18} strokeWidth={2.5} />
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

const ContractDrawer = ({ isOpen, onClose, employee }) => {
  const { 
    formData, handleChange, signer, handleSignerChange, 
    resetForm, isValid 
  } = useContractForm(employee);

  const { refresh } = useConafData();
  
  const [activeContract, setActiveContract] = useState(null);

  const [contractHistory, setContractHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('contrato_indefinido');
  
  const scrollContainerRef = useRef(null);

  const steps = [
    { id: 'identificacion', label: 'Antecedentes' },
    { id: 'form', label: 'Formulario' },
    { id: 'workflow', label: 'Proceso de Firma' },
    { id: 'history', label: 'Historial' },
  ];

  const fetchActiveContract = useCallback(async () => {
    if (!employee?.id) return;
    try {
      const response = await contratosService.list({ empleado_id: employee.id, limit: 1 });
      const items = response.items || [];
      if (items.length > 0) {
        const normalized = normalizeContrato(items[0]);
        setActiveContract(normalized);
        const history = await contratosService.getHistory(normalized.id);
        setContractHistory(history);
      } else {
        setActiveContract(null);
        setContractHistory([]);
      }
    } catch (error) {
       console.warn("Error al cargar historial", error);
    }
  }, [employee]);

  useEffect(() => {
    if (isOpen && employee) {
      fetchActiveContract();
      contratosService.getTemplates().then(setTemplates).catch(console.error);
    }
    setCurrentSection(0);
  }, [isOpen, employee, fetchActiveContract]);

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

  const handleCreateContract = async () => {
    try {
      setIsCreating(true);
      const datosFormulario = {
        tipo_cargo: formData.cargo,
        remuneracion_bruta_mensual: formData.bruta,
        base: formData.base || formData.bruta * 0.7,
        tipo_de_contrato: formData.contratoTipo,
        signer_name: signer.name,
        signer_role: signer.role
      };

      const rawContract = await contratosService.create(
        employee.id, 
        selectedTemplate, 
        datosFormulario
      );

      setActiveContract(normalizeContrato(rawContract));
      showToast("Contrato generado con éxito");
      
      // Actualizar datos globales para que la tabla se entere
      refresh();
      
      const workflowSection = document.getElementById('workflow');

      if (workflowSection) workflowSection.scrollIntoView({ behavior: 'smooth' });
      
    } catch (error) {
      showToast(error.response?.data?.detail || "Error al generar contrato", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleResetProcess = async () => {
    if (!activeContract) return;
    
    const confirm = window.confirm("¿ESTÁS SEGURO? Esta acción ELIMINARÁ permanentemente este contrato y todos sus archivos asociados del servidor. No se puede deshacer.");
    if (!confirm) return;

    try {
      setIsCreating(true);
      await contratosService.delete(activeContract.id);
      setActiveContract(null);
      setContractHistory([]);
      resetForm(); // Resetea a valores originales del empleado
      
      // Senior Fix: Notificar al contexto global para refrescar listados
      refresh();

      showToast("Proceso eliminado por completo del sistema.");

      
      // Volver arriba
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setCurrentSection(0);
    } catch (error) {
      showToast("No se pudo reiniciar el proceso", "error");
    } finally {
      setIsCreating(false);
    }
  };

  if (!employee && !isOpen) return null;

  return (
    <>
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${toast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-2xl shadow-premium border flex items-center gap-3 ${toast?.type === 'error' ? 'bg-error text-white border-red-400' : 'bg-primary-dark text-white border-primary-light'}`}>
          <AlertTriangle size={18} strokeWidth={3} />
          <span className="text-xs font-black uppercase tracking-widest">{toast?.message}</span>
        </div>
      </div>

      <div onClick={onClose} className={`fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      <div className={`fixed inset-y-0 right-0 bg-white shadow-premium z-[110] transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col w-full max-w-[620px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-white border-b border-neutral-50 relative z-50">
          <div className="flex items-center gap-5">
            <button onClick={onClose} className="p-3 hover:bg-neutral-50 rounded-2xl text-neutral-400 hover:text-primary transition-all active:scale-90 border border-neutral-100 group shadow-sm">
              <X size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-neutral-900 leading-tight tracking-tight truncate max-w-[340px]">
                {employee?.nombre || 'Cargando...'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] uppercase font-black text-primary tracking-extreme">
                  {activeContract ? 'Gestión de Contrato Activo' : 'Creación de Nuevo Proceso'}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${activeContract ? 'bg-success animate-pulse' : 'bg-neutral-200'}`} />
              </div>
            </div>
          </div>
        </header>

        <StepIndicator steps={steps} currentSection={currentSection} />

        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-thin bg-neutral-50/10 space-y-8 pb-40 p-6">
          <section id="identificacion" className="bg-white rounded-[32px] border border-neutral-100 shadow-premium overflow-hidden scroll-mt-20">
            <SectionHeader icon={UserCheck} title="1. Antecedentes" active={currentSection === 0} />
            <div className="p-8">
              <ReadOnlySection employee={employee} />
            </div>
          </section>

          <section id="form" className="bg-white rounded-[32px] border border-neutral-100 shadow-premium overflow-hidden scroll-mt-20">
            <SectionHeader icon={ShieldCheck} title="2. Definición del Contrato" active={currentSection === 1} />
            <div className="p-8 space-y-8">
              <ContractSection 
                formData={formData} 
                originalData={employee} 
                onChange={handleChange}
                templates={templates}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
              <div className="pt-6 border-t border-neutral-50">
                <RemuneracionSection formData={formData} originalData={employee} onChange={handleChange} />
              </div>

              {!activeContract && (
                <button 
                  onClick={handleCreateContract}
                  disabled={isCreating || !isValid}
                  className="w-full h-16 bg-primary-dark hover:bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-extreme shadow-premium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                >
                  {isCreating ? (
                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <PenTool size={18} />
                      <span>Generar Contrato Digital</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </section>

          <section id="workflow" className="bg-white rounded-[32px] border border-neutral-100 shadow-premium overflow-hidden scroll-mt-20">
            <SectionHeader icon={CreditCard} title="3. Proceso de Firma" active={currentSection === 2} />
            <div className="p-8">
              <PhysicalSignatureWorkflow contract={activeContract} onUpdate={(c) => { 
                setActiveContract(normalizeContrato(c));
                fetchActiveContract();
              }} />
            </div>
          </section>

          <section id="history" className="bg-white rounded-[32px] border border-neutral-100 shadow-premium overflow-hidden scroll-mt-20">
            <SectionHeader icon={History} title="4. Historial" active={currentSection === 3} />
            <div className="p-8">
              <ContractTimeline history={contractHistory} />
            </div>
          </section>

          {/* DANGER ZONE (REINICIO) */}
          {activeContract && (
            <section className="bg-error/5 rounded-[32px] border border-error/20 overflow-hidden mt-12 mb-20 animate-in slide-in-from-bottom-4 duration-700">
              <SectionHeader icon={AlertTriangle} title="Zona de Peligro" active={true} variant="danger" />
              <div className="p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-error/10 text-error rounded-xl">
                    <RotateCcw size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-error">Eliminar Proceso Actual</h4>
                    <p className="text-[10px] font-bold text-neutral-500 mt-1">
                      Si el proceso tiene errores o el documento se dañó, puedes borrarlo todo.
                      Se eliminarán los PDFs generados y el registro de base de datos.
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleResetProcess}
                  disabled={isCreating}
                  className="w-full h-14 bg-error text-white rounded-2xl text-[10px] font-black uppercase tracking-extreme shadow-soft hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isCreating ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <RotateCcw size={16} />
                      <span>Reiniciar y Empezar de Cero</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default ContractDrawer;
