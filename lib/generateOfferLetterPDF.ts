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

/*
 * ==========================================
 * PAGE / TEMPLATE
 * ==========================================
 *
 * Template size:
 * 1536 × 2048
 *
 * PDF size:
 * A4 portrait
 */

const TEMPLATE_WIDTH = 1536;
const TEMPLATE_HEIGHT = 2048;

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const SCALE_X = PAGE_WIDTH / TEMPLATE_WIDTH;
const SCALE_Y = PAGE_HEIGHT / TEMPLATE_HEIGHT;

/*
 * Colors
 */

const BLACK = rgb(0.035, 0.055, 0.08);
const BLUE = rgb(0.02, 0.42, 0.65);
const LIGHT_BLUE = rgb(0.68, 0.82, 0.92);
const GRAY = rgb(0.35, 0.37, 0.40);
const WHITE = rgb(1, 1, 1);

/*
 * Convert template pixel X → PDF X
 */

function x(value: number) {
  return value * SCALE_X;
}

/*
 * Convert template pixel Y from top → PDF Y
 */

function y(value: number) {
  return PAGE_HEIGHT - value * SCALE_Y;
}

/*
 * ==========================================
 * DATE
 * ==========================================
 */

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/*
 * ==========================================
 * FILE
 * ==========================================
 */

async function readFile(filePath: string) {
  return fs.readFile(filePath);
}

/*
 * ==========================================
 * GENERATOR
 * ==========================================
 */

