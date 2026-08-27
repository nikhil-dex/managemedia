import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import fs from "fs/promises";
import path from "path";

interface CertificateData {
  certificateNumber: string;
  name: string;
  internship: string;
  duration: string;
  startDate: Date | string;
  endDate: Date | string;
  issueDate: Date | string;
}

const WIDTH = 2000;
const HEIGHT = 1414;

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

async function imageToBytes(filePath: string) {
  return fs.readFile(filePath);
}

export async function generateCertificatePDF(
  certificate: CertificateData
) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([
    WIDTH,
    HEIGHT,
  ]);

  /*
   * Background template
   */
  const templatePath = path.join(
    process.cwd(),
    "public",
    "certificates",
    "template.png"
  );

  const templateBytes = await imageToBytes(
    templatePath
  );

  const templateImage =
    await pdfDoc.embedPng(templateBytes);

  const signaturePath = path.join(
  process.cwd(),
  "public",
  "certificates",
  "signature.png"
);

const signatureBytes = await imageToBytes(
  signaturePath
);

const signatureImage =
  await pdfDoc.embedPng(signatureBytes);

  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT,
  });

  /*
   * Fonts
   */
  const regularFont = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  );



 const italicFont = await pdfDoc.embedFont(
  StandardFonts.TimesRomanItalic
);

  /*
   * Colors
   */
  const white = rgb(1, 1, 1);
  const gold = rgb(
    0.96,
    0.77,
    0.05
  );

  /*
   * Helper for centered text
   */
  function drawCenteredText(
    text: string,
    y: number,
    size: number,
    font = regularFont,
    color = white
  ) {
    const textWidth = font.widthOfTextAtSize(
      text,
      size
    );

    page.drawText(text, {
      x: (WIDTH - textWidth) / 2,
      y,
      size,
      font,
      color,
    });
  }

  /*
   * Intern name
   */
  drawCenteredText(
    certificate.name,
    680,
    78,
    italicFont,
    gold
  );

  /*
   * Internship
   */
  drawCenteredText(
    certificate.internship.toUpperCase(),
    505,
    27,
    regularFont,
    white
  );

  /*
   * Duration
   */
  drawCenteredText(
    `Duration: ${certificate.duration}`,
    450,
    29,
    regularFont,
    white
  );

  /*
   * Internship dates
   */
  drawCenteredText(
    `${formatDate(
      certificate.startDate
    )} – ${formatDate(certificate.endDate)}`,
    410,
    28,
    regularFont,
    white
  );

  /*
   * Certificate number
   */
  page.drawText(
    `Certificate No: ${certificate.certificateNumber}`,
    {
      x: 375,
      y: 105,
      size: 25,
      font: regularFont,
      color: white,
    }
  );

  /*
   * Issue date
   */
  page.drawText(
    `Date of Issue: ${formatDate(
      certificate.issueDate
    )}`,
    {
      x: 420,
      y: 65,
      size: 25,
      font: regularFont,
      color: white,
    }
  );


  page.drawImage(signatureImage, {
  x: 1240,
  y: 125,
  width: 220,
  height: 90,
});

  /*
   * QR Code
   */
  const verificationUrl =
    `https://managemedia.in/verify/` +
    encodeURIComponent(
      certificate.certificateNumber
    );

  const qrDataUrl =
    await QRCode.toDataURL(
      verificationUrl,
      {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
      }
    );

  const qrBase64 =
    qrDataUrl.split(",")[1];

  const qrBytes =
    Buffer.from(qrBase64, "base64");

  const qrImage =
    await pdfDoc.embedPng(qrBytes);

  page.drawImage(qrImage, {
    x: 940,
    y: 80,
    width: 120,
    height: 120,
  });

  return await pdfDoc.save();
}