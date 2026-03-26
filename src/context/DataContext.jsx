import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { empleadosService, contratosService } from '../services/api';
import { normalizeEmpleado, normalizeContrato } from '../utils/schemaMapping';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [rows, setRows] = useState([]);      // Empleados normalizados
  const [contratos, setContratos] = useState([]); // Contratos normalizados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Carga inicial (Dashboard/Listados)
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [empRes, contRes] = await Promise.all([
        empleadosService.list({ limit: 200, activo: true }),
        contratosService.list({ limit: 200 })
      ]);
      
      // Aplicamos normalización CENTRALIZADA
      setRows((empRes.data || []).map(normalizeEmpleado));
      setTotal(empRes.total || 0);
      setContratos((contRes.items || []).map(normalizeContrato));
      
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("No se pudo conectar con el servidor para obtener métricas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      loadDashboardData();
    }
  }, [loadDashboardData]);

  const value = {
    rows,         // Datos normalizados
    contratos,    // Datos normalizados
    total,        // Total de empleados
    loading,
    error,
    refresh: loadDashboardData,
    // Función de búsqueda también normalizada
    searchEmployees: async (query, proceso = '') => {
      const { data } = await empleadosService.list({ 
        search: query, 
        proceso_contrato: proceso, 
        limit: 100 
      });
      return data.map(normalizeEmpleado);
    }
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useConafData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useConafData must be used within a DataProvider');
  return context;
};
