import { truncate } from "./formatters";

/**
 * Retorna las métricas clave (KPIs) para la dotación ACTUAL.
 * Acepta empleados NORMALIZADOS por el DataContext.
 */
export function getKpis(rows) {
  if (!rows || rows.length === 0) {
    return {
      dotacionTotal: 0,
      brutaPromedio: 0,
      gastoTotalMes: 0,
      contratoMasFrecuente: "—",
      pctContrato: 0,
      pctActivos: 0,
      cargosUnicos: 0
    };
  }

  // 1. Dotación total (filas recibidas)
  const dotacionTotal = rows.length;

  // 2. Remuneración bruta promedio (usando .bruta normalizada)
  const brutaRows = rows.filter(r => r.bruta > 0);
  const brutaTotal = brutaRows.reduce((acc, curr) => acc + Number(curr.bruta || 0), 0);
  const brutaPromedio = brutaRows.length > 0 ? brutaTotal / brutaRows.length : 0;
  
  // 3. Gasto Total Mensual
  const gastoTotalMes = brutaTotal;

  // 4. Modalidad de contrato más frecuente (usando .contratoTipo normalizado)
  const contratoCounts = {};
  rows.forEach(r => {
    const tipo = r.contratoTipo || "Sin especificar";
    contratoCounts[tipo] = (contratoCounts[tipo] || 0) + 1;
  });
  const sortedContratos = Object.entries(contratoCounts).sort((a, b) => b[1] - a[1]);
  const [contratoMasFrecuente, count] = sortedContratos[0] || ["—", 0];
  const pctContrato = (count / rows.length) * 100;

  // 5. Funcionarios Activos (usando .activo normalizado)
  const activosCount = rows.filter(r => r.activo).length;
  const pctActivos = (activosCount / rows.length) * 100;

  // 6. Diversidad de Cargos (usando .cargo normalizado)
  const cargosUnicos = new Set(rows.map(r => r.cargo)).size;

  return {
    dotacionTotal,
    brutaPromedio,
    gastoTotalMes,
    contratoMasFrecuente,
    pctContrato: Math.round(pctContrato),
    pctActivos: Math.round(pctActivos),
    cargosUnicos,
    liquidaPromedio: brutaPromedio * 0.8 // Estimación simple
  };
}

/**
 * Distribución por Estamento / Organismo
 */
export function getDistribucionOrganismo(rows) {
  const counts = {};
  rows.forEach(r => {
    const org = r.organismo || "S/I";
    counts[org] = (counts[org] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

/**
 * Top Cargos por Dotación
 */
export function getTopCargos(rows, n = 8) {
  const counts = {};
  rows.forEach(r => {
    const cargo = r.cargo || "S/I";
    counts[cargo] = (counts[cargo] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([cargo, count]) => ({ cargo: truncate(cargo, 30), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

// Histograma de remuneraciones usando .bruta normalizada
export function getDistribucionRemuneracion(rows) {
  const rangos = [
    { label: '< 1M', min: 0, max: 1000000 },
    { label: '1M - 2M', min: 1000001, max: 2000000 },
    { label: '2M - 3M', min: 2000001, max: 3000000 },
    { label: '3M - 5M', min: 3000001, max: 5000000 },
    { label: '> 5M', min: 5000001, max: Infinity }
  ];

  const dist = rangos.map(r => ({ ...r, value: 0 }));
  
  rows.forEach(r => {
    const monto = Number(r.bruta || 0);
    const range = dist.find(range => monto >= range.min && monto <= range.max);
    if (range) range.value++;
  });

  return dist.map(({ label, value }) => ({ name: label, value }));
}

// Stubs para compatibilidad
export const getLatestPeriodInfo = (rows) => ({ label: "Actual", dotacion: rows.length });
export function getDotacionPorContrato(rows) {
    const counts = {};
    rows.forEach(r => {
      counts[r.contratoTipo || "S/I"] = (counts[r.contratoTipo || "S/I"] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
export const getDistribucionSexo = () => [];
export const getDistribucionEdad = () => [];
export const getEvolucionDotacion = () => [];
export const getEvolucionRemuneracion = () => [];
