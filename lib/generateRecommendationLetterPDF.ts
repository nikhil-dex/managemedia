import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";
import fs from "fs/promises";
import path from "path";

interface RecommendationLetterData {
  documentNumber: string;
  name: string;
  internship: string;
  duration: string;
  startDate: Date;
  endDate: Date;
  issueDate: Date;
  workMode: string;
  performance?: string;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function drawWrappedText(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  font: Awaited<
    ReturnType<PDFDocument["embedFont"]>
  >,
  size: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    const width = font.widthOfTextAtSize(
      testLine,
      size
    );

    if (
      width <= maxWidth ||
      !currentLine
    ) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  for (const line of lines) {
    page.drawText(line, {
      x,
      y,
      size,
      font,
      color: rgb(0.12, 0.12, 0.12),
    });

    y -= lineHeight;
  }

  return y;
}

export async function generateRecommendationLetterPDF(
  data: RecommendationLetterData
): Promise<Uint8Array> {
  const pdfDoc =
    await PDFDocument.create();

  const page = pdfDoc.addPage([
    595.28,
    841.89,
  ]);

  const {
    width,
    height,
  } = page.getSize();

  const regularFont =
    await pdfDoc.embedFont(
      StandardFonts.Helvetica
    );

  const boldFont =
    await pdfDoc.embedFont(
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

const signatureBytes =
  await fs.readFile(signaturePath);

const signatureImage =
  await pdfDoc.embedPng(
    signatureBytes
  );

  /*
   * ==========================================
   * COLORS
   * ==========================================
   */

  const black = rgb(
    0.05,
    0.05,
    0.05
  );

  const muted = rgb(
    0.4,
    0.4,
    0.4
  );

  const lightBorder = rgb(
    0.86,
    0.86,
    0.86
  );

  /*
   * ==========================================
   * PAGE MARGINS
   * ==========================================
   */

  const margin = 58;
  const contentWidth =
    width - margin * 2;

  /*
   * ==========================================
   * HEADER
   * ==========================================
   */

  page.drawText(
    "MANAGEMEDIA",
    {
      x: margin,
      y: height - 65,
      size: 15,
      font: boldFont,
      color: black,
    }
  );

  page.drawText(
    "Internship & Digital Services",
    {
      x: margin,
      y: height - 82,
      size: 7.5,
      font: regularFont,
      color: muted,
    }
  );

  page.drawLine({
    start: {
      x: margin,
      y: height - 100,
    },
    end: {
      x: width - margin,
      y: height - 100,
    },
    thickness: 0.8,
    color: lightBorder,
  });

  /*
   * ==========================================
   * DOCUMENT INFORMATION
   * ==========================================
   */

  page.drawText(
    "LETTER OF RECOMMENDATION",
    {
      x: margin,
      y: height - 145,
      size: 19,
      font: boldFont,
      color: black,
    }
  );

  page.drawText(
    `Document No.  ${data.documentNumber}`,
    {
      x: margin,
      y: height - 168,
      size: 8,
      font: regularFont,
      color: muted,
    }
  );

  page.drawText(
    `Date: ${formatDate(data.issueDate)}`,
    {
      x:
        width -
        margin -
        regularFont.widthOfTextAtSize(
          `Date: ${formatDate(
            data.issueDate
          )}`,
          8
        ),
      y: height - 168,
      size: 8,
      font: regularFont,
      color: muted,
    }
  );

  /*
   * ==========================================
   * RECIPIENT
   * ==========================================
   */

  let y = height - 225;

  page.drawText(
    "TO WHOM IT MAY CONCERN",
    {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: black,
    }
  );

  y -= 32;

  /*
   * ==========================================
   * INTRODUCTION
   * ==========================================
   */

  const introduction =
    `This letter is to recommend ${data.name}, who successfully completed an internship with ManageMedia as a ${data.internship}. The internship was carried out from ${formatDate(
      data.startDate
    )} to ${formatDate(
      data.endDate
    )}, for a total duration of ${data.duration}.`;

  y = drawWrappedText(
    page,
    introduction,
    margin,
    y,
    contentWidth,
    regularFont,
    10.5,
    17
  );

  y -= 14;

  /*
   * ==========================================
   * EXPERIENCE
   * ==========================================
   */

  const experience =
    `During the internship, ${data.name} worked in a ${data.workMode.toLowerCase()} environment and demonstrated a professional attitude toward assigned responsibilities. The internship provided practical exposure to the work expected in the role and required consistent participation, learning, and completion of assigned tasks.`;

  y = drawWrappedText(
    page,
    experience,
    margin,
    y,
    contentWidth,
    regularFont,
    10.5,
    17
  );

  y -= 14;

  /*
   * ==========================================
   * PERFORMANCE
   * ==========================================
   */

  const performance =
    data.performance?.trim() ||
    `${data.name} demonstrated dedication, willingness to learn, and a responsible approach to the internship. They were able to adapt to assigned responsibilities and complete the work expected during the internship period.`;

  y = drawWrappedText(
    page,
    performance,
    margin,
    y,
    contentWidth,
    regularFont,
    10.5,
    17
  );

  y -= 14;

  /*
   * ==========================================
   * RECOMMENDATION
   * ==========================================
   */

  const recommendation =
    `Based on the internship experience, we are pleased to recommend ${data.name} for future academic and professional opportunities. We believe the experience gained during the internship will serve as a valuable foundation for continued growth and development.`;

  y = drawWrappedText(
    page,
    recommendation,
    margin,
    y,
    contentWidth,
    regularFont,
    10.5,
    17
  );

  y -= 24;

  /*
   * ==========================================
   * CLOSING
   * ==========================================
   */

  const closing =
    `We wish ${data.name} continued success in their future endeavors.`;

  y = drawWrappedText(
    page,
    closing,
    margin,
    y,
    contentWidth,
    regularFont,
    10.5,
    17
  );

  /*
   * ==========================================
   * SIGNATURE
   * ==========================================
   */

  y -= 48;

page.drawText(
  "Sincerely,",
  {
    x: margin,
    y,
    size: 10,
    font: regularFont,
    color: black,
  }
);

/*
 * ==========================================
 * SIGNATURE IMAGE
 * ==========================================
 */

y -= 18;

page.drawImage(
  signatureImage,
  {
    x: margin,
    y: y - 20,
    width: 120,
    height: 54,
  }
);

y -= 75;

page.drawText(
  "Authorized Signatory",
  {
    x: margin,
    y,
    size: 10,
    font: boldFont,
    color: black,
  }
);

y -= 17;

page.drawText(
  "ManageMedia",
  {
    x: margin,
    y,
    size: 9,
    font: regularFont,
    color: muted,
  }
);
  /*
   * ==========================================
   * FOOTER
   * ==========================================
   */

  page.drawLine({
    start: {
      x: margin,
      y: 52,
    },
    end: {
      x: width - margin,
      y: 52,
    },
    thickness: 0.7,
    color: lightBorder,
  });

  page.drawText(
    "ManageMedia • Internship Documentation",
    {
      x: margin,
      y: 35,
      size: 7,
      font: regularFont,
      color: muted,
    }
  );

  const verificationText =
    `Document No. ${data.documentNumber}`;

  page.drawText(
    verificationText,
    {
      x:
        width -
        margin -
        regularFont.widthOfTextAtSize(
          verificationText,
          7
        ),
      y: 35,
      size: 7,
      font: regularFont,
      color: muted,
    }
  );

  return pdfDoc.save();
}