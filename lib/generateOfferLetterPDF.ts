import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

export interface OfferLetterData {
  documentNumber: string;
  name: string;
  internship: string;
  duration: string;
  startDate: Date | string;
  endDate: Date | string;
  issueDate: Date | string;
  stipend: string;
  workMode: string;
}

const TEMPLATE_WIDTH = 1536;
const TEMPLATE_HEIGHT = 2048;

// Keep the PDF in the same aspect ratio as the PNG.
// This prevents the template from stretching.
const PAGE_WIDTH = 612;
const PAGE_HEIGHT =
  (TEMPLATE_HEIGHT / TEMPLATE_WIDTH) * PAGE_WIDTH;

const SCALE = PAGE_WIDTH / TEMPLATE_WIDTH;

const BLACK = rgb(0.05, 0.07, 0.09);
const BLUE = rgb(0.02, 0.42, 0.65);
const GRAY = rgb(0.30, 0.32, 0.34);

function px(value: number) {
  return value * SCALE;
}

function yFromTop(value: number) {
  return PAGE_HEIGHT - px(value);
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

async function readFile(filePath: string) {
  return fs.readFile(filePath);
}

export async function generateOfferLetterPDF(
  data: OfferLetterData
) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([
    PAGE_WIDTH,
    PAGE_HEIGHT,
  ]);

  /*
   * ================================
   * FONTS
   * ================================
   */

  const regularFont = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  );

  const boldFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  );

  /*
   * ================================
   * OFFER LETTER TEMPLATE
   * ================================
   */

  const templatePath = path.join(
    process.cwd(),
    "public",
    "templates",
    "offer-letter-template.png"
  );

  const templateBytes = await readFile(templatePath);

  const templateImage =
    await pdfDoc.embedPng(templateBytes);

  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });

  /*
   * ================================
   * SIGNATURE
   * ================================
   *
   * IMPORTANT:
   * This template has a white background,
   * so use the DARK signature version.
   */

  const signaturePath = path.join(
    process.cwd(),
    "public",
    "certificates",
    "signature-dark.png"
  );

  const signatureBytes = await readFile(
    signaturePath
  );

  const signatureImage =
    await pdfDoc.embedPng(signatureBytes);

  /*
   * ================================
   * TEXT HELPERS
   * ================================
   */

  function drawText(
    text: string,
    x: number,
    topY: number,
    size = 16,
    font = regularFont,
    color = BLACK
  ) {
    page.drawText(text, {
      x: px(x),
      y: yFromTop(topY),
      size: px(size),
      font,
      color,
    });
  }

  function drawCenteredText(
    text: string,
    centerX: number,
    topY: number,
    size = 16,
    font = regularFont,
    color = BLACK
  ) {
    const textWidth =
      font.widthOfTextAtSize(
        text,
        px(size)
      );

    page.drawText(text, {
      x: px(centerX) - textWidth / 2,
      y: yFromTop(topY),
      size: px(size),
      font,
      color,
    });
  }

  function wrapText(
    text: string,
    maxWidth: number,
    size: number,
    font = regularFont
  ) {
    const words = text.split(/\s+/);
    const lines: string[] = [];

    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine
        ? `${currentLine} ${word}`
        : word;

      const width =
        font.widthOfTextAtSize(
          testLine,
          px(size)
        );

      if (width <= px(maxWidth)) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }

        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  function drawParagraph(
    text: string,
    x: number,
    topY: number,
    maxWidth: number,
    size = 16,
    lineHeight = 25,
    font = regularFont,
    color = BLACK
  ) {
    const lines = wrapText(
      text,
      maxWidth,
      size,
      font
    );

    lines.forEach((line, index) => {
      drawText(
        line,
        x,
        topY + index * lineHeight,
        size,
        font,
        color
      );
    });

    return topY + lines.length * lineHeight;
  }

  /*
   * ================================
   * DATE
   * ================================
   *
   * Template date area:
   * approximately x=1190, y=290
   */

  const issueDate = formatDate(
    data.issueDate
  );

  const dateWidth =
    boldFont.widthOfTextAtSize(
      issueDate,
      px(17)
    );

  page.drawText(issueDate, {
    x: px(1370) - dateWidth,
    y: yFromTop(285),
    size: px(17),
    font: boldFont,
    color: BLACK,
  });

  /*
   * ================================
   * RECIPIENT
   * ================================
   */

  drawText(
    "To:",
    155,
    430,
    17,
    boldFont
  );

  drawText(
    data.name,
    155,
    462,
    18,
    regularFont,
    BLACK
  );

  /*
   * ================================
   * SUBJECT
   * ================================
   */

  drawText(
    "Subject:",
    155,
    535,
    17,
    boldFont
  );

  drawText(
    "Internship Opportunity at ManageMedia",
    250,
    535,
    17,
    boldFont,
    BLUE
  );

  /*
   * ================================
   * GREETING
   * ================================
   */

  drawText(
    `Dear ${data.name},`,
    155,
    610,
    17,
    regularFont
  );

  /*
   * ================================
   * INTRODUCTION
   * ================================
   */

  let y = 665;

  y = drawParagraph(
    `We are pleased to offer you the position of ${data.internship} at ManageMedia. We are excited to welcome you to our team and look forward to your contribution.`,
    155,
    y,
    1225,
    17,
    27
  );

  /*
   * ================================
   * INTERNSHIP DETAILS
   * ================================
   */

  y += 35;

  drawText(
    "Internship Details",
    155,
    y,
    17,
    boldFont,
    BLUE
  );

  y += 38;

  drawText(
    `Position: ${data.internship}`,
    175,
    y,
    16,
    regularFont
  );

  y += 30;

  drawText(
    `Duration: ${data.duration}`,
    175,
    y,
    16,
    regularFont
  );

  y += 30;

  drawText(
    `Start Date: ${formatDate(
      data.startDate
    )}`,
    175,
    y,
    16,
    regularFont
  );

  y += 30;

  drawText(
    `End Date: ${formatDate(
      data.endDate
    )}`,
    175,
    y,
    16,
    regularFont
  );

  y += 30;

  drawText(
    `Work Mode: ${data.workMode}`,
    175,
    y,
    16,
    regularFont
  );

  y += 30;

  drawText(
    `Stipend: ${data.stipend}`,
    175,
    y,
    16,
    regularFont
  );

  /*
   * ================================
   * RESPONSIBILITIES / DESCRIPTION
   * ================================
   */

  y += 38;

  y = drawParagraph(
    `During your internship, you will work on assigned projects and responsibilities related to your role. You will have the opportunity to gain practical experience, collaborate with the team, and contribute to ManageMedia's digital initiatives.`,
    155,
    y,
    1225,
    16,
    26
  );

  y += 25;

  y = drawParagraph(
    `We expect you to maintain professional conduct, communicate effectively, complete assigned responsibilities within agreed timelines, and maintain the confidentiality of company and project information.`,
    155,
    y,
    1225,
    16,
    26
  );

  y += 25;

  y = drawParagraph(
    `We look forward to your contribution and wish you a productive and valuable learning experience with ManageMedia.`,
    155,
    y,
    1225,
    16,
    26
  );

  /*
   * ================================
   * ACCEPTANCE
   * ================================
   */

  y += 30;

  y = drawParagraph(
    `Please confirm your acceptance of this internship offer through the communication channel provided by ManageMedia.`,
    155,
    y,
    1225,
    16,
    26
  );

  /*
   * ================================
   * SIGNATURE
   * ================================
   *
   * Bottom-right area above footer.
   */

  drawText(
    "With regards,",
    1110,
    1640,
    16,
    regularFont,
    BLACK
  );

  page.drawImage(signatureImage, {
    x: px(1080),
    y: yFromTop(1740),
    width: px(190),
    height: px(90),
  });

  drawText(
    "Authorized Signatory",
    1080,
    1835,
    15,
    boldFont,
    BLACK
  );

  drawText(
    "ManageMedia",
    1080,
    1862,
    14,
    regularFont,
    GRAY
  );

  /*
   * ================================
   * DOCUMENT NUMBER
   * ================================
   */

  drawText(
    `Offer No: ${data.documentNumber}`,
    155,
    1835,
    12,
    regularFont,
    GRAY
  );

  /*
   * ================================
   * FINAL PDF
   * ================================
   */

  return await pdfDoc.save();
}