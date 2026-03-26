import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileEdit, ArrowUpDown, ArrowUp, ArrowDown, User } from 'lucide-react';
import { fmtCLP, fmtRut, truncate } from '../../utils/formatters';

const ContractTable = ({ employees, onOpenContract }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const pageSize = 15;

  // Ordenamiento usando las llaves normalizadas
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      setSortConfig({ key: null, direction: null });
      return;
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    const list = Array.isArray(employees) ? employees : [];
    if (!sortConfig.key) return list;
    const sorted = [...list].sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [employees, sortConfig]);

  // Paginación
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={12} className="opacity-20 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-primary-light" /> : <ArrowDown size={12} className="text-primary-light" />;
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
          <thead className="sticky top-0 z-20">
            <tr className="bg-primary-dark text-white font-black text-[10px] uppercase tracking-extreme whitespace-nowrap">
              <th className="px-6 py-5 w-[140px] cursor-pointer group hover:bg-primary transition-colors border-r border-white/5" onClick={() => handleSort('rut')}>
                <div className="flex items-center gap-2">RUT <SortIcon columnKey="rut" /></div>
              </th>
              <th className="px-6 py-5 cursor-pointer group hover:bg-primary transition-colors border-r border-white/5" onClick={() => handleSort('nombre')}>
                <div className="flex items-center gap-2">Funcionario <SortIcon columnKey="nombre" /></div>
              </th>
              <th className="px-6 py-5 w-[220px] cursor-pointer group hover:bg-primary transition-colors border-r border-white/5" onClick={() => handleSort('cargo')}>
                <div className="flex items-center gap-2">Cargo <SortIcon columnKey="cargo" /></div>
              </th>
              <th className="px-6 py-5 w-[160px] cursor-pointer group hover:bg-primary transition-colors border-r border-white/5" onClick={() => handleSort('contratoTipo')}>
                <div className="flex items-center gap-2">Régimen <SortIcon columnKey="contratoTipo" /></div>
              </th>
              <th className="px-6 py-5 w-[180px] cursor-pointer group hover:bg-primary transition-colors border-r border-white/5" onClick={() => handleSort('bruta')}>
                <div className="flex items-center gap-2 text-right justify-end">R. Bruta (Méd.) <SortIcon columnKey="bruta" /></div>
              </th>
              <th className="px-6 py-5 w-[140px] cursor-pointer group hover:bg-primary transition-colors border-r border-white/5" onClick={() => handleSort('estadoAuditoria')}>
                <div className="flex items-center gap-2">Proceso <SortIcon columnKey="estadoAuditoria" /></div>
              </th>
              <th className="px-6 py-5 w-[100px] text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-32 text-center bg-neutral-50/10">
                   <div className="flex flex-col items-center gap-6 animate-pulse">
                     <User size={48} strokeWidth={1} className="text-neutral-200" />
                     <p className="text-[10px] font-black uppercase tracking-extreme text-neutral-400">Sin registros de auditoría que coincidan</p>
                   </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr 
                  key={row.id || row.rut} 
                  className="group hover:bg-primary/5 transition-all duration-300"
                >
                  <td className="px-6 py-5 text-[11px] font-black text-primary-dark font-mono tracking-tighter whitespace-nowrap border-r border-neutral-50/50 group-hover:bg-primary/5 transition-colors">{fmtRut(row.rut)}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-neutral-900 leading-tight group-hover:text-primary transition-colors">
                        {row.nombre || 'N/A'}
                      </span>
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                        {row.organismo || 'Corporación'}
                      </span>
                    </div>
                  </td>
                  <td 
                    className="px-6 py-5 text-[11px] font-bold text-neutral-500 truncate italic cursor-help hover:text-neutral-700 transition-colors"
                    title={row.cargo}
                  >
                    {truncate(row.cargo, 35)}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                      String(row.contratoTipo || '').includes('Planta') ? 'bg-success/10 text-success border border-success/20' :
                      String(row.contratoTipo || '').includes('Honorarios') ? 'bg-warning/10 text-warning border border-warning/20' :
                      'bg-secondary/10 text-secondary border border-secondary/20'
                    }`}>
                      {row.contratoTipo}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-right text-neutral-900 tracking-tighter font-mono border-r border-neutral-50/50">
                    {fmtCLP(row.bruta)}
                  </td>
                  <td className="px-6 py-5 text-center border-r border-neutral-50/50">
                    {!row.estadoAuditoria ? (
                      <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest border border-dashed border-neutral-200 px-2 py-1 rounded-lg">Sin Contrato</span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        row.estadoAuditoria === 'COMPLETADO' ? 'bg-success/10 text-success border-success/20' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {row.estadoAuditoria.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => onOpenContract(row)}
                      className="p-3 text-primary-light hover:bg-primary hover:text-white rounded-2xl transition-all shadow-soft active:scale-90 group/btn border border-neutral-100 bg-white"
                      title="Gestionar"
                    >
                      <FileEdit size={16} strokeWidth={2.5} className="group-hover/btn:rotate-12 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Paginación */}
      <div className="h-16 bg-white flex items-center justify-between px-10 border-t border-neutral-100 shrink-0 z-10">
        <div className="text-[9px] font-black text-neutral-400 uppercase tracking-extreme">
          Registro <span className="text-neutral-900">{(currentPage-1)*pageSize + (paginatedData.length > 0 ? 1 : 0)}-{(currentPage-1)*pageSize + paginatedData.length}</span> de <span className="text-primary font-mono text-xs">{sortedData.length}</span> activos.
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-3 rounded-2xl border border-neutral-100 hover:bg-neutral-50 disabled:opacity-20 text-neutral-400"
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>
          <div className="flex items-center gap-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[40px] h-10 rounded-2xl text-[11px] font-black ${currentPage === (i + 1) ? 'bg-primary text-white shadow-premium' : 'text-neutral-400'}`}
                >
                  {i + 1}
                </button>
            ))}
          </div>
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-3 rounded-2xl border border-neutral-100 hover:bg-neutral-50 disabled:opacity-20 text-neutral-400"
          >
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractTable;
