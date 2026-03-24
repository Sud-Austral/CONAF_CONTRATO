import { MES_ORDER } from "./dataParser";
import { truncate } from "./formatters";

/**
 * Retorna las métricas clave (KPIs)
 */
export function getKpis(rows) {
  if (rows.length === 0) {
    return {
      dotacionTotal: 0,
      brutaPromedio: 0,
      liquidaPromedio: 0,
      contratoMasFrecuente: "—",
      pctContrato: 0,
      gastoTotalMes: 0,
      pctMujeres: 0,
      avgAntiguedad: 0
    };
  }

  // Dotación total por RUTs únicos
  const dotacionTotal = new Set(rows.map(r => r.rut)).size;

  // Remuneración bruta y líquida promedio (excluyendo nulls)
  const brutaRows = rows.filter(r => r.remuneracionbruta_mensual !== null);
  const liquidaRows = rows.filter(r => r.remuliquida_mensual !== null);

  const brutaTotal = brutaRows.reduce((acc, curr) => acc + curr.remuneracionbruta_mensual, 0);
  const liquidaTotal = liquidaRows.reduce((acc, curr) => acc + curr.remuliquida_mensual, 0);

  const brutaPromedio = brutaRows.length > 0 ? brutaTotal / brutaRows.length : 0;
  const liquidaPromedio = liquidaRows.length > 0 ? liquidaTotal / liquidaRows.length : 0;

  // Contrato más frecuente
  const contratoCounts = {};
  rows.forEach(r => {
    contratoCounts[r.tipo_de_contrato] = (contratoCounts[r.tipo_de_contrato] || 0) + 1;
  });

  const sortedContratos = Object.entries(contratoCounts).sort((a, b) => b[1] - a[1]);
  const [contratoMasFrecuente, count] = sortedContratos[0] || ["—", 0];
  const pctContrato = rows.length > 0 ? (count / rows.length) * 100 : 0;

  // Gasto mensual (del último periodo en las filas filtradas)
  const sorted = [...rows].sort((a, b) => {
    if (a.anyo !== b.anyo) return b.anyo - a.anyo;
    return (b.mesNum || 0) - (a.mesNum || 0);
  });
  const latest = sorted[0];
  const latestRows = rows.filter(r => r.anyo === latest.anyo && r.mesNum === latest.mesNum);
  const gastoTotalMes = latestRows.reduce((acc, curr) => acc + (curr.remuneracionbruta_mensual || 0), 0);

  // Porcentaje Mujeres (sobre total de RUTs únicos en la selección)
  const rutsUnicos = new Map();
  rows.forEach(r => {
    if (!rutsUnicos.has(r.rut)) rutsUnicos.set(r.rut, r.sexo);
  });
  const totalRuts = rutsUnicos.size;
  const mujeresCount = Array.from(rutsUnicos.values()).filter(s => s === "Mujer").length;
  const pctMujeres = totalRuts > 0 ? (mujeresCount / totalRuts) * 100 : 0;

  // Gasto por persona (del último periodo en las filas filtradas)
  const gastoPorPersona = latestRows.length > 0 ? gastoTotalMes / latestRows.length : 0;

  return {
    dotacionTotal,
    brutaPromedio,
    liquidaPromedio,
    contratoMasFrecuente,
    pctContrato: Math.round(pctContrato),
    gastoTotalMes,
    pctMujeres: Math.round(pctMujeres),
    gastoPorPersona
  };
}

/**
 * Retorna la dotación agremiada por tipo de contrato
 */
