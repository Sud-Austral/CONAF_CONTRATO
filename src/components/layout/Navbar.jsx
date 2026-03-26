import { LogOut, User, Activity, FileText, HardDrive } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'contracts', label: 'Gestión de Contratos', icon: FileText },
    { id: 'load',      label: 'Archivos / Backup', icon: HardDrive },
  ];

  // Ya no filtramos por rol, todos ven todo (según requerimiento)
  // Pero ocultamos 'load' del menú por petición del usuario (acceso directo por URL)
  const availableTabs = tabs.filter(t => t.id !== 'load');

  return (
    <nav className="h-16 bg-primary-dark flex items-center justify-between px-8 relative z-50 shadow-premium shrink-0 border-b border-white/5">
      {/* Brand */}
      <div className="flex items-center gap-4 group cursor-default">
        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-primary-light transition-transform group-hover:scale-110">
          <span className="text-xl">🌲</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black text-sm tracking-tight leading-none">CONAF</span>
          <span className="text-primary-light font-black text-[8px] tracking-extreme mt-1 uppercase">Institucional</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex h-full items-stretch gap-2">
        {availableTabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 flex items-center gap-3 transition-all relative group
                ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}
              `}
            >
              <Icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-primary-light' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-light animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* User & Logout */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white text-[11px] font-black leading-none">{user?.nombre || "Usuario"}</p>
            <p className="text-primary-light text-[8px] font-black tracking-widest mt-1 uppercase opacity-80">{user?.rol || "Rol"}</p>
          </div>
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-inner">
            {user?.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "AD"}
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="p-3 bg-error/10 text-error hover:bg-error hover:text-white rounded-xl transition-all active:scale-90 border border-error/20 group"
          title="Cerrar Sesión"
        >
          <LogOut size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
