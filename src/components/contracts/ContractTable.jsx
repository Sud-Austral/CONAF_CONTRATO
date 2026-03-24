import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileEdit, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { fmtCLP, fmtFecha, fmtRut, truncate } from '../../utils/formatters';

const ContractTable = ({ employees, onOpenContract }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'nombrecompleto_x', direction: 'asc' });
  const pageSize = 15;

  // Ordenamiento
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
    if (!sortConfig.key) return employees;
    const sorted = [...employees].sort((a, b) => {
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
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-gold" /> : <ArrowDown size={14} className="text-gold" />;
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-conaf-800 text-white font-bold text-[11px] uppercase tracking-widest whitespace-nowrap">
              <th className="px-6 py-4 w-[140px] cursor-pointer group hover:bg-conaf-700 transition-colors" onClick={() => handleSort('rut')}>
                <div className="flex items-center gap-2 font-body font-bold">RUT <SortIcon columnKey="rut" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer group hover:bg-conaf-700 transition-colors" onClick={() => handleSort('nombrecompleto_x')}>
                <div className="flex items-center gap-2 font-body font-bold">Nombre del Funcionario <SortIcon columnKey="nombrecompleto_x" /></div>
              </th>
              <th className="px-6 py-4 w-[220px] cursor-pointer group hover:bg-conaf-700 transition-colors" onClick={() => handleSort('tipo_cargo')}>
                <div className="flex items-center gap-2 font-body font-bold">Cargo <SortIcon columnKey="tipo_cargo" /></div>
              </th>
              <th className="px-6 py-4 w-[160px] cursor-pointer group hover:bg-conaf-700 transition-colors" onClick={() => handleSort('tipo_de_contrato')}>
                <div className="flex items-center gap-2 font-body font-bold">Contrato <SortIcon columnKey="tipo_de_contrato" /></div>
              </th>
              <th className="px-6 py-4 w-[180px] cursor-pointer group hover:bg-conaf-700 transition-colors" onClick={() => handleSort('remuneracionbruta_mensual')}>
                <div className="flex items-center gap-2 font-body font-bold text-right justify-end">R. Bruta <SortIcon columnKey="remuneracionbruta_mensual" /></div>
              </th>
              <th className="px-6 py-4 w-[100px] text-center font-body font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 divide-dashed">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-24 text-center">
                   <div className="flex flex-col items-center gap-4 text-gray-400">
                     <span className="text-4xl">🔎</span>
                     <p className="font-bold text-gray-500">No se encontraron funcionarios activos que coincidan.</p>
                   </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr 
                  key={row.rut} 
                  className={`group hover:bg-conaf-50 transition-colors animate-in fade-in duration-300 ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                >
                  <td className="px-6 py-4 text-sm font-bold text-conaf-800 font-mono tracking-tighter whitespace-nowrap bg-conaf-50/10 border-r border-gray-100 group-hover:bg-conaf-100 transition-colors">{fmtRut(row.rut)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800 leading-tight group-hover:text-conaf-800 transition-colors">{row.nombrecompleto_x}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-tighter mt-0.5">{row.sexo === 'M' ? 'Masculino' : 'Femenino'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600 truncate italic">{truncate(row.tipo_cargo, 35)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      row.tipo_de_contrato?.includes('Planta') ? 'bg-emerald-100 text-emerald-800' :
                      row.tipo_de_contrato?.includes('Honorarios') ? 'bg-amber-100 text-amber-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {row.tipo_de_contrato}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-right text-conaf-700 tracking-tight font-body">
                    {fmtCLP(row.remuneracionbruta_mensual)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onOpenContract(row)}
                      className="p-2 text-conaf-600 hover:bg-conaf-100 hover:text-conaf-800 rounded-xl transition-all shadow-sm hover:scale-110 active:scale-95 group/btn border border-conaf-200 bg-white"
                      title="Administrar Contrato"
                    >
                      <FileEdit size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Paginación */}
      <div className="h-14 bg-conaf-50 flex items-center justify-between px-6 border-t border-conaf-200 shrink-0 z-10 shadow-sm">
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Mostrando <span className="text-conaf-700 font-display">{(currentPage-1)*pageSize + (paginatedData.length > 0 ? 1 : 0)} – {(currentPage-1)*pageSize + paginatedData.length}</span> de <span className="text-conaf-700 font-display">{sortedData.length}</span> registros
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-1.5 rounded-lg border border-conaf-200 hover:bg-white enabled:active:scale-90 transition-all disabled:opacity-30 text-conaf-800 bg-conaf-50/50"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center gap-1 px-3">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
               // Lógica simple para mostrar páginas cercanas
               let pageNum = currentPage;
               if (currentPage <= 3) pageNum = i + 1;
               else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
               else pageNum = currentPage - 2 + i;

               if (pageNum < 1 || pageNum > totalPages) return null;

               return (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all border ${currentPage === pageNum ? 'bg-conaf-700 text-white border-conaf-700 shadow-sm' : 'bg-white hover:bg-conaf-100 text-conaf-800 border-conaf-200'}`}
                  >
                    {pageNum}
                  </button>
               )
            })}
          </div>

          <button 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-1.5 rounded-lg border border-conaf-200 hover:bg-white enabled:active:scale-90 transition-all disabled:opacity-30 text-conaf-800 bg-conaf-50/50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractTable;
