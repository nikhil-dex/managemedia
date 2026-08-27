import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFFont
} from "pdf-lib";
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
 */

const TEMPLATE_WIDTH = 1536;
const TEMPLATE_HEIGHT = 2048;

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const SCALE_X = PAGE_WIDTH / TEMPLATE_WIDTH;
const SCALE_Y = PAGE_HEIGHT / TEMPLATE_HEIGHT;

/*
 * ==========================================
 * COLORS
 * ==========================================
 */

const BLACK = rgb(0.035, 0.055, 0.08);
const BLUE = rgb(0.02, 0.42, 0.65);
const LIGHT_BLUE = rgb(0.68, 0.82, 0.92);
const GRAY = rgb(0.35, 0.37, 0.40);
const WHITE = rgb(1, 1, 1);

/*
 * ==========================================
 * COORDINATE HELPERS
 * ==========================================
 */

function x(value: number) {
  return value * SCALE_X;
}

function y(value: number) {
  return PAGE_HEIGHT - value * SCALE_Y;
}

/*
 * ==========================================
 * DATE FORMAT
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
 * FILE HELPER
 * ==========================================
 */

async function readFile(filePath: string) {
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
  const words = text.trim().split(/\s+/);

  const lines: string[] = [];

  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine
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
 * GENERATE OFFER LETTER
 * ==========================================
 */

export async function generateOfferLetterPDF(
  data: OfferLetterData
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
   * PAGE 1
   * ========================================
   */

  const page1 =
    pdfDoc.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]);

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
      "offer-letter-template.png"
    );

  const templateBytes =
    await readFile(templatePath);

  const templateImage =
    await pdfDoc.embedPng(
      templateBytes
    );

  page1.drawImage(
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
   * PAGE 1 TEXT HELPERS
   * ========================================
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
   * DRAW PARAGRAPH
   *
   * Returns the new Y position.
   * This is important because wrapped
   * paragraphs can have multiple lines.
   * ========================================
   */

  function drawParagraph(
    text: string,
    templateX: number,
    templateY: number,
    maxWidth: number,
    fontSize = 11.5,
    lineHeight = 21,
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
   * DATE
   * ========================================
   */

  drawRightText(
    formatDate(data.issueDate),
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
    "Internship Opportunity at ManageMedia",
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

  let currentY = 675;

  currentY =
    drawParagraph(
      `We are pleased to offer you the position of ${data.internship} at ManageMedia. We are excited to welcome you to our team and look forward to your contribution.`,
      155,
      currentY,
      1220,
      11.5,
      42,
      28
    );

  /*
   * ========================================
   * INTERNSHIP DETAILS HEADING
   * ========================================
   */

  currentY += 10;

  drawText(
    "Internship Details",
    155,
    currentY,
    12.5,
    boldFont,
    BLUE
  );

  currentY += 34;

  /*
   * ========================================
   * INTERNSHIP DETAILS
   * ========================================
   */

  const details = [
    [
      "Position:",
      data.internship,
    ],
    [
      "Duration:",
      data.duration,
    ],
    [
      "Start Date:",
      formatDate(
        data.startDate
      ),
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
    [
      "Stipend:",
      data.stipend,
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
   * MAIN BODY
   * ========================================
   */

  currentY += 20;

  currentY =
    drawParagraph(
      `During your internship, you will work on assigned projects and responsibilities related to your role. You will have the opportunity to gain practical experience, collaborate with the team, and contribute to ManageMedia's digital initiatives.`,
      155,
      currentY,
      1220,
      11.5,
      42,
      28
    );

  currentY =
    drawParagraph(
      `We look forward to your contribution and wish you a productive and valuable learning experience with ManageMedia.`,
      155,
      currentY,
      1220,
      11.5,
      42,
      28
    );

  currentY =
    drawParagraph(
      `Please confirm your acceptance of this internship offer through the communication channel provided by ManageMedia.`,
      155,
      currentY,
      1220,
      11.5,
      42,
      28
    );

  /*
   * ========================================
   * OFFER NUMBER
   * ========================================
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
    325,
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

  page1.drawImage(
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
   * PAGE 2
   * ========================================
   */

  const page2 =
    pdfDoc.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]);

  /*
   * ========================================
   * PAGE 2 BACKGROUND
   * ========================================
   */

  page2.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: WHITE,
  });

  /*
   * ========================================
   * TOP BLUE BAR
   * ========================================
   */

  page2.drawRectangle({
    x: 0,
    y:
      PAGE_HEIGHT -
      x(35),
    width: PAGE_WIDTH,
    height: x(35),
    color: BLUE,
  });

  page2.drawRectangle({
    x: 0,
    y:
      PAGE_HEIGHT -
      x(60),
    width: x(210),
    height: x(14),
    color: LIGHT_BLUE,
  });

  /*
   * ========================================
   * HEADER LINE
   * ========================================
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
   * ========================================
   * PAGE 2 HELPERS
   * ========================================
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
    fontSize = 10.5,
    lineHeight = 19,
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
        page2Text(
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
   * PAGE 2 HEADER
   * ========================================
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
    130,
    9,
    regularFont,
    GRAY
  );

  /*
   * ========================================
   * TITLE
   * ========================================
   */

  const title =
    "TERMS & CONDITIONS";

  const titleFontSize = 18;

  const titleWidth =
    boldFont.widthOfTextAtSize(
      title,
      titleFontSize
    );

  page2.drawText(
    title,
    {
      x:
        PAGE_WIDTH / 2 -
        titleWidth / 2,
      y: y(220),
      size: titleFontSize,
      font: boldFont,
      color: BLUE,
    }
  );

  /*
   * ========================================
   * OFFER NUMBER
   * ========================================
   */

  const offerNoText =
    `Offer No: ${data.documentNumber}`;

  const offerNoWidth =
    regularFont.widthOfTextAtSize(
      offerNoText,
      9
    );

  page2.drawText(
    offerNoText,
    {
      x:
        PAGE_WIDTH -
        x(90) -
        offerNoWidth,
      y: y(245),
      size: 8.5,
      font: regularFont,
      color: GRAY,
    }
  );

  /*
   * ========================================
   * TERMS
   * ========================================
   */

  let termsY = 290;

  const terms = [
    {
      title:
        "1. Professional Conduct",
      text:
        "The intern is expected to maintain professional behavior, respectful communication, and appropriate conduct throughout the internship.",
    },
    {
      title:
        "2. Responsibilities",
      text:
        "The intern agrees to complete assigned tasks and responsibilities within the expected timelines and follow reasonable instructions provided by ManageMedia.",
    },
    {
      title:
        "3. Confidentiality",
      text:
        "The intern must maintain the confidentiality of company, client, project, technical, business, and other non-public information accessed during the internship.",
    },
    {
      title:
        "4. Intellectual Property",
      text:
        "Any work, materials, designs, code, documentation, or other deliverables created as part of assigned company work shall be subject to ManageMedia's applicable ownership and usage policies.",
    },
    {
      title:
        "5. Attendance & Communication",
      text:
        "The intern is expected to maintain reasonable availability and communicate promptly regarding delays, absences, or circumstances affecting assigned responsibilities.",
    },
    {
      title:
        "6. Termination",
      text:
        "ManageMedia or the intern may end the internship subject to the terms communicated by the organization.",
    },
    {
      title:
        "7. Completion Certificate",
      text:
        "A completion certificate may be issued upon successful completion of the internship and fulfillment of the applicable completion requirements.",
    },
    {
      title:
        "8. Acceptance",
      text:
        "By accepting this offer, the intern acknowledges that they have read and understood the internship terms and agree to fulfill the responsibilities associated with the role.",
    },
  ];

  /*
   * ========================================
   * DRAW TERMS
   * ========================================
   */

  for (
    const term of terms
  ) {
    page2Text(
      term.title,
      120,
      termsY,
      11.5,
      boldFont,
      BLUE
    );

    termsY += 30;

    termsY =
      page2Paragraph(
        term.text,
        120,
        termsY,
        1290,
        10.5,
        36,
        28
      );

    /*
     * Extra space between terms
     */
    termsY += 4;
  }

  /*
   * ========================================
   * PAGE 2 SIGNATURE
   * ========================================
   */

  page2Text(
    "With regards,",
    1060,
    1740,
    10.5,
    boldFont
  );

  page2.drawImage(
    signatureImage,
    {
      x: x(1035),
      y: y(1865),
      width: x(200),
      height: x(88),
    }
  );

  page2Text(
    "Authorized Signatory",
    1035,
    1935,
    10,
    boldFont
  );

  page2Text(
    "ManageMedia",
    1035,
    1960,
    10,
    regularFont,
    GRAY
  );

  /*
   * ========================================
   * PAGE 2 OFFER NUMBER
   * ========================================
   */

  page2Text(
    `Offer No: ${data.documentNumber}`,
    120,
    1935,
    9,
    regularFont,
    GRAY
  );

  /*
   * ========================================
   * FOOTER LINE
   * ========================================
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

  /*
   * ========================================
   * FOOTER
   * ========================================
   */

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
   * ========================================
   * RETURN PDF
   * ========================================
   */

  return await pdfDoc.save();
}