export function getDotacionPorContrato(rows) {
  const counts = {};
  rows.forEach(r => {
    counts[r.tipo_de_contrato] = (counts[r.tipo_de_contrato] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Retorna la evolución temporal de la dotación por tipo de contrato
 */
export function getEvolucionDotacion(rows) {
  const periodos = {};
  
  rows.forEach(r => {
    const key = `${r.anyo}-${r.mesNum}`;
    if (!periodos[key]) {
      periodos[key] = { label: `${r.mes?.slice(0,3)} ${r.anyo}`, anyo: r.anyo, mesNum: r.mesNum };
    }
    periodos[key][r.tipo_de_contrato] = (periodos[key][r.tipo_de_contrato] || 0) + 1;
  });

  // Identificar los 5 contratos más comunes para consolidar el resto en "Otros"
  const totalCounts = {};
  rows.forEach(r => {
    totalCounts[r.tipo_de_contrato] = (totalCounts[r.tipo_de_contrato] || 0) + 1;
  });
  const top5Contratos = Object.entries(totalCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  const sortedPeriodos = Object.values(periodos).sort((a, b) => {
    if (a.anyo !== b.anyo) return a.anyo - b.anyo;
    return a.mesNum - b.mesNum;
  });

  return sortedPeriodos.map(periodo => {
    const result = { periodo: periodo.label };
    let otros = 0;
    
    Object.keys(periodo).forEach(k => {
      if (k === 'label' || k === 'anyo' || k === 'mesNum') return;
      if (top5Contratos.includes(k)) {
        result[k] = periodo[k];
      } else {
        otros += periodo[k];
      }
    });

    if (otros > 0) result["Otros"] = otros;
    return result;
  });
}

/**
 * Retorna la distribución por sexo
 */
export function getDistribucionSexo(rows) {
  const counts = { "Hombre": 0, "Mujer": 0, "Sin determinar": 0 };
  rows.forEach(r => {
    const sex = r.sexo || "Sin determinar";
    counts[sex] = (counts[sex] || 0) + 1;
  });

  return Object.entries(counts)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));
}

/**
 * Retorna la distribución por tramos de edad y sexo
 */
export function getDistribucionEdad(rows) {
  const counts = {};
  rows.forEach(r => {
    const tramo = r.age_label || "S/I";
    if (!counts[tramo]) counts[tramo] = { age_label: tramo, Hombre: 0, Mujer: 0 };
    if (r.sexo === "Hombre") counts[tramo].Hombre++;
    else if (r.sexo === "Mujer") counts[tramo].Mujer++;
  });

  return Object.values(counts).sort((a, b) => a.age_label.localeCompare(b.age_label));
}

/**
 * Retorna la evolución temporal de la remuneración promedio
 */
export function getEvolucionRemuneracion(rows) {
  const periodos = {};
  rows.forEach(r => {
    if (r.remuneracionbruta_mensual === null) return;
    const key = `${r.anyo}-${r.mesNum}`;
    if (!periodos[key]) {
      periodos[key] = { label: `${r.mes?.slice(0,3)} ${r.anyo}`, anyo: r.anyo, mesNum: r.mesNum, sum: 0, count: 0 };
    }
    periodos[key].sum += r.remuneracionbruta_mensual;
    periodos[key].count += 1;
  });

  return Object.values(periodos)
    .sort((a, b) => {
      if (a.anyo !== b.anyo) return a.anyo - b.anyo;
      return a.mesNum - b.mesNum;
    })
    .map(p => ({
      periodo: p.label,
      promedio: p.sum / p.count
    }));
}

/**
 * Retorna información detallada del periodo más reciente
 */
export function getLatestPeriodInfo(rows) {
  if (rows.length === 0) return null;

  // Encontrar el periodo más reciente
  const sorted = [...rows].sort((a, b) => {
    if (a.anyo !== b.anyo) return b.anyo - a.anyo;
    return (b.mesNum || 0) - (a.mesNum || 0);
  });

  const latest = sorted[0];
  const latestRows = rows.filter(r => r.anyo === latest.anyo && (r.mesNum || 0) === (latest.mesNum || 0));

  // Top 10 remuneraciones de ese periodo
  const top10Brutas = [...latestRows]
    .filter(r => r.remuneracionbruta_mensual !== null)
    .sort((a, b) => b.remuneracionbruta_mensual - a.remuneracionbruta_mensual)
    .slice(0, 10)
    .map(r => ({
      nombre: r.nombrecompleto_x,
      cargo: truncate(r.tipo_cargo, 30),
      bruta: r.remuneracionbruta_mensual,
      contrato: r.tipo_de_contrato
    }));

  // Gasto total del periodo
  const gastoTotal = latestRows.reduce((acc, curr) => acc + (curr.remuneracionbruta_mensual || 0), 0);

  // Sexo del periodo
  const sexCounts = { Hombre: 0, Mujer: 0, "Sin determinar": 0 };
  latestRows.forEach(r => sexCounts[r.sexo || "Sin determinar"]++);

  return {
    label: `${latest.mes} ${latest.anyo}`,
    mes: latest.mes,
    anyo: latest.anyo,
    dotacion: latestRows.length,
    gastoTotal,
    top10Brutas,
    sexDist: Object.entries(sexCounts).map(([name, value]) => ({ name, value }))
  };
}

/**
 * Retorna el top N de cargos
 */
export function getTopCargos(rows, n = 10) {
  const counts = {};
  rows.forEach(r => {
    const cargo = r.tipo_cargo || "S/I";
    counts[cargo] = (counts[cargo] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([cargo, count]) => ({ cargo: truncate(cargo, 35), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}
