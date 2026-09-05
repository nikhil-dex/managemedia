import { NextRequest, NextResponse } from "next/server";
import { generateJoiningLetterPDF } from "@/lib/generateJl";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";

function generateJoiningNumber() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let random = "";

  for (let i = 0; i < 8; i++) {
    random += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return `MM-JOIN-${new Date().getFullYear()}-${random}`;
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
            "All joining letter fields are required.",
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
    };

    /*
     * ==========================================
     * GENERATE JOINING NUMBER
     * ==========================================
     */

    const documentNumber =
      generateJoiningNumber();

    /*
     * ==========================================
     * CONNECT DATABASE
     * ==========================================
     */

    await connectDB();

    /*
     * ==========================================
     * SAVE DOCUMENT RECORD
     * ==========================================
     */

    await Document.create({
      documentNumber,
      documentType: "joining-letter",

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

      status: "valid",
    });

    /*
     * ==========================================
     * GENERATE PDF
     * ==========================================
     */

    const pdfBytes =
      await generateJoiningLetterPDF({
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
      });

    /*
     * ==========================================
     * PDF RESPONSE
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
            `attachment; filename="ManageMedia-Joining-Letter-${documentNumber}.pdf"`,

          "Content-Length":
            pdfBuffer.length.toString(),

          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Joining letter generation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate joining letter.",
      },
      {
        status: 500,
      }
    );
  }
}