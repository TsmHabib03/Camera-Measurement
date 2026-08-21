const MM_TO_PT = 72 / 25.4;
const PAGE_WIDTH = 210 * MM_TO_PT;
const PAGE_HEIGHT = 297 * MM_TO_PT;

export function createCalibrationPdf() {
  const markerSize = 50 * MM_TO_PT;
  const markerX = (PAGE_WIDTH - markerSize) / 2;
  const markerY = 390;
  const rect = (x, y, width, height) => `${number(x)} ${number(y)} ${number(width)} ${number(height)} re f`;
  const markerRect = (x, y, width, height) => rect(
    markerX + x * MM_TO_PT,
    markerY + (50 - y - height) * MM_TO_PT,
    width * MM_TO_PT,
    height * MM_TO_PT,
  );

  const cells = [
    [9, 9], [25, 9],
    [17, 17], [33, 17],
    [9, 25], [17, 25],
    [25, 33], [33, 33],
  ];
  const verificationX = (PAGE_WIDTH - 100 * MM_TO_PT) / 2;
  const verificationY = 300;
  const content = [
    '0 0 0 rg',
    'BT /F2 20 Tf 72 790 Td (PlaneMeasure Calibration Marker) Tj ET',
    'BT /F1 10 Tf 72 768 Td (PRINT-READY A4 PDF - marker outside edge is exactly 50 x 50 mm) Tj ET',
    'BT /F1 9 Tf 72 750 Td (Print on A4 paper. This PDF requests no print scaling.) Tj ET',
    markerRect(0, 0, 50, 50),
    '1 1 1 rg',
    markerRect(4, 4, 42, 42),
    '0 0 0 rg',
    ...cells.map(([x, y]) => markerRect(x, y, 8, 8)),
    `0.75 w ${number(markerX)} ${number(markerY - 18)} m ${number(markerX + markerSize)} ${number(markerY - 18)} l S`,
    `0.75 w ${number(markerX)} ${number(markerY - 22)} m ${number(markerX)} ${number(markerY - 14)} l S`,
    `0.75 w ${number(markerX + markerSize)} ${number(markerY - 22)} m ${number(markerX + markerSize)} ${number(markerY - 14)} l S`,
    `BT /F2 10 Tf ${number(markerX + markerSize / 2 - 30)} ${number(markerY - 36)} Td (50.00 mm) Tj ET`,
    `1 w ${number(verificationX)} ${number(verificationY)} m ${number(verificationX + 100 * MM_TO_PT)} ${number(verificationY)} l S`,
    `1 w ${number(verificationX)} ${number(verificationY - 5)} m ${number(verificationX)} ${number(verificationY + 5)} l S`,
    `1 w ${number(verificationX + 100 * MM_TO_PT)} ${number(verificationY - 5)} m ${number(verificationX + 100 * MM_TO_PT)} ${number(verificationY + 5)} l S`,
    `BT /F2 10 Tf ${number(PAGE_WIDTH / 2 - 54)} ${number(verificationY - 20)} Td (Verification line: 100.00 mm) Tj ET`,
    'BT /F1 9 Tf 72 250 Td (After printing, confirm the line above measures 100 mm with a ruler.) Tj ET',
    'BT /F1 9 Tf 72 234 Td (Place this marker flat beside the object and keep all four corners visible to the camera.) Tj ET',
    'BT /F1 8 Tf 72 72 Td (Do not fold, crop, resize, or cover the black marker.) Tj ET',
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R /ViewerPreferences << /PrintScaling /None >> >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${number(PAGE_WIDTH)} ${number(PAGE_HEIGHT)}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Title (PlaneMeasure 50 mm Calibration Marker) /Creator (PlaneMeasure) >>',
  ];

  let pdf = '%PDF-1.4\n% PlaneMeasure print-ready marker\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}

function number(value) {
  return Number(value.toFixed(3));
}
