import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchData, MES_ORDER } from '../utils/dataParser';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const data = await fetchData();
        setRows(data);
        setError(null);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError(err.message || "No se pudieron cargar los datos de personal.");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const uniqueValues = useMemo(() => {
    if (rows.length === 0) return { anyos: [], meses: [], tipoCargo: [], tipoContrato: [], ageLabels: [] };

    const anyos = [...new Set(rows.map(r => r.anyo))].sort((a, b) => b - a);
    const mesesRaw = [...new Set(rows.map(r => r.mes))];
    const meses = mesesRaw.sort((a, b) => (MES_ORDER[a] || 0) - (MES_ORDER[b] || 0));
    const tipoCargo = [...new Set(rows.map(r => r.tipo_cargo))].sort();
    const tipoContrato = [...new Set(rows.map(r => r.tipo_de_contrato))].sort();
    const ageLabels = [...new Set(rows.map(r => r.age_label).filter(Boolean))].sort();

    return { anyos, meses, tipoCargo, tipoContrato, ageLabels };
  }, [rows]);

  const value = {
    rows,
    loading,
    error,
    uniqueValues,
    retry: () => fetchData().then(setRows).catch(err => setError(err.message))
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useConafData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useConafData must be used within a DataProvider');
  }
  return context;
};
