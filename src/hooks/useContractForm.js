import { useState, useEffect, useMemo } from 'react';

/**
 * Hook para manejar el estado del formulario de edición de contrato
 * Usa los campos normalizados del Empleado (.cargo, .contratoTipo, .bruta, etc.)
 */
export function useContractForm(employee) {
  const [formData, setFormData] = useState({});
  const [signer, setSigner] = useState({ 
    name: 'Representante Regional', 
    role: 'Director Regional', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [hasSignature, setHasSignature] = useState(false);

  // Inicializar o resetear el formulario cuando cambia el funcionario seleccionado
  // Senior Fix: También reseteamos el firmante a valores por defecto para evitar fugas de datos
  useEffect(() => {
    if (employee) {
      setFormData({ ...employee });
      setHasSignature(false);
      
      // Reseteamos el firmante a los valores por defecto (o podrías leer de localStorage si fuera persistente)
      setSigner({
        name: 'Representante Regional',
        role: 'Director Regional',
        date: new Date().toISOString().split('T')[0]
      });
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
      // Ignorar campos de estado o metadatos que no son del formulario
      const skip = ['id', 'estadoAuditoria', 'extra', 'activo'];
      if (skip.includes(key)) return false;
      return String(formData[key] || '') !== String(employee[key] || '');
    });
  }, [employee, formData]);

  const resetForm = () => {
    if (employee) {
      setFormData({ ...employee });
      setHasSignature(false);
      setSigner({
        name: 'Representante Regional',
        role: 'Director Regional',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  /**
   * Validación mínima para habilitar generación de contrato
   */
  const isValid = useMemo(() => {
    return (
      String(signer.name || '').trim().length > 0 && 
      String(signer.role || '').trim().length > 0 &&
      String(formData.cargo || '').trim().length > 0 &&
      String(formData.contratoTipo || '').trim().length > 0
    );
  }, [signer, formData]);

  return {
    formData,
    handleChange,
    signer,
    handleSignerChange,
    changedFields,
    resetForm,
    isValid,
    setHasSignature,
    isDirty: changedFields.length > 0
  };
}
