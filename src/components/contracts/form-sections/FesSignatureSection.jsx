import React, { useState } from 'react';
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
 * Actualizado con el nuevo Sistema de Diseño Institucional.
 */
const FesSignatureSection = ({ documentInfo, userInfo, onSignSuccess }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [signaturePayload, setSignaturePayload] = useState(null);
  const [isSigning, setIsSigning] = useState(false);

  const mockIp = "201.214.34.112";

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      const payload = {
        document: {
          id: documentInfo?.id || "doc_123",
          name: documentInfo?.name || "Contrato de Trabajo - CONAF",
          hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        },
        signer: {
          user_id: userInfo?.id || "user_456",
          email: userInfo?.email || "rrhh@conaf.cl",
          name: userInfo?.name || "Certificador CONAF"
        },
        signature: { type: "simple", method: "checkbox_acceptance", accepted: true },
        evidence: {
          timestamp: new Date().toISOString(),
          ip: mockIp,
          user_agent: navigator.userAgent
        }
      };
      setSignaturePayload(payload);
      setIsSigning(false);
      if (onSignSuccess) onSignSuccess(payload);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-8 p-1 animate-in fade-in duration-700">
      
      {/* 1. Previsualización del Documento (Vista Ejecutiva) */}
      <div className="relative group">
        <label className="text-[9px] uppercase font-black text-neutral-400 tracking-extreme mb-4 flex items-center gap-2">
          <FileText size={14} className="text-primary-light" /> 
          Verificación de Contenido Legal
        </label>
        
        <div className="h-44 w-full bg-neutral-50/50 border border-neutral-100 rounded-[28px] shadow-inner overflow-y-auto scrollbar-none p-6 text-[11px] text-neutral-500 leading-relaxed font-serif relative">
          <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-white to-transparent pointer-events-none sticky z-10" />
          
          <h4 className="font-black text-neutral-900 text-center mb-6 text-xs uppercase tracking-widest">Contrato de Trabajo Institucional</h4>
          <p className="mb-4">
            Mediante el presente instrumento, las partes ratifican los términos acordados en el formulario de modificación contractual...
          </p>
          <p className="mb-4">
            El trabajador declara estar en conocimiento de sus nuevas funciones y remuneraciones, las cuales se ajustan a la normativa vigente.
          </p>
          <p className="text-[9px] text-center text-neutral-400 mt-8 pb-4">
            Validado por el Departamento de Recursos Humanos CONAF.
          </p>

          <div className="sticky bottom-0 left-0 w-full h-12 bg-gradient-to-t from-neutral-50 to-transparent pointer-events-none flex justify-center items-end">
            <ChevronDown className="text-primary-light/50 animate-bounce" size={20} />
          </div>
        </div>
      </div>

      {/* 2. Área de Aceptación Legal (Reubicada y Estilizada) */}
      <div className={`p-6 rounded-[32px] transition-all duration-500 border-2 ${isAccepted ? 'bg-success/5 border-success/30 shadow-soft' : 'bg-neutral-50 border-neutral-100'}`}>
        <div className="flex items-start gap-4">
          <div className="flex items-center h-6">
            <input
              id="acceptance-checkbox"
              type="checkbox"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
              className="w-6 h-6 text-primary border-neutral-300 rounded-xl focus:ring-primary cursor-pointer accent-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="acceptance-checkbox" className="text-[13px] font-black text-neutral-900 leading-tight cursor-pointer">
              He leído y acepto el contenido del documento.
            </label>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
              Acepto firmar mediante <span className="text-primary font-bold">Firma Electrónica Simple (FES)</span>. 
              Este acto posee validez legal plena bajo la <span className="underline decoration-primary/20">Ley 19.799</span>.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Acción de Firma con el nuevo Contraste */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleSign}
          disabled={!isAccepted || isSigning || !!signaturePayload}
          className={`
            btn-premium relative w-full h-16 rounded-[24px] font-black text-xs uppercase tracking-extreme flex items-center justify-center gap-4 transition-all
            ${(isAccepted && !signaturePayload)
              ? 'bg-primary text-white shadow-premium hover:bg-primary-dark' 
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-60'
            }
          `}
        >
          {isSigning ? (
            <>
              <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Protegiendo Hash...</span>
            </>
          ) : signaturePayload ? (
            <>
              <CheckCircle2 size={22} className="text-white animate-in zoom-in" />
              <span>Documento Certificado</span>
            </>
          ) : (
            <>
              <ShieldCheck size={20} className={isAccepted ? 'animate-bounce-subtle' : ''} />
              <span>Firmar Instrumento Legal</span>
            </>
          )}
        </button>

        {signaturePayload && (
          <div className="flex items-center justify-center gap-2 animate-in fade-in duration-1000">
            <Fingerprint size={14} className="text-success" />
            <span className="text-[9px] uppercase font-black text-success tracking-widest">Evidencia técnica registrada en Hash SHA-256</span>
          </div>
        )}
      </div>

      {/* 4. Metadata de Seguridad (Modernizada) */}
      {signaturePayload && (
        <div className="animate-in slide-in-from-top-4 duration-700">
          <div className="bg-neutral-900 rounded-[32px] p-8 shadow-premium relative border-t-4 border-primary">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-primary-light">
                <Terminal size={18} />
                <span className="text-[10px] uppercase font-black tracking-extreme">Payload de Seguridad FES</span>
              </div>
              <div className="px-3 py-1 bg-success/20 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] font-black text-success uppercase">Verificado</span>
              </div>
            </div>
            
            <pre className="text-[10px] font-mono text-primary-light/80 overflow-x-auto leading-relaxed scrollbar-none">
              {JSON.stringify(signaturePayload, null, 2)}
            </pre>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                ID: {signaturePayload.document.hash.slice(0, 16)}...
              </div>
              <button 
                onClick={() => console.log("ID de Evidencia copiado")}
                className="text-primary-light hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                Auditar Evidencia
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
