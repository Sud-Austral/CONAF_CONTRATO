/**
 * Definición de campos del contrato para fines de labels y tipos
 */
export const CONTRACT_FIELDS = [
  { key: 'organismo_nombre', label: 'Organismo', editable: true, type: 'text' },
  { key: 'anyo', label: 'Año', editable: true, type: 'number' },
  { key: 'mes', label: 'Mes', editable: true, type: 'select' },
  { key: 'tipo_cargo', label: 'Cargo / Función', editable: true, type: 'text' },
  { key: 'tipo_de_contrato', label: 'Tipo de Contrato', editable: true, type: 'select' },
  { key: 'tipo_pago', label: 'Tipo de Pago', editable: true, type: 'text' },
  { key: 'fecha_ingreso', label: 'Fecha de Ingreso', editable: true, type: 'date' },
  { key: 'fecha_termino', label: 'Fecha de Término', editable: true, type: 'date' },
  { key: 'remuneracionbruta_mensual', label: 'Rem. Bruta', editable: true, type: 'currency' },
  { key: 'remuliquida_mensual', label: 'Rem. Líquida', editable: true, type: 'currency' },
  { key: 'base', label: 'Sueldo Base', editable: true, type: 'currency' },
];

export const READONLY_FIELDS = [
  { key: 'rut', label: 'RUT' },
  { key: 'nombrecompleto_x', label: 'Nombre' },
  { key: 'sexo', label: 'Sexo' },
  { key: 'age_label', label: 'Tramo Etario' },
];
