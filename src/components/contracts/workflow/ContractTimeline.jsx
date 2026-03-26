import React from 'react';
import { CheckCircle2, Circle, Clock, User, Monitor } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Muestra la línea de tiempo del ciclo de vida del contrato (Revisado, Impreso, Escaneado)
 */
const ContractTimeline = ({ history = [] }) => {
  if (!history || history.length === 0) return (
    <div className="p-8 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
      <Clock className="mx-auto text-neutral-300 mb-2" size={24} />
      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Sin historial de eventos aún</p>
    </div>
  );

  return (
    <div className="space-y-6 relative pl-4">
      {/* Valla vertical conectora */}
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-neutral-100" />
      
      {history.map((event, idx) => (
        <div key={idx} className="flex gap-4 relative group">
          <div className="z-10 bg-white rounded-full p-1 border-2 border-neutral-100 group-last:border-primary shadow-sm transition-all">
            <CheckCircle2 size={14} className={idx === 0 ? "text-primary" : "text-neutral-300"} />
          </div>
          
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black text-primary uppercase tracking-extreme">{event.estado}</span>
              <span className="text-[9px] font-bold text-neutral-400">
                {format(new Date(event.fecha || event.timestamp), "HH:mm '·' d MMM yyyy", { locale: es })}
              </span>
            </div>
            
            <p className="text-xs font-bold text-neutral-900 mb-2">{event.accion || `Transición a ${event.estado}`}</p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 opacity-60">
                <User size={10} className="text-neutral-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">{event.usuario || "Sistema"}</span>
              </div>
              {event.ip && (
                <div className="flex items-center gap-1.5 opacity-60">
                  <Monitor size={10} className="text-neutral-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">IP: {event.ip}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContractTimeline;
