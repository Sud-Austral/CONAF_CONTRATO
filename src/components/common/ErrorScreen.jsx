import React from 'react';
import { TriangleAlert, RefreshCcw, FileQuestion } from 'lucide-react';

const ErrorScreen = ({ error, retry }) => {
  return (
    <div className="fixed inset-0 bg-red-50 flex flex-col items-center justify-center p-6 z-[9999]">
      <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mb-8 shadow-sm">
        <TriangleAlert size={48} />
      </div>

      <h1 className="text-2xl font-bold font-display text-red-900 mb-2">Error Crítico del Sistema</h1>
      <p className="text-red-700 text-center max-w-md mb-8 leading-relaxed">
        No se pudieron cargar los datos de personal necesarios para el funcionamiento de la aplicación.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-200 max-w-lg w-full mb-10 overflow-hidden">
        <div className="flex items-start gap-4 mb-4">
          <FileQuestion className="text-red-400 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">Detalle Técnico:</h3>
            <code className="text-xs bg-red-50 p-2 block rounded font-mono text-red-600 break-words whitespace-pre-wrap">
              {error || 'No especificado'}
            </code>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-red-100">
          <h3 className="text-sm font-bold text-gray-800">Sugerencias de Solución:</h3>
          <ul className="text-sm text-gray-600 space-y-3 leading-tight">
            <li className="flex gap-2">
              <span className="font-bold text-red-500 shrink-0">1.</span> Verifique que <span className="font-mono bg-gray-100 px-1 rounded">public/data.json.gz</span> exista.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-red-500 shrink-0">2.</span> Asegúrese de ejecutar el proyecto con <span className="font-mono bg-gray-100 px-1 rounded">npm run dev</span>.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-red-500 shrink-0">3.</span> Compruebe que el JSON esté correctamente generado y comprimido.
            </li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 group"
      >
        <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        <span>Reintentar carga de sistema</span>
      </button>
    </div>
  );
};

export default ErrorScreen;
