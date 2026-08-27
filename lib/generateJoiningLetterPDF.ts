import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFFont,
} from "pdf-lib";
import fs from "fs/promises";
import path from "path";

export interface JoiningLetterData {
  documentNumber: string;
  name: string;
  internship: string;
  duration: string;
  startDate: Date | string;
  endDate: Date | string;
  issueDate: Date | string;
  workMode: string;
}

/*
 * ==========================================
 * TEMPLATE / PAGE SIZE
 * ==========================================
 */

const TEMPLATE_WIDTH = 1536;
const TEMPLATE_HEIGHT = 2048;

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const SCALE_X =
  PAGE_WIDTH / TEMPLATE_WIDTH;

const SCALE_Y =
  PAGE_HEIGHT / TEMPLATE_HEIGHT;

/*
 * ==========================================
 * COLORS
 * ==========================================
 */

const BLACK = rgb(
  0.035,
  0.055,
  0.08
);

const BLUE = rgb(
  0.02,
  0.42,
  0.65
);

const GRAY = rgb(
  0.35,
  0.37,
  0.40
);

/*
 * ==========================================
 * COORDINATE HELPERS
 * ==========================================
 */

function x(value: number) {
  return value * SCALE_X;
}

function y(value: number) {
  return (
    PAGE_HEIGHT -
    value * SCALE_Y
  );
}

/*
 * ==========================================
 * DATE FORMAT
 * ==========================================
 */

function formatDate(
  date: Date | string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(date));
}

/*
 * ==========================================
 * FILE HELPER
 * ==========================================
 */

async function readFile(
  filePath: string
) {
  return fs.readFile(filePath);
}

/*
 * ==========================================
 * TEXT WRAPPING
 * ==========================================
 */

