import { NextRequest, NextResponse } from "next/server";
import { generateRecommendationLetterPDF } from "@/lib/generateRecommendationLetterPDF";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";

function generateLORNumber() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let random = "";

  for (let i = 0; i < 8; i++) {
    random += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return `MM-LOR-${new Date().getFullYear()}-${random}`;
}

export async function POST(
  request: NextRequest
) {
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
      workMode,
      performance,
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
      !workMode
    ) {
      return NextResponse.json(
        {
          error:
            "All required LOR fields are required.",
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

    const parsedStartDate =
      new Date(startDate);

    const parsedEndDate =
      new Date(endDate);

    const parsedIssueDate =
      new Date(issueDate);

    if (
      Number.isNaN(
        parsedStartDate.getTime()
      ) ||
      Number.isNaN(
        parsedEndDate.getTime()
      ) ||
      Number.isNaN(
        parsedIssueDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "One or more dates are invalid.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      parsedEndDate <
      parsedStartDate
    ) {
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
     * CLEAN INPUT
     * ==========================================
     */

    const cleanData = {
      name: String(name).trim(),

      internship:
        String(internship).trim(),

      duration:
        String(duration).trim(),

      startDate:
        parsedStartDate,

      endDate:
        parsedEndDate,

      issueDate:
        parsedIssueDate,

      workMode:
        String(workMode).trim(),

      performance:
        typeof performance === "string"
          ? performance.trim()
          : undefined,
    };

    /*
     * ==========================================
     * GENERATE LOR NUMBER
     * ==========================================
     */

    const documentNumber =
      generateLORNumber();

    /*
     * ==========================================
     * CONNECT DATABASE
     * ==========================================
     */

    await connectDB();

    /*
     * ==========================================
     * GENERATE PDF
     * ==========================================
     */

    const pdfBytes =
      await generateRecommendationLetterPDF({
        documentNumber,

        name: cleanData.name,

        internship:
          cleanData.internship,

        duration:
          cleanData.duration,

        startDate:
          cleanData.startDate,

        endDate:
          cleanData.endDate,

        issueDate:
          cleanData.issueDate,

        workMode:
          cleanData.workMode,

        performance:
          cleanData.performance,
      });

    /*
     * ==========================================
     * SAVE DOCUMENT RECORD
     * ==========================================
     */

    await Document.create({
      documentNumber,

      documentType:
        "lor",

      name:
        cleanData.name,

      internship:
        cleanData.internship,

      duration:
        cleanData.duration,

      startDate:
        cleanData.startDate,

      endDate:
        cleanData.endDate,

      issueDate:
        cleanData.issueDate,

      workMode:
        cleanData.workMode,

      status:
        "valid",
    });

    /*
     * ==========================================
     * RETURN PDF
     * ==========================================
     */

    const pdfBuffer =
      Buffer.from(pdfBytes);

    return new NextResponse(
      pdfBuffer,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="ManageMedia-LOR-${documentNumber}.pdf"`,

          "Content-Length":
            pdfBuffer.length.toString(),

          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "LOR generation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate letter of recommendation.",
      },
      {
        status: 500,
      }
    );
  }
}