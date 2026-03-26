import React, { useState, useEffect, useCallback } from 'react';
import { useConafData } from '../../context/DataContext';
import ContractTable from './ContractTable';
import ContractDrawer from './ContractDrawer';
import ContractListTab from './ContractListTab';
import {
  Search, FilterX, Users, FileText, ScanLine,
  CheckCircle2, Clock, ChevronRight
} from 'lucide-react';

// ─── Definición de Pestañas ──────────────────────────────────────────────────
const TABS = [
  {
    id: 'funcionarios',
    label: 'Funcionarios',
    sublabel: 'Crear y gestionar contratos',
    icon: Users,
    description: 'Busca un funcionario para crear o continuar su proceso de contrato.',
  },
  {
    id: 'con-pdf',
    label: 'Con PDF',
    sublabel: 'Documentos generados',
    icon: FileText,
    estadoFilter: null,      // Todos los que tienen pdf_generado_path (el backend filtra)
    hasPdf: true,
    description: 'Contratos que ya tienen un PDF generado en el sistema.',
  },
  {
    id: 'completados',
    label: 'Completados',
    sublabel: 'Firmados y archivados',
    icon: CheckCircle2,
    estadoFilter: 'COMPLETADO',
    description: 'Contratos con firma física confirmada y PDF escaneado adjunto.',
  },
  {
    id: 'pendientes-escaneo',
    label: 'Pendientes de Escaneo',
    sublabel: 'En espera de firma física',
    icon: ScanLine,
    estadoFilter: 'ESPERANDO_FIRMA',
    description: 'Contratos entregados para firma física aún no escaneados.',
  },
];

// ─── TabBar ──────────────────────────────────────────────────────────────────
const TabBar = ({ activeTab, onTabChange, counts }) => (
  <div className="flex items-stretch gap-1 p-1.5 bg-neutral-100/80 rounded-[28px] backdrop-blur-sm">
    {TABS.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      const count = counts?.[tab.id];

      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative flex items-center gap-2.5 px-5 py-3 rounded-[22px] transition-all duration-300
            ${isActive
              ? 'bg-white text-primary-dark shadow-premium scale-[1.02]'
              : 'text-neutral-400 hover:text-neutral-700 hover:bg-white/50'}
          `}
        >
          <Icon
            size={16}
            strokeWidth={isActive ? 3 : 2}
            className={`transition-all duration-300 ${isActive ? 'text-primary' : ''}`}
          />
          <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${isActive ? 'text-primary-dark' : ''}`}>
            {tab.label}
          </span>
          {isActive && count !== undefined && count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

// ─── Página Principal ─────────────────────────────────────────────────────────
  const ContractsPage = () => {
  const { searchEmployees } = useConafData();
  const [employees, setEmployees]         = useState([]);
  const [loading, setLoading]             = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [activeTab, setActiveTab]         = useState('funcionarios');
  const [processFilter, setProcessFilter] = useState(''); // '', 'SIN_CONTRATO', 'EN_PROCESO', 'COMPLETADO'

  // Buscar empleados (solo en pestaña "funcionarios")
  useEffect(() => {
    if (activeTab !== 'funcionarios') return;
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await searchEmployees(searchTerm, processFilter);
        setEmployees(result || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, processFilter, searchEmployees, activeTab]);

  const handleOpenContract = (data) => {
    // Si viene de una tabla de contratos (tiene empleado_id), normalizamos
    // para que el Drawer lo entienda como un "empleado" con su respectivo ID.
    const normalizedData = data.empleado_id 
      ? { 
          ...data, 
          id: data.empleado_id, 
          nombre_completo: data.empleado_nombre || data.nombre_completo || 'Funcionario'
        } 
      : data;

    setSelectedEmployee(normalizedData);
    setDrawerOpen(true);
  };

  const activeTabConfig = TABS.find(t => t.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-neutral-50/10 animate-in fade-in duration-700 overflow-hidden font-body">

      {/* ── Header ── */}
      <header className="px-6 md:px-10 pt-8 pb-6 shrink-0 border-b border-neutral-100 bg-white">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-black font-display text-neutral-900 tracking-tight leading-tight">
              Gestión de <span className="text-primary">Contratos</span>
            </h1>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <ChevronRight size={12} />
              {activeTabConfig?.description}
            </p>
          </div>
        </div>

        {/* Tab Bar — Ahora pegado al borde inferior del header para consistencia */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      {/* ── Contenido según pestaña ── */}
      <div className="flex-1 mx-6 md:mx-10 mb-6 bg-white rounded-[40px] shadow-premium border border-neutral-100 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500">

        {/* Pestaña: Funcionarios (Unificado con buscador interno) */}
        {activeTab === 'funcionarios' && (
          <div className="flex flex-col h-full bg-slate-50/10">
            {/* Buscador y Filtros Unificados */}
            <div className="px-6 py-4 border-b border-neutral-100 bg-white shrink-0 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm group">
                <Search 
                  size={16} 
                  strokeWidth={3} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-primary animate-pulse' : 'text-neutral-300 group-focus-within:text-primary'}`} 
                />
                <input 
                  type="text" 
                  placeholder="Buscar funcionarios por nombre o RUT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-3xl text-[11px] font-bold focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-neutral-300"
                />
              </div>

              {/* Filtro de Estado de Proceso (Senior UX) */}
              <div className="flex items-center gap-3">
                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Estado Proceso:</label>
                <select 
                  value={processFilter}
                  onChange={(e) => setProcessFilter(e.target.value)}
                  className="px-6 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-[10px] font-black text-neutral-600 focus:outline-none focus:border-primary transition-all cursor-pointer hover:bg-white"
                >
                  <option value="">TODOS</option>
                  <option value="SIN_CONTRATO">SIN CONTRATO</option>
                  <option value="EN_PROCESO">EN PROCESO</option>
                  <option value="COMPLETADO">AL DÍA (COMPLETADO)</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-auto relative">
              {/* Overlay carga */}
              <div className={`absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center transition-opacity ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
              <ContractTable
                employees={employees}
                onOpenContract={handleOpenContract}
              />
            </div>
          </div>
        )}

        {/* Pestaña: Con PDF */}
        {activeTab === 'con-pdf' && (
          <ContractListTab 
            estadoFilter={null} 
            hasPdfOnly={true} 
            onOpenContract={handleOpenContract}
          />
        )}

        {/* Pestaña: Completados */}
        {activeTab === 'completados' && (
          <ContractListTab 
            estadoFilter="COMPLETADO" 
            onOpenContract={handleOpenContract}
          />
        )}

        {/* Pestaña: Pendientes de Escaneo */}
        {activeTab === 'pendientes-escaneo' && (
          <ContractListTab 
            estadoFilter="ESPERANDO_FIRMA" 
            onOpenContract={handleOpenContract}
          />
        )}
      </div>

      {/* Drawer de gestión de contrato (pestaña Funcionarios) */}
      <ContractDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default ContractsPage;