function wrapText(
  text: string,
  maxWidthTemplate: number,
  fontSize: number,
  font: PDFFont
) {
  const words =
    text.trim().split(/\s+/);

  const lines: string[] = [];

  let currentLine = "";

  for (const word of words) {
    const testLine =
      currentLine
        ? `${currentLine} ${word}`
        : word;

    const width =
      font.widthOfTextAtSize(
        testLine,
        fontSize
      );

    if (
      width <=
      x(maxWidthTemplate)
    ) {
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

/*
 * ==========================================
 * GENERATE JOINING LETTER
 * ==========================================
 */

export async function generateJoiningLetterPDF(
  data: JoiningLetterData
) {
  const pdfDoc =
    await PDFDocument.create();

  /*
   * ========================================
   * FONTS
   * ========================================
   */

  const regularFont =
    await pdfDoc.embedFont(
      StandardFonts.Helvetica
    );

  const boldFont =
    await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );

  /*
   * ========================================
   * TEMPLATE
   * ========================================
   */

  const templatePath =
    path.join(
      process.cwd(),
      "public",
      "templates",
      "joining-letter-template.png"
    );

  const templateBytes =
    await readFile(templatePath);

  const templateImage =
    await pdfDoc.embedPng(
      templateBytes
    );

  /*
   * ========================================
   * SIGNATURE
   * ========================================
   */

  const signaturePath =
    path.join(
      process.cwd(),
      "public",
      "certificates",
      "signature-dark.png"
    );

  const signatureBytes =
    await readFile(signaturePath);

  const signatureImage =
    await pdfDoc.embedPng(
      signatureBytes
    );

  /*
   * ========================================
   * PAGE
   * ========================================
   */

  const page =
    pdfDoc.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]);

  /*
   * ========================================
   * BACKGROUND TEMPLATE
   * ========================================
   */

  page.drawImage(
    templateImage,
    {
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    }
  );

  /*
   * ========================================
   * TEXT HELPER
   * ========================================
   */

  function drawText(
    text: string,
    templateX: number,
    templateY: number,
    fontSize = 11.5,
    font = regularFont,
    color = BLACK
  ) {
    page.drawText(text, {
      x: x(templateX),
      y: y(templateY),
      size: fontSize,
      font,
      color,
    });
  }

  /*
   * ========================================
   * RIGHT ALIGNED TEXT
   * ========================================
   */

  function drawRightText(
    text: string,
    templateX: number,
    templateY: number,
    fontSize = 11,
    font = regularFont,
    color = BLACK
  ) {
    const width =
      font.widthOfTextAtSize(
        text,
        fontSize
      );

    page.drawText(text, {
      x:
        x(templateX) -
        width,
      y: y(templateY),
      size: fontSize,
      font,
      color,
    });
  }

  /*
   * ========================================
   * PARAGRAPH
   * ========================================
   */

  function drawParagraph(
    text: string,
    templateX: number,
    templateY: number,
    maxWidth: number,
    fontSize = 11.5,
    lineHeight = 36,
    afterSpacing = 0,
    font = regularFont,
    color = BLACK
  ) {
    const lines =
      wrapText(
        text,
        maxWidth,
        fontSize,
        font
      );

    lines.forEach(
      (line, index) => {
        drawText(
          line,
          templateX,
          templateY +
            index * lineHeight,
          fontSize,
          font,
          color
        );
      }
    );

    return (
      templateY +
      lines.length *
        lineHeight +
      afterSpacing
    );
  }

  /*
   * ========================================
   * ISSUE DATE
   * ========================================
   */

  drawRightText(
    formatDate(
      data.issueDate
    ),
    1370,
    285,
    11,
    boldFont
  );

  /*
   * ========================================
   * RECIPIENT
   * ========================================
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
    468,
    12
  );

  /*
   * ========================================
   * SUBJECT
   * ========================================
   */

  drawText(
    "Subject:",
    155,
    540,
    12,
    boldFont
  );

  drawText(
    "Confirmation of Internship Joining",
    330,
    540,
    12,
    boldFont,
    BLUE
  );

  /*
   * ========================================
   * GREETING
   * ========================================
   */

  drawText(
    `Dear ${data.name},`,
    155,
    615,
    12
  );

  /*
   * ========================================
   * INTRODUCTION
   * ========================================
   */

  let currentY = 680;

  currentY =
    drawParagraph(
      `We are pleased to confirm that you have joined ManageMedia as a ${data.internship}.`,
      155,
      currentY,
      1220,
      11.5,
      36,
      24
    );

  currentY =
    drawParagraph(
      `Your internship commenced on ${formatDate(data.startDate)} and is scheduled to continue until ${formatDate(data.endDate)}, as per the terms communicated during your selection and onboarding.`,
      155,
      currentY,
      1220,
      11.5,
      36,
      24
    );

  currentY =
    drawParagraph(
      `During your internship, you will work on assigned responsibilities related to your role, collaborate with the team, and contribute to relevant projects and activities.`,
      155,
      currentY,
      1220,
      11.5,
      36,
      24
    );

  /*
   * ========================================
   * JOINING DETAILS
   * ========================================
   */

  drawText(
    "Joining Details",
    155,
    currentY,
    12.5,
    boldFont,
    BLUE
  );

  currentY += 38;

  const details = [
    [
      "Position:",
      data.internship,
    ],
    [
      "Joining Date:",
      formatDate(
        data.startDate
      ),
    ],
    [
      "Duration:",
      data.duration,
    ],
    [
      "End Date:",
      formatDate(
        data.endDate
      ),
    ],
    [
      "Work Mode:",
      data.workMode,
    ],
  ];

  for (
    const [label, value]
    of details
  ) {
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

    currentY += 38;
  }

  /*
   * ========================================
   * CLOSING
   * ========================================
   */

  currentY += 22;

  drawParagraph(
    `We welcome you to ManageMedia and wish you a productive, meaningful, and valuable internship experience.`,
    155,
    currentY,
    1220,
    11.5,
    36,
    0
  );

  /*
   * ========================================
   * JOINING NUMBER
   * ========================================
   */

  drawText(
    "Joining No:",
    155,
    1770,
    10.5,
    boldFont
  );

  drawText(
    data.documentNumber,
    285,
    1770,
    10.5,
    boldFont,
    BLUE
  );

  /*
   * ========================================
   * SIGNATURE
   * ========================================
   */

  drawText(
    "With regards,",
    1080,
    1655,
    10.5,
    boldFont
  );

  page.drawImage(
    signatureImage,
    {
      x: x(1060),
      y: y(1785),
      width: x(200),
      height: x(90),
    }
  );

  drawText(
    "Authorized Signatory",
    1060,
    1875,
    10,
    boldFont
  );

  drawText(
    "ManageMedia",
    1060,
    1900,
    10,
    regularFont,
    GRAY
  );

  /*
   * ========================================
   * RETURN PDF
   * ========================================
   */

  return await pdfDoc.save();
}