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
    // Normalizar a string para comparar consistentemente
    const optStr = String(opt);
    const isSelected = selected.some(s => String(s) === optStr);

    if (isSelected) {
      onChange(selected.filter(i => String(i) !== optStr));
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

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = String(text).split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() 
            ? <span key={i} className="bg-primary/20 text-primary font-black rounded-sm">{part}</span> 
            : part
        )}
      </span>
    );
  };

  return (
    <div className="border-b border-neutral-100 last:border-0 py-4 group font-body">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-2 py-2 hover:bg-neutral-100 rounded-xl transition-all"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-neutral-900 font-bold text-[10px] uppercase tracking-[0.15em]">{label}</span>
          <span className="text-neutral-400 text-[10px] font-bold leading-none">
            {selected.length === 0 ? 'Todos' : `${selected.length} seleccionados`}
          </span>
        </div>
        <ChevronRight size={14} strokeWidth={2.5} className={`text-neutral-300 transition-all duration-300 ${open ? 'rotate-90 text-primary' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 px-1 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="relative">
            <Search size={14} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
            <input 
              type="text" 
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 px-1">
            <button 
              onClick={handleSelectAll}
              className={`flex items-center gap-2 text-[10px] font-black uppercase transition-colors ${isAllSelected ? 'text-primary' : 'text-neutral-400 hover:text-primary'}`}
            >
              <div className={`w-4 h-4 rounded-md flex items-center justify-center border-2 transition-all ${isAllSelected ? 'bg-primary border-primary text-white' : 'bg-white border-neutral-300'}`}>
                {isAllSelected && <Check size={10} strokeWidth={4} />}
                {isSomeSelected && <Minus size={10} strokeWidth={4} />}
              </div>
              Todo
            </button>
            <span className="text-neutral-200">|</span>
            <button 
              onClick={() => onChange([])}
              className="text-[10px] font-black uppercase text-neutral-400 hover:text-error transition-colors"
            >
              Limpiar
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <p className="text-[10px] text-center text-neutral-400 py-6 italic font-bold">Sin coincidencias</p>
            ) : (
              filteredOptions.map((opt) => {
                const optStr = String(opt);
                const isSelected = selected.some(s => String(s) === optStr);
                
                return (
                  <label 
                    key={optStr} 
                    onClick={() => toggleOption(opt)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border-l-4 ${isSelected ? 'bg-primary/10 border-primary font-bold text-neutral-900 shadow-soft' : 'border-transparent text-neutral-700 hover:bg-neutral-50'}`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all ${isSelected ? 'bg-primary border-primary text-white' : 'bg-white border-neutral-300'}`}>
                      {isSelected && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span className="text-[11px] font-bold leading-tight select-none flex-1 truncate">
                      {highlightText(optStr, search)}
                    </span>
                  </label>
                );
              })
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
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[70] transition-all"
        />
      )}

      <aside 
        className={`
          flex flex-col bg-white border-r border-neutral-200 shadow-xl z-[80] transition-all duration-300 h-full
          ${isOpen ? 'w-full max-w-[300px] translate-x-0' : 'w-0 -translate-x-full fixed md:relative'}
          fixed md:relative overflow-hidden
        `}
      >
        <div className="h-14 bg-neutral-50 flex items-center justify-between px-5 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-2.5 text-neutral-900">
            <Filter size={18} strokeWidth={2.5} className="text-primary" />
            <h2 className="font-bold text-xs uppercase tracking-wider">Filtros Avanzados</h2>
          </div>
          <button onClick={toggleSidebar} className="md:hidden p-1 hover:bg-neutral-200 rounded text-neutral-500">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
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
            options={["Hombre", "Mujer", "Sin determinar"]} 
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

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 shrink-0">
          <button 
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-700 text-xs font-bold hover:bg-neutral-100 hover:border-neutral-400 active:bg-neutral-200 transition-all shadow-sm"
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