export async function generateOfferLetterPDF(
  data: OfferLetterData
) {
  const pdfDoc = await PDFDocument.create();

  /*
   * ==========================================
   * FONTS
   * ==========================================
   */

  const regularFont = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  );

  const boldFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  );

  /*
   * ==========================================
   * SIGNATURE
   * ==========================================
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
   * ==========================================
   * PAGE 1
   * ==========================================
   */

  const page1 = pdfDoc.addPage([
    PAGE_WIDTH,
    PAGE_HEIGHT,
  ]);

  /*
   * ==========================================
   * TEMPLATE BACKGROUND
   * ==========================================
   */

  const templatePath = path.join(
    process.cwd(),
    "public",
    "templates",
    "offer-letter-template.png"
  );

  const templateBytes = await readFile(
    templatePath
  );

  const templateImage =
    await pdfDoc.embedPng(templateBytes);

  page1.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });

  /*
   * ==========================================
   * PAGE 1 TEXT HELPERS
   * ==========================================
   */

  function drawText(
    text: string,
    templateX: number,
    templateY: number,
    fontSize = 12,
    font = regularFont,
    color = BLACK
  ) {
    page1.drawText(text, {
      x: x(templateX),
      y: y(templateY),
      size: fontSize,
      font,
      color,
    });
  }

  function drawRightText(
    text: string,
    templateX: number,
    templateY: number,
    fontSize = 12,
    font = regularFont,
    color = BLACK
  ) {
    const width =
      font.widthOfTextAtSize(
        text,
        fontSize
      );

    page1.drawText(text, {
      x: x(templateX) - width,
      y: y(templateY),
      size: fontSize,
      font,
      color,
    });
  }

  function wrapText(
    text: string,
    maxWidth: number,
    fontSize: number,
    font = regularFont
  ) {
    const words = text.split(/\s+/);

    const lines: string[] = [];

    let current = "";

    for (const word of words) {
      const test = current
        ? `${current} ${word}`
        : word;

      const width =
        font.widthOfTextAtSize(
          test,
          fontSize
        );

      if (width <= x(maxWidth)) {
        current = test;
      } else {
        if (current) {
          lines.push(current);
        }

        current = word;
      }
    }

    if (current) {
      lines.push(current);
    }

    return lines;
  }

  function drawParagraph(
    text: string,
    templateX: number,
    templateY: number,
    maxWidth: number,
    fontSize = 12,
    lineHeight = 18,
    font = regularFont,
    color = BLACK
  ) {
    const lines = wrapText(
      text,
      maxWidth,
      fontSize,
      font
    );

    lines.forEach((line, index) => {
      drawText(
        line,
        templateX,
        templateY + index * lineHeight,
        fontSize,
        font,
        color
      );
    });

    return (
      templateY +
      lines.length * lineHeight
    );
  }

  /*
   * ==========================================
   * DATE
   * ==========================================
   */

  const issueDate = formatDate(
    data.issueDate
  );

  drawRightText(
    issueDate,
    1370,
    285,
    11,
    boldFont
  );

  /*
   * ==========================================
   * RECIPIENT
   * ==========================================
   */

  drawText(
    "To:",
    155,
    430,
    12,
    boldFont
  );

  drawText(
    data.name,
    155,
    465,
    12,
    regularFont
  );

  /*
   * ==========================================
   * SUBJECT
   * ==========================================
   */

  drawText(
    "Subject:",
    155,
    535,
    12,
    boldFont
  );

  drawText(
    "Internship Opportunity at ManageMedia",
    250,
    535,
    12,
    boldFont,
    BLUE
  );

  /*
   * ==========================================
   * GREETING
   * ==========================================
   */

  drawText(
    `Dear ${data.name},`,
    155,
    610,
    12
  );

  /*
   * ==========================================
   * INTRODUCTION
   * ==========================================
   */

  let currentY = 675;

  currentY = drawParagraph(
    `We are pleased to offer you the position of ${data.internship} at ManageMedia. We are excited to welcome you to our team and look forward to your contribution.`,
    155,
    currentY,
    1220,
    11.5,
    18
  );

  /*
   * ==========================================
   * INTERNSHIP DETAILS
   * ==========================================
   */

  currentY += 32;

  drawText(
    "Internship Details",
    155,
    currentY,
    12,
    boldFont,
    BLUE
  );

  currentY += 32;

  /*
   * Detail rows
   */

  const details = [
    ["Position:", data.internship],
    ["Duration:", data.duration],
    [
      "Start Date:",
      formatDate(data.startDate),
    ],
    [
      "End Date:",
      formatDate(data.endDate),
    ],
    ["Work Mode:", data.workMode],
    ["Stipend:", data.stipend],
  ];

  for (const [label, value] of details) {
    drawText(
      label,
      175,
      currentY,
      11,
      boldFont
    );

    drawText(
      value,
      350,
      currentY,
      11
    );

    currentY += 27;
  }

  /*
   * ==========================================
   * RESPONSIBILITIES
   * ==========================================
   */

  currentY += 22;

  currentY = drawParagraph(
    `During your internship, you will work on assigned projects and responsibilities related to your role. You will have the opportunity to gain practical experience, collaborate with the team, and contribute to ManageMedia's digital initiatives.`,
    155,
    currentY,
    1220,
    11.5,
    18
  );

  currentY += 22;

  currentY = drawParagraph(
    `We look forward to your contribution and wish you a productive and valuable learning experience with ManageMedia.`,
    155,
    currentY,
    1220,
    11.5,
    18
  );

  currentY += 22;

  drawParagraph(
    `Please confirm your acceptance of this internship offer through the communication channel provided by ManageMedia.`,
    155,
    currentY,
    1220,
    11.5,
    18
  );

  /*
   * ==========================================
   * OFFER NUMBER
   * ==========================================
   */

  drawText(
    "Offer No:",
    155,
    1770,
    10.5,
    boldFont
  );

  drawText(
    data.documentNumber,
    245,
    1770,
    10.5,
    boldFont,
    BLUE
  );

  /*
   * ==========================================
   * SIGNATURE
   * ==========================================
   */

  drawText(
    "With regards,",
    1110,
    1660,
    10.5,
    boldFont
  );

  page1.drawImage(signatureImage, {
    x: x(1080),
    y: y(1790),
    width: x(190),
    height: x(90),
  });

  drawText(
    "Authorized Signatory",
    1080,
    1880,
    10,
    boldFont
  );

  drawText(
    "ManageMedia",
    1080,
    1905,
    10,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * PAGE 2
   * ==========================================
   */

  const page2 = pdfDoc.addPage([
    PAGE_WIDTH,
    PAGE_HEIGHT,
  ]);

  /*
   * ==========================================
   * PAGE 2 BACKGROUND
   * ==========================================
   */

  page2.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: WHITE,
  });

  /*
   * Top blue decoration
   */

  page2.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - x(35),
    width: PAGE_WIDTH,
    height: x(35),
    color: BLUE,
  });

  page2.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - x(60),
    width: x(210),
    height: x(14),
    color: LIGHT_BLUE,
  });

  /*
   * Header line
   */

  page2.drawLine({
    start: {
      x: x(100),
      y: y(145),
    },
    end: {
      x: x(1435),
      y: y(145),
    },
    thickness: 1.2,
    color: LIGHT_BLUE,
  });

  /*
   * ==========================================
   * PAGE 2 HELPERS
   * ==========================================
   */

  function page2Text(
    text: string,
    templateX: number,
    templateY: number,
    fontSize = 11,
    font = regularFont,
    color = BLACK
  ) {
    page2.drawText(text, {
      x: x(templateX),
      y: y(templateY),
      size: fontSize,
      font,
      color,
    });
  }

  function page2Paragraph(
    text: string,
    templateX: number,
    templateY: number,
    maxWidth: number,
    fontSize = 11,
    lineHeight = 17,
    font = regularFont,
    color = BLACK
  ) {
    const words = text.split(/\s+/);

    const lines: string[] = [];

    let current = "";

    for (const word of words) {
      const test = current
        ? `${current} ${word}`
        : word;

      const width =
        font.widthOfTextAtSize(
          test,
          fontSize
        );

      if (width <= x(maxWidth)) {
        current = test;
      } else {
        if (current) {
          lines.push(current);
        }

        current = word;
      }
    }

    if (current) {
      lines.push(current);
    }

    lines.forEach((line, index) => {
      page2Text(
        line,
        templateX,
        templateY +
          index * lineHeight,
        fontSize,
        font,
        color
      );
    });

    return (
      templateY +
      lines.length * lineHeight
    );
  }

  /*
   * ==========================================
   * PAGE 2 HEADER
   * ==========================================
   */

  page2Text(
    "MANAGEMEDIA",
    155,
    105,
    20,
    boldFont,
    BLACK
  );

  page2Text(
    "Internship Documentation",
    155,
    128,
    9,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * TITLE
   * ==========================================
   */

  const title =
    "TERMS & CONDITIONS";

  const titleWidth =
    boldFont.widthOfTextAtSize(
      title,
      18
    );

  page2.drawText(title, {
    x:
      PAGE_WIDTH / 2 -
      titleWidth / 2,
    y: y(220),
    size: 18,
    font: boldFont,
    color: BLUE,
  });

  /*
   * ==========================================
   * INTRO
   * ==========================================
   */

  let termsY = 275;

  page2Text(
    `Offer No: ${data.documentNumber}`,
    1200,
    220,
    9,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * TERMS
   * ==========================================
   */

  const terms = [
    {
      title: "1. Professional Conduct",
      text: "The intern is expected to maintain professional behavior, respectful communication, and appropriate conduct throughout the internship.",
    },
    {
      title: "2. Responsibilities",
      text: "The intern agrees to complete assigned tasks and responsibilities within the expected timelines and follow reasonable instructions provided by ManageMedia.",
    },
    {
      title: "3. Confidentiality",
      text: "The intern must maintain the confidentiality of company, client, project, technical, business, and other non-public information accessed during the internship.",
    },
    {
      title: "4. Intellectual Property",
      text: "Any work, materials, designs, code, documentation, or other deliverables created as part of assigned company work shall be subject to ManageMedia's applicable ownership and usage policies.",
    },
    {
      title: "5. Attendance & Communication",
      text: "The intern is expected to maintain reasonable availability and communicate promptly regarding delays, absences, or circumstances affecting assigned responsibilities.",
    },
    {
      title: "6. Termination",
      text: "ManageMedia or the intern may end the internship subject to the terms communicated by the organization.",
    },
    {
      title: "7. Completion Certificate",
      text: "A completion certificate may be issued upon successful completion of the internship and fulfillment of the applicable completion requirements.",
    },
    {
      title: "8. Acceptance",
      text: "By accepting this offer, the intern acknowledges that they have read and understood the internship terms and agree to fulfill the responsibilities associated with the role.",
    },
  ];

  for (const term of terms) {
    page2Text(
      term.title,
      120,
      termsY,
      11,
      boldFont,
      BLUE
    );

    termsY += 21;

    termsY = page2Paragraph(
      term.text,
      120,
      termsY,
      1290,
      10.5,
      16
    );

    termsY += 24;
  }

  /*
   * ==========================================
   * SIGNATURE
   * ==========================================
   */

  page2Text(
    "With regards,",
    1050,
    1740,
    10.5,
    boldFont
  );

  page2.drawImage(signatureImage, {
    x: x(1020),
    y: y(1870),
    width: x(190),
    height: x(85),
  });

  page2Text(
    "Authorized Signatory",
    1020,
    1940,
    10,
    boldFont
  );

  page2Text(
    "ManageMedia",
    1020,
    1965,
    10,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * PAGE 2 OFFER NUMBER
   * ==========================================
   */

  page2Text(
    `Offer No: ${data.documentNumber}`,
    120,
    1940,
    9,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * FOOTER
   * ==========================================
   */

  page2.drawLine({
    start: {
      x: x(70),
      y: y(1990),
    },
    end: {
      x: x(1460),
      y: y(1990),
    },
    thickness: 0.8,
    color: LIGHT_BLUE,
  });

  page2Text(
    "+91-9315226146",
    120,
    2020,
    8.5,
    regularFont,
    GRAY
  );

  page2Text(
    "managemedia2019@gmail.com",
    550,
    2020,
    8.5,
    regularFont,
    GRAY
  );

  page2Text(
    "New Delhi / India",
    1200,
    2020,
    8.5,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * RETURN PDF
   * ==========================================
   */

  return await pdfDoc.save();
}