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

const PAGE_WIDTH = 612;
const PAGE_HEIGHT =
  (TEMPLATE_HEIGHT / TEMPLATE_WIDTH) * PAGE_WIDTH;

const SCALE = PAGE_WIDTH / TEMPLATE_WIDTH;

const BLACK = rgb(0.05, 0.07, 0.09);
const BLUE = rgb(0.02, 0.42, 0.65);
const GRAY = rgb(0.30, 0.32, 0.34);
const LIGHT_BLUE = rgb(0.82, 0.90, 0.95);
const WHITE = rgb(1, 1, 1);

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
   * PAGE 1
   * ==========================================
   */

  const page1 = pdfDoc.addPage([
    PAGE_WIDTH,
    PAGE_HEIGHT,
  ]);

  /*
   * Offer letter template
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

  page1.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });

  /*
   * ==========================================
   * PAGE 1 HELPERS
   * ==========================================
   */

  function drawText(
    text: string,
    x: number,
    topY: number,
    size = 16,
    font = regularFont,
    color = BLACK
  ) {
    page1.drawText(text, {
      x: px(x),
      y: yFromTop(topY),
      size: px(size),
      font,
      color,
    });
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
   * ==========================================
   * ISSUE DATE
   * ==========================================
   */

  const issueDate = formatDate(
    data.issueDate
  );

  const issueDateWidth =
    boldFont.widthOfTextAtSize(
      issueDate,
      px(17)
    );

  page1.drawText(issueDate, {
    x: px(1370) - issueDateWidth,
    y: yFromTop(285),
    size: px(17),
    font: boldFont,
    color: BLACK,
  });

  /*
   * ==========================================
   * RECIPIENT
   * ==========================================
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
   * ==========================================
   * GREETING
   * ==========================================
   */

  drawText(
    `Dear ${data.name},`,
    155,
    610,
    17
  );

  /*
   * ==========================================
   * OFFER INTRODUCTION
   * ==========================================
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
   * ==========================================
   * INTERNSHIP DETAILS
   * ==========================================
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
    16
  );

  y += 30;

  drawText(
    `Duration: ${data.duration}`,
    175,
    y,
    16
  );

  y += 30;

  drawText(
    `Start Date: ${formatDate(
      data.startDate
    )}`,
    175,
    y,
    16
  );

  y += 30;

  drawText(
    `End Date: ${formatDate(
      data.endDate
    )}`,
    175,
    y,
    16
  );

  y += 30;

  drawText(
    `Work Mode: ${data.workMode}`,
    175,
    y,
    16
  );

  y += 30;

  drawText(
    `Stipend: ${data.stipend}`,
    175,
    y,
    16
  );

  /*
   * ==========================================
   * MAIN BODY
   * ==========================================
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
    `We look forward to your contribution and wish you a productive and valuable learning experience with ManageMedia.`,
    155,
    y,
    1225,
    16,
    26
  );

  /*
   * ==========================================
   * ACCEPTANCE
   * ==========================================
   */

  y += 25;

  drawParagraph(
    `Please confirm your acceptance of this internship offer through the communication channel provided by ManageMedia.`,
    155,
    y,
    1225,
    16,
    26
  );

  /*
   * ==========================================
   * DOCUMENT NUMBER
   * ==========================================
   */

  drawText(
    `Offer No: ${data.documentNumber}`,
    155,
    1850,
    12,
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
   * Background
   */

  page2.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: WHITE,
  });

  /*
   * ==========================================
   * PAGE 2 HEADER
   * ==========================================
   */

  page2.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - px(38),
    width: PAGE_WIDTH,
    height: px(38),
    color: BLUE,
  });

  page2.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - px(68),
    width: px(210),
    height: px(18),
    color: LIGHT_BLUE,
  });

  page2.drawLine({
    start: {
      x: px(60),
      y: PAGE_HEIGHT - px(105),
    },
    end: {
      x: PAGE_WIDTH - px(60),
      y: PAGE_HEIGHT - px(105),
    },
    thickness: 1.2,
    color: BLUE,
  });

  /*
   * Logo
   */

  const logoPath = path.join(
    process.cwd(),
    "public",
    "logo.jpg"
  );

  const logoBytes = await readFile(logoPath);

  const logoImage =
    await pdfDoc.embedJpg(logoBytes);

  page2.drawImage(logoImage, {
    x: px(205),
    y: PAGE_HEIGHT - px(180),
    width: px(155),
    height: px(75),
  });

  /*
   * ==========================================
   * PAGE 2 HELPERS
   * ==========================================
   */

  function page2Text(
    text: string,
    x: number,
    topY: number,
    size = 11,
    font = regularFont,
    color = BLACK
  ) {
    page2.drawText(text, {
      x: px(x),
      y: yFromTop(topY),
      size: px(size),
      font,
      color,
    });
  }

  function page2Paragraph(
    text: string,
    x: number,
    topY: number,
    maxWidth: number,
    size = 11,
    lineHeight = 17,
    font = regularFont,
    color = BLACK
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

    lines.forEach((line, index) => {
      page2Text(
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
   * ==========================================
   * PAGE 2 TITLE
   * ==========================================
   */

  const termsTitle =
    "TERMS & CONDITIONS";

  const titleWidth =
    boldFont.widthOfTextAtSize(
      termsTitle,
      px(22)
    );

  page2.drawText(termsTitle, {
    x:
      PAGE_WIDTH / 2 -
      titleWidth / 2,
    y: yFromTop(235),
    size: px(22),
    font: boldFont,
    color: BLUE,
  });

  /*
   * ==========================================
   * TERMS
   * ==========================================
   */

  let ty = 295;

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
  ];

  for (const term of terms) {
    page2Text(
      term.title,
      75,
      ty,
      11,
      boldFont,
      BLUE
    );

    ty += 22;

    ty = page2Paragraph(
      term.text,
      75,
      ty,
      460,
      10,
      15
    );

    ty += 25;
  }

  /*
   * ==========================================
   * ACCEPTANCE
   * ==========================================
   */

  page2Text(
    "8. Acceptance",
    75,
    ty,
    11,
    boldFont,
    BLUE
  );

  ty += 22;

  ty = page2Paragraph(
    "By accepting this offer, the intern acknowledges that they have read and understood the internship terms and agree to fulfill the responsibilities associated with the role.",
    75,
    ty,
    460,
    10,
    15
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

  page2Text(
    "With regards,",
    380,
    1660,
    10
  );

  page2.drawImage(signatureImage, {
    x: px(370),
    y: yFromTop(1765),
    width: px(145),
    height: px(70),
  });

  page2Text(
    "Authorized Signatory",
    370,
    1840,
    9.5,
    boldFont
  );

  page2Text(
    "ManageMedia",
    370,
    1860,
    9,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * DOCUMENT NUMBER
   * ==========================================
   */

  page2Text(
    `Offer No: ${data.documentNumber}`,
    75,
    1840,
    8,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * PAGE 2 FOOTER
   * ==========================================
   */

  page2.drawLine({
    start: {
      x: px(75),
      y: px(58),
    },
    end: {
      x: PAGE_WIDTH - px(75),
      y: px(58),
    },
    thickness: 0.7,
    color: LIGHT_BLUE,
  });

  page2Text(
    "Managemedia2019@gmail.com",
    75,
    1980,
    7.5,
    regularFont,
    GRAY
  );

  page2Text(
    "+91-9315226146",
    300,
    1980,
    7.5,
    regularFont,
    GRAY
  );

  page2Text(
    "New Delhi / India",
    445,
    1980,
    7.5,
    regularFont,
    GRAY
  );

  /*
   * ==========================================
   * PAGE 2 DECORATION
   * ==========================================
   */

  page2.drawRectangle({
    x: PAGE_WIDTH - px(105),
    y: 0,
    width: px(105),
    height: px(18),
    color: BLUE,
  });

  page2.drawRectangle({
    x: PAGE_WIDTH - px(70),
    y: px(18),
    width: px(70),
    height: px(12),
    color: LIGHT_BLUE,
  });

  /*
   * ==========================================
   * RETURN PDF
   * ==========================================
   */

  return await pdfDoc.save();
}