import React from 'react';
import { Filter, X, RotateCcw, Search, ChevronRight, Check, Minus } from 'lucide-react';
import { useConafData } from '../../context/DataContext';

const FilterGroup = ({ label, options, selected, onChange, placeholder = "Buscar..." }) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filteredOptions = options.filter(opt => 
    String(opt).toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(i => i !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const isAllSelected = selected.length === options.length && options.length > 0;
  const isSomeSelected = selected.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) onChange([]);
    else onChange(options);
  };

  return (
    <div className="border-b border-conaf-100 last:border-0 py-3 group">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-2 py-2 hover:bg-white rounded-lg transition-all"
      >
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-conaf-900 font-bold text-[11px] uppercase tracking-widest">{label}</span>
          <span className="text-text-muted text-[11px] font-medium leading-none">
            {selected.length === 0 ? 'Todos' : `${selected.length} seleccionados`}
          </span>
        </div>
        <ChevronRight size={14} className={`text-conaf-400 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 px-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-conaf-400" />
            <input 
              type="text" 
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-conaf-50/50 border border-conaf-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-conaf-400 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 px-1">
            <button 
              onClick={handleSelectAll}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors ${isAllSelected ? 'text-conaf-600' : 'text-gray-400 hover:text-conaf-500'}`}
            >
              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isAllSelected ? 'bg-conaf-500 border-conaf-500 text-white' : 'bg-white border-gray-300'}`}>
                {isAllSelected && <Check size={10} strokeWidth={3} />}
                {isSomeSelected && <Minus size={10} strokeWidth={3} />}
              </div>
              {isAllSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => onChange([])}
              className="text-[10px] font-bold uppercase text-gray-400 hover:text-conaf-500 transition-colors"
            >
              Limpiar
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-0.5 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <p className="text-[10px] text-center text-gray-400 py-2 italic font-medium">Sin coincidencias</p>
            ) : (
              filteredOptions.map((opt) => (
                <label 
                  key={opt} 
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer group transition-all ${selected.includes(opt) ? 'bg-conaf-100/50 font-bold text-conaf-800' : 'hover:bg-conaf-50 text-text-muted'}`}
                >
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${selected.includes(opt) ? 'bg-conaf-600 border-conaf-600 text-white' : 'bg-white border-gray-300 group-hover:border-conaf-300'}`}>
                    {selected.includes(opt) && <Check size={10} strokeWidth={3} />}
                  </div>
                  <span className="text-[11px] leading-tight select-none flex-1 truncate">{opt}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSidebar = ({ filters, setFilter, resetFilters, isOpen, setIsOpen }) => {
  const { uniqueValues } = useConafData();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón de apertura lateral cuando el sidebar está cerrado (mobile/tablet) */}
      {!isOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed left-0 top-20 bg-conaf-800 text-white p-2.5 rounded-r-xl shadow-lg z-[60] active:scale-95 transition-all md:flex hidden"
        >
          <Filter size={20} />
        </button>
      )}

      {/* Backdrop para mobile */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 bg-conaf-900/40 backdrop-blur-sm z-[70] transition-all animate-in fade-in"
        />
      )}

      <aside 
        className={`
          flex flex-col bg-white border-r border-conaf-100 shadow-xl z-[80] transition-all duration-300 ease-in-out h-full
          ${isOpen ? 'w-full max-w-[280px] translate-x-0' : 'w-0 -translate-x-full fixed md:relative'}
          fixed md:relative overflow-hidden
        `}
      >
        <div className="h-14 bg-conaf-50 flex items-center justify-between px-5 border-b border-conaf-200 shrink-0">
          <div className="flex items-center gap-2.5 text-conaf-800">
            <Filter size={18} strokeWidth={2.5} />
            <h2 className="font-bold font-display text-sm tracking-tight">Filtros Avanzados</h2>
          </div>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1.5 hover:bg-conaf-100 rounded-lg text-conaf-600 transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thumb-conaf-100 scrollbar-track-transparent">
          <FilterGroup 
            label="Período: Año" 
            options={uniqueValues.anyos} 
            selected={filters.anyos} 
            onChange={(val) => setFilter('anyos', val)} 
          />
          <FilterGroup 
            label="Período: Mes" 
            options={uniqueValues.meses} 
            selected={filters.meses} 
            onChange={(val) => setFilter('meses', val)} 
          />
          <FilterGroup 
            label="Tipo de Cargo" 
            options={uniqueValues.tipoCargo} 
            selected={filters.tipoCargo} 
            onChange={(val) => setFilter('tipoCargo', val)} 
            placeholder="Ej: Guardaparque..."
          />
          <FilterGroup 
            label="Tipo de Contrato" 
            options={uniqueValues.tipoContrato} 
            selected={filters.tipoContrato} 
            onChange={(val) => setFilter('tipoContrato', val)} 
          />
          <FilterGroup 
            label="Género" 
            options={["M", "F"]} 
            selected={filters.sexo} 
            onChange={(val) => setFilter('sexo', val)} 
          />
          <FilterGroup 
            label="Tramo Etario" 
            options={uniqueValues.ageLabels} 
            selected={filters.ageLabels} 
            onChange={(val) => setFilter('ageLabels', val)} 
          />
        </div>

        <div className="p-4 bg-conaf-50 border-t border-conaf-200 shrink-0">
          <button 
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-conaf-300 rounded-xl text-conaf-700 text-xs font-bold hover:bg-conaf-100 hover:border-conaf-400 active:bg-conaf-200 transition-all shadow-sm"
          >
            <RotateCcw size={14} />
            Restablecer Filtros
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
