import pako from "pako";

/**
 * Mapeo de meses en español a su índice correspondiente (1-12)
 */
export const MES_ORDER = {
  "Enero": 1, "Febrero": 2, "Marzo": 3, "Abril": 4, "Mayo": 5, "Junio": 6,
  "Julio": 7, "Agosto": 8, "Septiembre": 9, "Octubre": 10, "Noviembre": 11, "Diciembre": 12
};

/**
 * Detecta y parsea el JSON crudo.
 * @param {any} raw - Los datos en bruto de data.json
 * @returns {Array<Object>} Un array de objetos normalizado
 */
export function parseDataJson(raw) {
  if (Array.isArray(raw)) {
    return raw;
  }

  // Si es un objeto columnar (como lo genera pandas.to_json)
  if (typeof raw === "object" && raw !== null) {
    const keys = Object.keys(raw);
    if (keys.length === 0) return [];

    // Tomamos la primera clave para saber cuántas filas hay
    const recordKeys = Object.keys(raw[keys[0]]);
    return recordKeys.map((idx) => {
      const obj = {};
      keys.forEach((k) => {
        obj[k] = raw[k][idx];
      });
      return obj;
    });
  }

  throw new Error("Formato de datos no soportado. Debe ser un array de objetos o un objeto columnar.");
}

/**
 * Enriquece cada fila con campos adicionales necesarios
 * @param {Array<Object>} rows - Las filas normalizadas
 * @returns {Array<Object>} Filas enriquecidas
 */
export function enrichRows(rows) {
  return rows.map((row) => ({
    ...row,
    mesNum: MES_ORDER[row.mes] || 0,
    anyo: parseInt(row.anyo, 10),
    // Aseguramos que los campos de remuneración sean numéricos y manejamos nulos
    remuneracionbruta_mensual: row.remuneracionbruta_mensual ? parseFloat(row.remuneracionbruta_mensual) : null,
    remuliquida_mensual: row.remuliquida_mensual ? parseFloat(row.remuliquida_mensual) : null,
    base: row.base ? parseFloat(row.base) : null,
  }));
}

/**
 * Fetch and decompress data.json.gz
 */
export async function fetchData() {
  const res = await fetch("/data.json.gz");
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  
  const buffer = await res.arrayBuffer();
  try {
    const decompressed = pako.inflate(new Uint8Array(buffer), { to: "string" });
    const rawData = JSON.parse(decompressed);
    const parsed = parseDataJson(rawData);
    return enrichRows(parsed);
  } catch (error) {
    console.error("Error descomprimiendo o parseando datos:", error);
    throw error;
  }
}
