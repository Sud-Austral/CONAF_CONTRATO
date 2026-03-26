import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, ScanLine, CheckCircle2,
  AlertTriangle, Eye, Upload, ShieldCheck, Printer,
  User, Search
} from 'lucide-react';
import { contratosService } from '../../services/api';
import { normalizeContrato } from '../../utils/schemaMapping';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ─── Mapa de estilos por estado ─────────────────────────────────────────────
const ESTADO_CONFIG = {
  PENDIENTE:       { label: 'Pendiente',        color: 'bg-warning/10 text-warning border-warning/25',         dot: 'bg-warning' },
  REVISADO:        { label: 'Revisado',          color: 'bg-blue-50 text-blue-600 border-blue-200',             dot: 'bg-blue-500' },
  IMPRESO:         { label: 'Impreso',           color: 'bg-violet-50 text-violet-600 border-violet-200',       dot: 'bg-violet-500' },
  ESPERANDO_FIRMA: { label: 'Esp. Firma',        color: 'bg-orange-50 text-orange-600 border-orange-200',       dot: 'bg-orange-500' },
  COMPLETADO:      { label: 'Completado',        color: 'bg-success/10 text-success border-success/25',         dot: 'bg-success' },
};

const EstadoBadge = ({ estado }) => {
  const cfg = ESTADO_CONFIG[estado] || { label: estado, color: 'bg-neutral-100 text-neutral-500 border-neutral-200', dot: 'bg-neutral-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const ContractRow = (props) => {
  const { contract, onViewPdf, onUploadScan, onOpenContract, onAction } = props;
  
  const createdAt = contract.fecha
    ? format(new Date(contract.fecha), "d MMM yyyy", { locale: es })
    : '—';

  const hasPdfGenerado   = contract.hasPdf;
  const hasPdfEscaneado  = contract.hasScan;
  const isCompletado     = contract.estado === 'COMPLETADO';
  const isEsperandoFirma = contract.estado === 'ESPERANDO_FIRMA';

  return (
    <tr 
      onClick={() => onOpenContract(contract)}
      className="group transition-all duration-200 cursor-pointer hover:bg-primary/[0.04]"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
            <User size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-black text-neutral-900 leading-tight truncate max-w-[180px]">
              {contract.empleadoNombre || '—'}
            </p>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
              {contract.rut || '—'}
              {contract.codigo && (
                <span className="ml-2 text-neutral-300">· {contract.codigo}</span>
              )}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-[11px] font-bold text-neutral-500 italic" title={contract.cargo}>
        <span className="line-clamp-2 max-w-[160px] block">{contract.cargo || '—'}</span>
      </td>

      <td className="px-6 py-4">
        <EstadoBadge estado={contract.estado} />
      </td>

      <td className="px-6 py-4 text-[11px] font-bold text-neutral-500 whitespace-nowrap">
        {createdAt}
      </td>

      <td className="px-6 py-4 text-center">
        {hasPdfGenerado ? (
          <button
            onClick={(e) => { e.stopPropagation(); onViewPdf(contract, 'generado'); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 group/btn"
          >
            <Eye size={12} className="group-hover/btn:scale-110 transition-transform" />
            Ver PDF
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-neutral-300 uppercase tracking-widest">
            <AlertTriangle size={11} />
            Sin PDF
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {contract.estado === 'PENDIENTE' && (
            <button
               onClick={(e) => { e.stopPropagation(); onAction('revisar', contract); }}
               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
            >
              <ShieldCheck size={12} />
              Aprobar
            </button>
          )}

          {contract.estado === 'REVISADO' && (
            <button
               onClick={(e) => { e.stopPropagation(); onAction('imprimir', contract); }}
               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-violet-600 transition-all active:scale-95"
            >
              <Printer size={12} />
              Imprimir
            </button>
          )}

          {contract.estado === 'IMPRESO' && (
            <button
               onClick={(e) => { e.stopPropagation(); onAction('esperando-firma', contract); }}
               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all active:scale-95"
            >
              <CheckCircle2 size={12} />
              Entregar
            </button>
          )}

          {isEsperandoFirma && (
            <label 
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 cursor-pointer group/btn"
            >
              <Upload size={12} className="group-hover/btn:scale-110 transition-transform" />
              Escanear
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) onUploadScan(contract.id, file);
                }}
              />
            </label>
          )}

          {isCompletado && hasPdfEscaneado && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewPdf(contract, 'escaneado'); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/5 border border-success/20 text-success rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all active:scale-95 group/btn"
            >
              <ScanLine size={12} className="group-hover/btn:scale-110 transition-transform" />
              Firmado
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const ContractListTab = ({ estadoFilter, hasPdfOnly = false, onOpenContract }) => {
  const [contracts, setContracts]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState('');
  const [totalCount, setTotalCount]   = useState(0);
  const pageSize = 20;

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: pageSize,
        skip: 0, 
      };
      if (estadoFilter) params.estado = estadoFilter;
      if (search.trim()) params.search = search.trim();
      if (hasPdfOnly) params.has_pdf = true;

      const response = await contratosService.list(params);
      const items = response.items || response;
      const total = response.total || items.length;
      
      setContracts((Array.isArray(items) ? items : []).map(normalizeContrato));
      setTotalCount(total);
    } catch (err) {
      console.error(err);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, [estadoFilter, hasPdfOnly, search]);

  const handleContractAction = async (action, contract) => {
    try {
      if (action === 'revisar') await contratosService.revisar(contract.id);
      if (action === 'imprimir') await contratosService.imprimir(contract.id);
      if (action === 'esperando-firma') await contratosService.marcarEsperandoFirma(contract.id);
      fetchContracts();
    } catch (err) {
      console.error('Error en acción:', err);
    }
  };

  const handleUploadScan = async (id, file) => {
    try {
      await contratosService.uploadScan(id, file);
      fetchContracts();
    } catch (err) {
      alert("Error al subir escaneo");
    }
  };

  const handleViewPdf = (contract, type) => {
    const url = contratosService.getPdfViewUrl(contract.id, type);
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return (
    <div className="flex flex-col h-full bg-slate-50/10">
      
      <div className="px-6 py-4 border-b border-neutral-100 bg-white shrink-0">
          <div className="relative max-w-sm">
            <Search size={16} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
            <input
              type="text"
              placeholder="Filtro de contratos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-primary transition-all"
            />
          </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin relative p-6">
          <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="sticky top-0 z-20">
                  <tr className="bg-primary-dark text-white text-[10px] font-black uppercase tracking-extreme">
                      <th className="px-6 py-4 rounded-l-2xl">Funcionario</th>
                      <th className="px-6 py-4">Cargo</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4 text-center">PDF</th>
                      <th className="px-6 py-4 text-center rounded-r-2xl">Acción</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      </td>
                    </tr>
                  ) : contracts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center text-[10px] font-black uppercase text-neutral-300 tracking-widest">
                        No se encontraron registros
                      </td>
                    </tr>
                  ) : contracts.map(contract => (
                      <ContractRow
                          key={contract.id}
                          contract={contract}
                          onViewPdf={handleViewPdf}
                          onOpenContract={onOpenContract}
                          onAction={handleContractAction}
                          onUploadScan={handleUploadScan}
                      />
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default ContractListTab;
