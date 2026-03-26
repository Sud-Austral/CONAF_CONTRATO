/**
 * Centralización de Campos (Source of Truth)
 * Este archivo mapea los nombres de variables del Backend a los del Frontend.
 * Si el API cambia de nombre una columna, solo cámbiala aquí.
 */

// --- Mapeo de Empleado ---
export const EMPLEADO_FIELDS = {
    ID: 'id',
    RUT: 'rut',
    NOMBRE: 'nombre_completo',
    ORGANISMO: 'organismo_nombre',
    CARGO: 'tipo_cargo',
    BRUTA: 'remuneracion_bruta_mensual',
    TIPO_CONTRATO: 'tipo_de_contrato',
    FECHA_INICIO: 'fecha_inicio',
    ACTIVO: 'activo',
    DATOS_EXTRA: 'datos_adicionales',
    ESTADO_AUDITORIA: 'ultimo_estado_contrato'
};

// --- Mapeo de Contrato ---
export const CONTRATO_FIELDS = {
    ID: 'id',
    CODIGO: 'codigo_unico',
    ESTADO: 'estado',
    TEMPLATE: 'template_id',
    EMPLEADO_ID: 'empleado_id',
    DATOS_FORM: 'datos_formulario',
    PDF_GEN: 'pdf_generado_path',
    PDF_SCAN: 'pdf_escaneado_path',
    FECHA_CREACION: 'created_at',
    // Campos enriquecidos (vienen del join con empleado)
    EMP_NOMBRE: 'empleado_nombre',
    EMP_RUT: 'rut',
    EMP_CARGO: 'tipo_cargo'
};

/**
 * Normaliza un objeto Empleado del API para los componentes de React.
 */
export function normalizeEmpleado(raw) {
    if (!raw) return null;
    return {
        id: raw[EMPLEADO_FIELDS.ID],
        rut: raw[EMPLEADO_FIELDS.RUT],
        nombre: raw[EMPLEADO_FIELDS.NOMBRE],
        organismo: raw[EMPLEADO_FIELDS.ORGANISMO],
        cargo: raw[EMPLEADO_FIELDS.CARGO],
        bruta: Number(raw[EMPLEADO_FIELDS.BRUTA] || 0),
        contratoTipo: raw[EMPLEADO_FIELDS.TIPO_CONTRATO],
        fechaInicio: raw[EMPLEADO_FIELDS.FECHA_INICIO],
        activo: raw[EMPLEADO_FIELDS.ACTIVO],
        extra: raw[EMPLEADO_FIELDS.DATOS_EXTRA] || {},
        estadoAuditoria: raw[EMPLEADO_FIELDS.ESTADO_AUDITORIA]
    };
}

/**
 * Normaliza un objeto Contrato del API.
 */
export function normalizeContrato(raw) {
    if (!raw) return null;
    return {
        id: raw[CONTRATO_FIELDS.ID],
        codigo: raw[CONTRATO_FIELDS.CODIGO],
        estado: raw[CONTRATO_FIELDS.ESTADO],
        template: raw[CONTRATO_FIELDS.TEMPLATE],
        empleadoId: raw[CONTRATO_FIELDS.EMPLEADO_ID],
        datos: raw[CONTRATO_FIELDS.DATOS_FORM] || {},
        hasPdf: !!raw[CONTRATO_FIELDS.PDF_GEN],
        hasScan: !!raw[CONTRATO_FIELDS.PDF_SCAN],
        fecha: raw[CONTRATO_FIELDS.FECHA_CREACION],
        // Campos enriquecidos
        empleadoNombre: raw[CONTRATO_FIELDS.EMP_NOMBRE],
        rut: raw[CONTRATO_FIELDS.EMP_RUT],
        cargo: raw[CONTRATO_FIELDS.EMP_CARGO]
    };
}
