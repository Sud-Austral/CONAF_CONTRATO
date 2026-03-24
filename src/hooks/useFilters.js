import { useState, useMemo } from 'react';

export function useFilters(rows) {
  const [filters, setFilters] = useState({
    anyos: [],           // [] = todos
    meses: [],           // [] = todos
    tipoCargo: [],
    tipoContrato: [],
    sexo: [],            // [] | ["M"] | ["F"] | ["M","F"]
    ageLabels: []
  });

  const setFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      anyos: [],
      meses: [],
      tipoCargo: [],
      tipoContrato: [],
      sexo: [],
      ageLabels: []
    });
  };

  const filteredRows = useMemo(() => {
    if (!rows) return [];
    
    return rows.filter(row => {
      // Si el array de filtro está vacío, significa "sin restricción"
      const anyoMatch = filters.anyos.length === 0 || filters.anyos.includes(row.anyo);
      const mesMatch = filters.meses.length === 0 || filters.meses.includes(row.mes);
      const cargoMatch = filters.tipoCargo.length === 0 || filters.tipoCargo.includes(row.tipo_cargo);
      const contratoMatch = filters.tipoContrato.length === 0 || filters.tipoContrato.includes(row.tipo_de_contrato);
      const sexoMatch = filters.sexo.length === 0 || filters.sexo.includes(row.sexo);
      const edadMatch = filters.ageLabels.length === 0 || filters.ageLabels.includes(row.age_label);

      return anyoMatch && mesMatch && cargoMatch && contratoMatch && sexoMatch && edadMatch;
    });
  }, [rows, filters]);

  return {
    filters,
    setFilter,
    resetFilters,
    filteredRows
  };
}
