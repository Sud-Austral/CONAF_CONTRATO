import { jsPDF } from "jspdf";
import { fmtCLP, fmtFecha } from "./formatters";

/**
 * Genera el archivo PDF del contrato oficial siguiendo la estructura legal chilena
 */
export async function generateContractPdf({ 
  employee, 
  formData, 
  signaturePayload, 
  signerName, 
  signerRole, 
  signDate,
  isPreview = false 
}) {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "letter", 
  });

  const primary_color = "#1B5E20"; // Verde institucional
  const text_color = "#1A1A1A"; 
  const page_width = doc.internal.pageSize.getWidth();
  const margin = 25;
  const content_width = page_width - (margin * 2);
  let currentY = 25;

  // Helpers de formato
  const addText = (text, size = 10, font = "helvetica", style = "normal", align = "left", color = text_color) => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const splitText = doc.splitTextToSize(text, content_width);
    doc.text(splitText, align === "center" ? page_width / 2 : margin, currentY, { align });
    currentY += (splitText.length * (size * 0.5)) + 4;
  };

  const addTitle = (text) => {
    currentY += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(primary_color);
    doc.text(text, margin, currentY);
    currentY += 8;
  };

  // Watermark para Borrador
  if (isPreview) {
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.text("BORRADOR", page_width / 2, 140, { align: "center", angle: 45 });
  }

  // HEADER INSTITUCIONAL
  doc.setDrawColor(primary_color);
  doc.setLineWidth(0.8);
  doc.line(margin, 15, page_width - margin, 15);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(primary_color);
  doc.text("CONTRATO DE TRABAJO", page_width / 2, 22, { align: "center" });
  currentY = 35;

  // INTRODUCCIÓN
  const ciudad = employee.organismo_nombre?.split(' ')[0] || "Santiago";
  const fechaHoy = new Date().toLocaleDateString('es-CL');
  
  addText(`En ${ciudad}, a ${fechaHoy}, entre:`, 10);
  
  const introEmpresa = `CORPORACIÓN NACIONAL FORESTAL (CONAF), RUT 61.300.200-K, representada por don/doña ${signerName || '___________________________'}, en adelante el "Empleador";`;
  addText(introEmpresa, 10, "helvetica", "bold");

  addText("y", 10, "helvetica", "normal", "center");

  const introTrabajador = `${employee.nombrecompleto_x}, cédula de identidad N° ${employee.rut}, domiciliado en Domicilio Registrado, en adelante el "Trabajador";`;
  addText(introTrabajador, 10, "helvetica", "bold");

  addText("se ha convenido el siguiente contrato de trabajo:", 10);

  // CLÁUSULAS
  addTitle("PRIMERO: NATURALEZA DE LOS SERVICIOS");
  addText(`El Trabajador se obliga a prestar servicios como ${formData.tipo_cargo || employee.tipo_cargo}, realizando las funciones propias del cargo, así como aquellas que le encomiende el Empleador relacionadas con su labor institucional en el departamento de ${employee.organismo_nombre || 'CONAF'}.`, 10);

  addTitle("SEGUNDO: JORNADA DE TRABAJO");
  addText(`La jornada ordinaria de trabajo será de 42 horas semanales, distribuidas de la siguiente forma:`, 10);
  addText(`• Lunes a Jueves: 09:00 a 18:00 horas (1 h colación).`, 9);
  addText(`• Viernes: 09:00 a 17:00 horas (1 h colación).`, 9);
  addText(`El tiempo destinado a colación no se considerará trabajado.`, 9);

  addTitle("TERCERO: REMUNERACIÓN");
  addText(`El Empleador pagará al Trabajador una remuneración mensual de:`, 10);
  addText(`• Sueldo Base: ${fmtCLP(formData.base || (formData.remuneracionbruta_mensual * 0.7))}`, 10, "helvetica", "bold");
  addText(`• Remuneración Bruta Total: ${fmtCLP(formData.remuneracionbruta_mensual)}`, 10, "helvetica", "bold");
  addText(`Las remuneraciones se pagarán dentro de los primeros 5 días hábiles del mes siguiente al trabajado mediante transferencia bancaria.`, 9);

  addTitle("CUARTO: DESCUENTOS LEGALES");
  addText(`De la remuneración se efectuarán los descuentos legales correspondientes a cotizaciones previsionales (AFP), salud (FONASA/ISAPRE), seguro de cesantía e impuestos de segunda categoría si corresponde.`, 9);

  addTitle("QUINTO: DURACIÓN DEL CONTRATO");
  const diasPlazo = formData.tipo_de_contrato === 'Contratohonorarios' ? 'Plazo Fijo' : 'Indefinido';
  addText(`Este contrato tendrá una duración: ${diasPlazo}. Vigente desde la fecha de firma electrónica.`, 10, "helvetica", "bold");

  // Salto de página si es necesario
  if (currentY > 220) {
    doc.addPage();
    currentY = 25;
  }

  addTitle("SEXTO: LUGAR DE TRABAJO");
  addText(`El Trabajador prestará servicios en las dependencias de ${employee.organismo_nombre || 'la Corporación'} o en modalidad según requerimiento institucional.`, 9);

  addTitle("SÉPTIMO: FERIADO LEGAL");
  addText(`El Trabajador tendrá derecho a feriado anual conforme a la ley (15 días hábiles remunerados), según lo establecido en el Código del Trabajo de Chile.`, 9);

  addTitle("OCTAVO: OBLIGACIONES DEL TRABAJADOR");
  addText(`El Trabajador se compromete a: cumplir sus funciones de manera diligente, respetar el reglamento interno de higiene y seguridad de la Corporación y mantener absoluta reserva de la información estratégica institucional.`, 9);

  addTitle("NOVENO: TÉRMINO DEL CONTRATO");
  addText(`El presente instrumento podrá terminar por cualquiera de las causales establecidas en los artículos 159, 160 y 161 del Código del Trabajo.`, 9);

  addTitle("DÉCIMO: LEGISLACIÓN APLICABLE");
  addText(`Este contrato se rige íntegramente por las disposiciones del Código del Trabajo de la República de Chile.`, 9);

  // FIRMAS
  currentY += 15;
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, margin + 70, currentY); // Linea Empleador
  doc.line(page_width - margin - 70, currentY, page_width - margin, currentY); // Linea Trabajador

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("EMPLEADOR (CONAF)", margin, currentY + 5);
  doc.text("TRABAJADOR", page_width - margin, currentY + 5, { align: "right" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(String(signerName || "Representante"), margin, currentY + 10);
  doc.text(employee.nombrecompleto_x, page_width - margin, currentY + 10, { align: "right" });

  // EVIDENCIA DIGITAL (FES)
  if (signaturePayload && !isPreview) {
    currentY += 25;
    doc.setFillColor(245, 247, 245);
    doc.rect(margin, currentY, content_width, 22, "F");
    doc.setFont("courier", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text(`EVIDENCIA DIGITAL (LEY 19.799)`, margin + 5, currentY + 6);
    doc.setFont("courier", "normal");
    doc.text(`ID TRANSACCIÓN: ${signaturePayload.document.hash.slice(0, 32)}...`, margin + 5, currentY + 11);
    doc.text(`IP ORIGEN: ${signaturePayload.evidence.ip} | TIMESTAMP: ${signaturePayload.evidence.timestamp}`, margin + 5, currentY + 16);
  }

  // FOOTER
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${totalPages} — Documento Electrónico Generado por Sistema Gestión Personal CONAF`, page_width/2, 270, { align: "center" });
  }

  const filename = `${isPreview ? 'Draft_' : 'Contrato_'}${employee.rut}_${new Date().getTime()}.pdf`;
  doc.save(filename);
}
