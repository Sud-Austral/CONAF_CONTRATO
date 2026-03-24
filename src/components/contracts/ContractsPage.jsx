import React, { useState, useMemo } from 'react';
import { useConafData } from '../../context/DataContext';
import ContractTable from './ContractTable';
import ContractDrawer from './ContractDrawer';
import SectionTitle from '../common/SectionTitle';
import { Search, FilterX } from 'lucide-react';

const ContractsPage = () => {
  const { rows } = useConafData();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pre-procesar rows para obtener solo la versión más reciente de cada funcionario (RUT único)
  const latestRows = useMemo(() => {
    const map = new Map();
    rows.forEach(row => {
      const existing = map.get(row.rut);
      if (!existing) {
        map.set(row.rut, row);
      } else {
        // Comparar por año y mesNum para asegurar que es el más reciente
        if (row.anyo > existing.anyo || (row.anyo === existing.anyo && row.mesNum > existing.mesNum)) {
          map.set(row.rut, row);
        }
      }
    });
    return Array.from(map.values());
  }, [rows]);

  // Filtrar por término de búsqueda (nombre o RUT)
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return latestRows;
    const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return latestRows.filter(r => {
      const name = (r.nombrecompleto_x || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const rut = (r.rut || '').toLowerCase();
      return name.includes(term) || rut.includes(term);
    });
  }, [latestRows, searchTerm]);

  const handleOpenContract = (employee) => {
    setSelectedEmployee(employee);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    // No reseteamos el funcionario inmediatamente para la animación
  };

  return (
    <div className="flex flex-col h-full bg-bg p-6 md:p-8 space-y-8 animate-in fade-in duration-500 overflow-hidden">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <SectionTitle 
          title="Gestión de Contratos"
          subtitle="Modificación de condiciones contractuales y generación de firmas digitales."
        />
        
        <div className="relative w-full max-w-md group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-conaf-400 group-focus-within:text-conaf-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por RUT o Nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-white border border-conaf-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-conaf-200 focus:border-conaf-400 text-sm transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <FilterX size={16} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[24px] shadow-card border border-conaf-100/50 overflow-hidden flex flex-col relative group">
        <ContractTable 
          employees={filteredEmployees} 
          onOpenContract={handleOpenContract} 
        />
        
        {/* Glow effect on hover bottom */}
        <div className="absolute inset-x-10 bottom-0 h-1 bg-conaf-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      <ContractDrawer 
        isOpen={drawerOpen} 
        onClose={handleCloseDrawer} 
        employee={selectedEmployee} 
      />
    </div>
  );
};

export default ContractsPage;
