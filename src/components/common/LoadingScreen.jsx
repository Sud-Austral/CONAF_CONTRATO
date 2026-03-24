import React from 'react';
import { Trees, RefreshCw } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center p-6 z-[9999]">
      <div className="relative mb-8 group animate-pulse">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-lg border border-conaf-200 flex items-center justify-center text-conaf-600">
          <Trees size={64} strokeWidth={1} />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-conaf-500 rounded-full flex items-center justify-center text-white border-4 border-bg shadow-sm spin-reverse">
          <RefreshCw size={18} className="animate-spin" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold font-display text-conaf-800 mb-2 tracking-tight">Cargando datos...</h1>
      <p className="text-text-muted text-sm text-center max-w-xs leading-relaxed">
        Estamos recuperando y procesando la información de personal institucional de CONAF.
      </p>

      <div className="mt-12 w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-conaf-500 rounded-full animate-loading-bar" />
      </div>

      <style jsx>{`
        .animate-loading-bar {
          animation: loading 2s ease-in-out infinite;
          width: 30%;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
