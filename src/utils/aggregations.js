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
      pctContrato: 0
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

  return {
    dotacionTotal,
    brutaPromedio,
    liquidaPromedio,
    contratoMasFrecuente,
    pctContrato: Math.round(pctContrato)
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
  const contratosSet = new Set();
  
  rows.forEach(r => {
    const key = `${r.anyo}-${r.mesNum}`;
    if (!periodos[key]) {
      periodos[key] = { label: `${r.mes.slice(0,3)} ${r.anyo}`, anyo: r.anyo, mesNum: r.mesNum };
    }
    periodos[key][r.tipo_de_contrato] = (periodos[key][r.tipo_de_contrato] || 0) + 1;
    contratosSet.add(r.tipo_de_contrato);
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
  const counts = { "Masculino": 0, "Femenino": 0 };
  rows.forEach(r => {
    if (r.sexo === "M") counts["Masculino"]++;
    else if (r.sexo === "F") counts["Femenino"]++;
  });

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

/**
 * Retorna la distribución por tramos de edad y sexo
 */
export function getDistribucionEdad(rows) {
  const counts = {};
  rows.forEach(r => {
    const tramo = r.age_label || "S/I";
    if (!counts[tramo]) counts[tramo] = { age_label: tramo, M: 0, F: 0 };
    if (r.sexo === "M") counts[tramo].M++;
    else if (r.sexo === "F") counts[tramo].F++;
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
      periodos[key] = { label: `${r.mes.slice(0,3)} ${r.anyo}`, anyo: r.anyo, mesNum: r.mesNum, sum: 0, count: 0 };
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
