import React from 'react';
import { LayoutDashboard, FileText, Trees } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'contracts', label: 'Gestión de Contratos', icon: <FileText size={20} /> },
  ];

  return (
    <nav className="h-14 bg-conaf-800 shadow-md flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-conaf-700 shadow-sm">
          <Trees size={22} strokeWidth={2.5} />
        </div>
        <h1 className="text-white font-display text-lg font-bold tracking-tight">CONAF</h1>
      </div>

      <div className="flex items-center gap-8 h-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-3 h-full transition-all relative border-b-3
              ${activeTab === tab.id 
                ? 'text-white font-semibold' 
                : 'text-conaf-200 hover:text-white'
              }
            `}
          >
            {tab.icon}
            <span className="text-sm">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold animate-in fade-in slide-in-from-bottom-1" />
            )}
          </button>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-white text-xs font-semibold">RR.HH. Usuario</span>
          <span className="text-conaf-300 text-[10px] uppercase tracking-wider">Administrador de Personal</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-conaf-700 border border-conaf-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
          AD
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
