import React, { useState, useMemo } from 'react';
import { useConafData } from '../../context/DataContext';
import ContractTable from './ContractTable';
import ContractDrawer from './ContractDrawer';
import SectionTitle from '../common/SectionTitle';
import { Search, FilterX, ChevronDown, DollarSign, Briefcase, FileText } from 'lucide-react';

const ContractsPage = () => {
  const { rows, uniqueValues } = useConafData();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Nuevos filtros locales
  const [filterCargo, setFilterCargo] = useState('Todos');
  const [filterContrato, setFilterContrato] = useState('Todos');
  const [filterRango, setFilterRango] = useState('Todos');

  // RANGOS DE REMUNERACIÓN
  const RANGOS = [
    { label: 'Todos', min: 0, max: Infinity },
    { label: 'Menos de $750k', min: 0, max: 750000 },
    { label: '$750k - $1.2M', min: 750000, max: 1200000 },
    { label: '$1.2M - $2M', min: 1200000, max: 2000000 },
    { label: 'Más de $2M', min: 2000000, max: Infinity },
  ];

  // Agrupar filas para consolidar historial
  const latestRows = useMemo(() => {
    const groups = new Map();
    rows.forEach(row => {
      const groupKey = `${row.rut}|${row.tipo_cargo || ''}|${row.tipo_de_contrato || ''}`;
      const existing = groups.get(groupKey);
      if (!existing) {
        groups.set(groupKey, { ...row, sumBruta: parseFloat(row.remuneracionbruta_mensual) || 0, count: 1 });
      } else {
        existing.sumBruta += parseFloat(row.remuneracionbruta_mensual) || 0;
        existing.count += 1;
        if (row.anyo > existing.anyo || (row.anyo === existing.anyo && row.mesNum > existing.mesNum)) {
          const { sumBruta, count } = existing;
          Object.assign(existing, row);
          existing.sumBruta = sumBruta;
          existing.count = count;
        }
      }
    });

    return Array.from(groups.values())
      .map(group => ({
        ...group,
        remuneracionbruta_mensual: Math.round(group.sumBruta / group.count)
      }))
      .sort((a, b) => b.anyo !== a.anyo ? b.anyo - a.anyo : (b.mesNum || 0) - (a.mesNum || 0));
  }, [rows]);

  // Filtrado multivariante
  const filteredEmployees = useMemo(() => {
    return latestRows.filter(r => {
      // Búsqueda Texto
      const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const name = (r.nombrecompleto_x || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const matchesSearch = !searchTerm || name.includes(term) || String(r.rut).toLowerCase().includes(term);

      // Filtro Cargo
      const matchesCargo = filterCargo === 'Todos' || r.tipo_cargo === filterCargo;
      
      // Filtro Contrato
      const matchesContrato = filterContrato === 'Todos' || r.tipo_de_contrato === filterContrato;
      
      // Filtro Rango Salarial
      const rango = RANGOS.find(rg => rg.label === filterRango);
      const val = r.remuneracionbruta_mensual || 0;
      const matchesRango = val >= rango.min && val <= rango.max;

      return matchesSearch && matchesCargo && matchesContrato && matchesRango;
    });
  }, [latestRows, searchTerm, filterCargo, filterContrato, filterRango]);

  const resetLocalFilters = () => {
    setSearchTerm('');
    setFilterCargo('Todos');
    setFilterContrato('Todos');
    setFilterRango('Todos');
  };

  const handleOpenContract = (employee) => {
    setSelectedEmployee(employee);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 p-6 md:p-8 space-y-6 animate-in fade-in duration-500 overflow-hidden font-body">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <SectionTitle 
          title="Gestión de Contratos"
          subtitle="Panel avanzado de administración de personal y auditoría salarial."
        />
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-80 group">
            <Search size={16} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Nombre o RUT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-200 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold transition-all"
            />
          </div>
          <button 
            onClick={resetLocalFilters}
            className="p-2.5 bg-white border border-neutral-200 rounded-2xl text-neutral-400 hover:text-error hover:border-error/20 transition-all shadow-soft"
            title="Limpiar filtros"
          >
            <FilterX size={18} />
          </button>
        </div>
      </header>

      {/* FILTROS RÁPIDOS (Recomendación UX) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        <div className="relative group">
          <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
          <select 
            value={filterCargo}
            onChange={(e) => setFilterCargo(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-neutral-200 rounded-[20px] shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/10 text-[11px] font-black uppercase tracking-wider appearance-none cursor-pointer"
          >
            <option>Todos</option>
            {uniqueValues.tipoCargo?.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none group-hover:text-primary transition-colors" />
        </div>

        <div className="relative group">
          <FileText size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
          <select 
            value={filterContrato}
            onChange={(e) => setFilterContrato(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-neutral-200 rounded-[20px] shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/10 text-[11px] font-black uppercase tracking-wider appearance-none cursor-pointer"
          >
            <option>Todos</option>
            {uniqueValues.tipoContrato?.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none group-hover:text-primary transition-colors" />
        </div>

        <div className="relative group">
          <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
          <select 
            value={filterRango}
            onChange={(e) => setFilterRango(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-neutral-200 rounded-[20px] shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/10 text-[11px] font-black uppercase tracking-wider appearance-none cursor-pointer"
          >
            {RANGOS.map(r => <option key={r.label}>{r.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none group-hover:text-primary transition-colors" />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[32px] shadow-premium border border-neutral-100 overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
        <ContractTable 
          employees={filteredEmployees} 
          onOpenContract={handleOpenContract} 
        />
      </div>

      <ContractDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        employee={selectedEmployee} 
      />
    </div>
  );
};

export default ContractsPage;
