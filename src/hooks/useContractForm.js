import { useState, useEffect, useMemo } from 'react';

/**
 * Hook para manejar el estado del formulario de edición de contrato
 * @param {Object|null} employee - Los datos originales del funcionario
 * @returns {Object} Estado y manejadores del formulario
 */
export function useContractForm(employee) {
  const [formData, setFormData] = useState({});
  const [signer, setSigner] = useState({ name: '', role: '', date: new Date().toISOString().split('T')[0] });
  const [hasSignature, setHasSignature] = useState(false);

  // Inicializar o resetear el formulario cuando cambia el funcionario seleccionado
  useEffect(() => {
    if (employee) {
      setFormData({ ...employee });
      setHasSignature(false);
    }
  }, [employee]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignerChange = (field, value) => {
    setSigner(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Determina qué campos han sido modificados respecto al original
   */
  const changedFields = useMemo(() => {
    if (!employee) return [];
    return Object.keys(formData).filter(key => {
      // Comparar como strings para evitar problemas de tipos (ej: "2023" vs 2023)
      return String(formData[key]) !== String(employee[key]);
    });
  }, [employee, formData]);

  const resetForm = () => {
    if (employee) {
      setFormData({ ...employee });
      setHasSignature(false);
    }
  };

  /**
   * Validación mínima para habilitar descarga de PDF
   */
  const isValid = useMemo(() => {
    return (
      hasSignature && 
      signer.name.trim().length > 0 && 
      signer.role.trim().length > 0 &&
      formData.tipo_cargo?.trim().length > 0 &&
      formData.tipo_de_contrato?.trim().length > 0
    );
  }, [hasSignature, signer, formData]);

  return {
    formData,
    handleChange,
    signer,
    handleSignerChange,
    changedFields,
    resetForm,
    isValid,
    setHasSignature
  };
}
