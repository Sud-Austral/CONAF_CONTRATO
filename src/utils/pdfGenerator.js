import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fmtCLP, fmtFecha } from "./formatters";

/**
 * Genera el archivo PDF del contrato modificado
 */
export async function generateContractPdf({ 
  employee, 
  formData, 
  signatureDataUrl, 
  signerName, 
  signerRole, 
  signDate 
}) {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "letter", // Letter size: 215.9 x 279.4 mm
  });

  const green_primary = "#1e4d1e";
  const green_soft = "#2d6a2d";
  const gray_text = "#1f2937";
  const page_width = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header Title
  doc.setTextColor(green_soft);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("CORPORACIÓN NACIONAL FORESTAL — CONAF", page_width / 2, 20, { align: "center" });

  doc.setTextColor(gray_text);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("MODIFICACIÓN DE CONTRATO DE TRABAJO", page_width / 2, 28, { align: "center" });

  // Divider Line
  doc.setDrawColor(green_soft);
  doc.setLineWidth(0.5);
  doc.line(margin, 32, page_width - margin, 32);

  const now = new Date();
  const diaS = now.getDate();
  const mesS = now.toLocaleDateString('es-CL', { month: 'long' });
  const anyoS = now.getFullYear();
  doc.setFontSize(9);
  doc.text(`Santiago, ${diaS} de ${mesS} de ${anyoS}`, margin, 40);
  doc.text(`N° DOC-${Math.floor(Math.random() * 900000) + 100000}`, page_width - margin, 40, { align: "right" });

  // I. ANTECEDENTES DEL FUNCIONARIO
  autoTable(doc, {
    startY: 48,
    margin: { left: margin, right: margin },
    head: [["I. ANTECEDENTES DEL FUNCIONARIO", ""]],
    body: [
      ["RUT", employee.rut],
      ["Nombre Completo", employee.nombrecompleto_x],
      ["Sexo", employee.sexo === "M" ? "Masculino" : "Femenino"],
      ["Tramo Etario", employee.age_label || "S/I"],
    ],
    theme: "grid",
    headStyles: { fillColor: green_primary, textColor: "#ffffff", fontSize: 10, halign: "left" },
    bodyStyles: { fontSize: 9, textColor: gray_text },
    columnStyles: { 0: { fontStyle: "bold", width: 50 }, 1: { width: "auto" } },
  });

  // II. TÉRMINOS DEL CONTRATO
  const contractFields = [
    { label: "Organismo", field: "organismo_nombre" },
    { label: "Año", field: "anyo" },
    { label: "Mes", field: "mes" },
    { label: "Tipo de Cargo", field: "tipo_cargo" },
    { label: "Tipo de Contrato", field: "tipo_de_contrato" },
    { label: "Tipo de Pago", field: "tipo_pago" },
    { label: "Fecha de Ingreso", field: "fecha_ingreso" },
    { label: "Fecha de Término", field: "fecha_termino" },
  ];

  const contractBody = contractFields.map(({ label, field }) => {
    const original = employee[field] || "—";
    const nuevo = formData[field] || "—";
    const isDifferent = String(original) !== String(nuevo);
    return {
      content: [label, original, nuevo],
      styles: isDifferent ? { fillColor: "#fff9c4" } : {}, // Highlight changed rows in light yellow
    };
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    margin: { left: margin, right: margin },
    head: [["II. TÉRMINOS DEL CONTRATO", "Valor Anterior", "Valor Nuevo"]],
    body: contractBody.map(b => b.content),
    didParseCell: (data) => {
      if (data.section === 'body') {
        const idx = data.row.index;
        if (contractBody[idx].styles.fillColor) {
          data.cell.styles.fillColor = contractBody[idx].styles.fillColor;
        }
      }
    },
    theme: "grid",
    headStyles: { fillColor: green_primary, textColor: "#ffffff", fontSize: 10 },
    bodyStyles: { fontSize: 9, textColor: gray_text },
    columnStyles: { 0: { fontStyle: "bold", width: 50 } },
  });

  // III. REMUNERACIONES
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    margin: { left: margin, right: margin },
    head: [["III. REMUNERACIONES", "Monto Mensual"]],
    body: [
      ["Remuneración Bruta", fmtCLP(formData.remuneracionbruta_mensual)],
      ["Remuneración Líquida", fmtCLP(formData.remuliquida_mensual)],
      ["Sueldo Base", fmtCLP(formData.base)],
    ],
    theme: "grid",
    headStyles: { fillColor: green_primary, textColor: "#ffffff", fontSize: 10 },
    bodyStyles: { fontSize: 9, textColor: gray_text },
    columnStyles: { 0: { fontStyle: "bold", width: 50 }, 1: { halign: "right" } },
  });

  // IV. CLÁUSULA LEGAL
  const clauseY = doc.lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(green_primary);
  doc.text("IV. CLÁUSULA LEGAL", margin, clauseY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(gray_text);
  const legalText = `Se deja constancia de que la presente modificación rige a partir de la fecha de firma de este documento, manteniendo plena vigencia el resto de las cláusulas del contrato original. El funcionario declara conocer y aceptar los términos anteriormente descritos en cumplimiento de la normativa institucional vigente de la Corporación Nacional Forestal.`;
  const splitText = doc.splitTextToSize(legalText, page_width - (margin * 2));
  doc.text(splitText, margin, clauseY + 6, { align: "justify" });

  // V. FIRMA DEL RESPONSABLE
  const signatureY = clauseY + 30;
  if (signatureDataUrl) {
    doc.addImage(signatureDataUrl, "PNG", margin + 10, signatureY, 60, 25);
  }
  
  doc.line(margin, signatureY + 28, margin + 80, signatureY + 28);
  doc.setFont("helvetica", "bold");
  doc.text(signerName || "___________________________", margin, signatureY + 33);
  doc.setFont("helvetica", "normal");
  doc.text(signerRole || "Resguardar Cargo", margin, signatureY + 38);
  doc.text(`Fecha de Firma: ${fmtFecha(signDate)}`, margin, signatureY + 43);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount} — Documento generado electrónicamente — CONAF Chile`, page_width / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
  }

  // Save the PDF
  const filename = `Contrato_CONAF_${employee.rut}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
