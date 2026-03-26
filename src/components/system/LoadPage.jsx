import React, { useState } from 'react';
import { 
  Download, Upload, ShieldAlert, FileSearch, 
  CheckCircle2, AlertCircle, RefreshCw, HardDrive 
} from 'lucide-react';
import { systemService } from '../../services/api';

const LoadPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await systemService.exportFullBackup();
      setSuccess("Respaldo Total (DB + PDFs) descargado correctamente.");
    } catch (err) {
      setError("No se pudo generar el respaldo. Verifique su conexión y sesión activa.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm("¡ALERTA CRÍTICA! Esta acción ELIMINARÁ todos los Empleados, Contratos y Audit Logs actuales para reemplazarlos por los del Backup. ¿Está absolutamente seguro?")) {
      e.target.value = '';
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await systemService.importFullBackup(file);
      const log = res.report?.log?.join('\n') || '';
      setSuccess(`Sincronización Total Exitosa.`);
      console.log("Reporte de importación:", log);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'object' ? (detail.msg || "Error crítico") : (detail || "Error al subir respaldo."));
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/10 animate-in fade-in duration-700 font-body">
      {/* Header */}
      <header className="px-10 py-10 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black font-display text-neutral-900 tracking-tight leading-tight">
            Gestión de <span className="text-primary">Archivos</span>
          </h1>
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <HardDrive size={12} className="text-primary" />
            Sincronización Total (Base de Datos + PDFs)
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-10 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Status Messages */}
          {success && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
              <CheckCircle2 size={20} className="text-success" />
              <p className="text-xs font-black uppercase tracking-widest text-success">{success}</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
              <AlertCircle size={20} className="text-error" />
              <p className="text-xs font-black uppercase tracking-widest text-error">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card: EXPORT */}
            <div className={`p-8 bg-white rounded-[40px] border border-neutral-100 shadow-premium transition-all hover:shadow-hover group ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Download size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-neutral-900 mb-2">Exportar Todo</h2>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed mb-8">
                Crea un archivo ZIP con todos los contratos, empleados, logs y PDFs.
                Utilice esta opción para mover el sistema completo entre entornos.
              </p>
              <button
                onClick={handleExport}
                className="w-full py-4 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-extreme hover:bg-primary-dark transition-all active:scale-95 shadow-soft"
              >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} strokeWidth={3} />}
                Descargar Backup .ZIP
              </button>
            </div>

            {/* Card: IMPORT */}
            <div className={`p-8 bg-white rounded-[40px] border border-neutral-100 shadow-premium transition-all hover:shadow-hover group ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-neutral-900 mb-2">Importar Backup</h2>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed mb-8">
                Suba un archivo generado por este sistema para restaurar el estado completo.
                <span className="text-orange-600 block mt-2 font-black italic">! ADVERTENCIA: LIMPIA LA BASE DE DATOS Y EL VOLUMEN.</span>
              </p>
              
              <label className="w-full py-4 bg-orange-500 text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-extreme hover:bg-orange-600 transition-all active:scale-95 shadow-soft cursor-pointer">
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <Upload size={16} strokeWidth={3} />}
                Cargar Archivo .ZIP
                <input
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
            </div>

          </div>

          {/* Info Section */}
          <div className="p-8 bg-primary-dark rounded-[40px] text-white">
             <div className="flex items-start gap-4">
                <ShieldAlert size={28} className="text-primary-light shrink-0" />
                <div>
                   <h3 className="text-sm font-black uppercase tracking-extreme mb-3 text-primary-light">Guía de Seguridad</h3>
                   <ul className="space-y-3 opacity-80 text-[10px] font-bold uppercase tracking-widest">
                       <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                          Esta operación registra una entrada en el Log de Auditoría.
                       </li>
                       <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                          El sistema se bloquea para otros usuarios durante la importación.
                       </li>
                   </ul>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoadPage;
