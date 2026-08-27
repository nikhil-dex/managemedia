import { NextRequest, NextResponse } from "next/server";
import { generateOfferLetterPDF } from "@/lib/generateOfferLetterPDF";
import { auth } from "@/auth";

function generateOfferNumber() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let random = "";

  for (let i = 0; i < 8; i++) {
    random += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return `MM-OFFER-${new Date().getFullYear()}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    /*
     * ==========================================
     * AUTHENTICATION
     * ==========================================
     */

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ==========================================
     * REQUEST BODY
     * ==========================================
     */

    const body = await request.json();

    const {
      name,
      internship,
      duration,
      startDate,
      endDate,
      issueDate,
      stipend,
      workMode,
    } = body;

    /*
     * ==========================================
     * VALIDATION
     * ==========================================
     */

    if (
      !name ||
      !internship ||
      !duration ||
      !startDate ||
      !endDate ||
      !issueDate ||
      !stipend ||
      !workMode
    ) {
      return NextResponse.json(
        {
          error:
            "All offer letter fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * VALIDATE DATES
     * ==========================================
     */

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    const parsedIssueDate = new Date(issueDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime()) ||
      Number.isNaN(parsedIssueDate.getTime())
    ) {
      return NextResponse.json(
        {
          error: "One or more dates are invalid.",
        },
        {
          status: 400,
        }
      );
    }

    if (parsedEndDate < parsedStartDate) {
      return NextResponse.json(
        {
          error:
            "End date cannot be before the start date.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * GENERATE DOCUMENT NUMBER
     * ==========================================
     */

    const documentNumber =
      generateOfferNumber();

    /*
     * ==========================================
     * GENERATE PDF
     * ==========================================
     */

    const pdfBytes =
      await generateOfferLetterPDF({
        documentNumber,
        name: String(name).trim(),
        internship: String(internship).trim(),
        duration: String(duration).trim(),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        issueDate: parsedIssueDate,
        stipend: String(stipend).trim(),
        workMode: String(workMode).trim(),
      });

    /*
     * ==========================================
     * RETURN PDF
     * ==========================================
     */

    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ManageMedia-Offer-Letter-${documentNumber}.pdf"`,
        "Content-Length":
          pdfBuffer.length.toString(),
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error(
      "Offer letter generation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate offer letter.",
      },
      {
        status: 500,
      }
    );
  }
}