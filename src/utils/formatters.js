/**
 * Formato moneda chilena (CLP)
 */
export const fmtCLP = (n) => {
  // La API devuelve remuneracion_bruta_mensual como string
  const num = typeof n === 'string' ? parseFloat(n) : n;
  if (num === null || num === undefined || isNaN(num)) return '—';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Formato corto para ejes de gráficos (ej: 1.2M, 850K)
 */
export const fmtCLPShort = (n) => {
  if (n === null || n === undefined || isNaN(n)) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString('es-CL');
};

/**
 * Formatea RUT chileno con guión
 */
export const fmtRut = (rutRaw) => {
  if (!rutRaw) return '—';
  let rut = String(rutRaw).replace(/[\.-]/g, '');
  if (rut.length < 2) return rut;
  const dv = rut.slice(-1);
  const cuerpo = rut.slice(0, -1);
  return `${cuerpo}-${dv}`;
};

/**
 * Parsea fechas en formatos variados y las retorna en DD/MM/YYYY
 */
export const fmtFecha = (raw) => {
  if (!raw) return '—';
  
  // Si es timestamp numérico o string numérico
  if (!isNaN(raw) && !isNaN(parseFloat(raw))) {
    const date = new Date(parseInt(raw, 10));
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Si es string DD/MM/YYYY
  if (typeof raw === 'string' && raw.includes('/')) {
    return raw;
  }

  // Si es ISO o similar
  const date = new Date(raw);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  return raw;
};

/**
 * Retorna fecha en formato ISO (YYYY-MM-DD) para inputs type="date"
 */
export const fmtFechaISO = (raw) => {
  if (!raw) return '';
  let date;
  if (!isNaN(raw) && !isNaN(parseFloat(raw))) {
    date = new Date(parseInt(raw, 10));
  } else if (typeof raw === 'string' && raw.includes('/')) {
    const [d, m, y] = raw.split('/');
    date = new Date(`${y}-${m}-${d}`);
  } else {
    date = new Date(raw);
  }

  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

/**
 * Trunca strings largos con puntos suspensivos
 */
export const truncate = (str, n = 35) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
};
