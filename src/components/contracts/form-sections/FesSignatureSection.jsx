import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  ChevronDown, 
  CheckCircle2, 
  Terminal,
  Info,
  ExternalLink,
  Fingerprint
} from 'lucide-react';

/**
 * FesSignatureSection: Implementación de Firma Electrónica Simple (FES) 
 * según Ley 19.799 (Chile).
 * 
 * Basado en aceptación tácita mediante checkbox y registro de evidencia técnica.
 */
const FesSignatureSection = ({ documentInfo, userInfo, onSignSuccess }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [signaturePayload, setSignaturePayload] = useState(null);
  const [isSigning, setIsSigning] = useState(false);

  // Simulación de IP para el mockup
  const mockIp = "201.214.34.112";

  const handleSign = () => {
    setIsSigning(true);
    
    // Simulamos un micro-retraso para la experiencia de usuario (validación de hash/timestamp)
    setTimeout(() => {
      const payload = {
        document: {
          id: documentInfo?.id || "doc_123",
          name: documentInfo?.name || "Contrato de Trabajo - CONAF",
          hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        },
        signer: {
          user_id: userInfo?.id || "user_456",
          email: userInfo?.email || "responsable@conaf.cl",
          name: userInfo?.name || "Juan Pérez Maldonado"
        },
        signature: {
          type: "simple",
          method: "checkbox_acceptance",
          accepted: true
        },
        evidence: {
          timestamp: new Date().toISOString(),
          ip: mockIp,
          user_agent: navigator.userAgent
        }
      };

      setSignaturePayload(payload);
      setIsSigning(false);
      console.log("Firma Electrónica Simple Generada:", payload);
      if (onSignSuccess) onSignSuccess(payload);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Previsualización del Documento (Mock) */}
      <div className="relative group">
        <label className="text-[10px] uppercase font-black text-conaf-600 tracking-widest mb-2 flex items-center gap-2">
          <FileText size={14} /> 
          Verificación de Documento Final
        </label>
        
        <div className="h-48 w-full bg-white border border-gray-100 rounded-2xl shadow-inner overflow-y-auto scrollbar-thin p-5 text-[11px] text-gray-500 leading-relaxed font-serif relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent pointer-events-none sticky z-10" />
          
          <h4 className="font-bold text-gray-800 text-center mb-4 text-xs">MINUTA DE CONTRATO DE TRABAJO</h4>
          <p className="mb-3">
            En Santiago, a {new Date().toLocaleDateString('es-CL')}, se conviene el siguiente contrato de trabajo entre la 
            <strong> CORPORACIÓN NACIONAL FORESTAL (CONAF)</strong> y el trabajador individualizado en la sección de antecedentes...
          </p>
          <p className="mb-3">
            <strong>CLÁUSULA PRIMERA:</strong> Las funciones que desempeñará el trabajador serán aquellas detalladas en el anexo técnico...
          </p>
          <p className="mb-3">
            <strong>CLÁUSULA SEGUNDA:</strong> La jornada ordinaria de trabajo será de 44 horas semanales repartidas de Lunes a Viernes...
          </p>
          <p className="mb-3 italic text-gray-600">
            [... Contenido omitido para brevedad de la maqueta ...]
          </p>
          <p className="mt-6 text-[10px] text-center text-gray-600">
            Este documento está listo para ser validado legalmente bajo la Ley 19.799.
          </p>

          <div className="sticky bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none flex justify-center items-end pb-2">
            <ChevronDown className="text-conaf-300 animate-bounce" size={20} />
          </div>
        </div>
      </div>

      {/* 2. Área de Aceptación Legal */}
      <div className={`p-5 rounded-3xl transition-all duration-300 border-2 ${isAccepted ? 'bg-conaf-50/50 border-conaf-400 shadow-emerald-50' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
        <div className="flex items-start gap-4">
          <div className="relative flex items-center h-5">
            <input
              id="acceptance-checkbox"
              type="checkbox"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
              className="w-5 h-5 text-conaf-600 border-gray-300 rounded-lg focus:ring-conaf-500 cursor-pointer accent-conaf-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="acceptance-checkbox" className="text-sm font-bold text-conaf-900 leading-tight cursor-pointer selection:bg-transparent">
              Declaro que he leído y acepto el contenido del documento.
            </label>
            <p className="text-[11px] text-gray-700 leading-normal">
              Acepto firmar este documento mediante <span className="font-bold text-conaf-700">Firma Electrónica Simple (FES)</span>. 
              Entiendo que este acto tiene validez legal plena bajo la Ley 19.799 en Chile.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Acción de Firma */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleSign}
          disabled={!isAccepted || isSigning || !!signaturePayload}
          className={`
            relative w-full py-4 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] overflow-hidden
            ${(isAccepted && !signaturePayload)
              ? 'bg-conaf-700 text-white shadow-lg shadow-conaf-900/20 hover:bg-conaf-800' 
              : 'bg-gray-200 text-gray-600 cursor-not-allowed border border-gray-300 opacity-60'
            }
          `}
        >
          {isSigning ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Procesando Prueba de Evidencia...</span>
            </div>
          ) : signaturePayload ? (
            <div className="flex items-center gap-3 animate-in zoom-in duration-300">
              <CheckCircle2 size={24} className="text-conaf-300" />
              <span>Documento Firmado Exitosamente</span>
            </div>
          ) : (
            <>
              <ShieldCheck size={20} />
              <span>Firmar Instrumento Legal</span>
            </>
          )}
        </button>

        {signaturePayload && (
          <div className="flex items-center justify-center gap-2 group cursor-help py-1">
            <Info size={12} className="text-conaf-500" />
            <span className="text-[10px] uppercase font-bold text-conaf-500 tracking-widest">Hash de documento validado. Evidencia técnica registrada.</span>
          </div>
        )}
      </div>

      {/* 4. Modo Debug (Estructura de Datos) */}
      {signaturePayload && (
        <div className="mt-4 animate-in scale-in-95 duration-500">
          <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl relative border-t-4 border-gold">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-gold">
                <Terminal size={16} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Metadata de Firma (JSON Payload)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/70 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Válido para Middleware
              </div>
            </div>
            
            <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
              {JSON.stringify(signaturePayload, null, 2)}
            </pre>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <Fingerprint size={12} />
                  FES-CHILE-V1
                </div>
                <div>IP: {signaturePayload.evidence.ip}</div>
              </div>
              <button 
                onClick={() => window.alert('JSON copiado al portapapeles (Simulado)')} 
                className="text-gold hover:text-white transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider underline underline-offset-4 decoration-gold/30 hover:decoration-white"
              >
                Copiar JSON de Evidencia
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FesSignatureSection;
