import { NextRequest, NextResponse } from "next/server";
import { generateJoiningLetterPDF } from "@/lib/generateJoiningLetterPDF";

export async function POST(request: NextRequest) {
  try {
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
     * JOINING NUMBER
     * ==========================================
     */

    const year = new Date().getFullYear();

    const randomPart =
      Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    const documentNumber =
      `MM-JOIN-${year}-${randomPart}`;

    /*
     * ==========================================
     * GENERATE PDF
     * ==========================================
     */

    const pdfBytes =
      await generateJoiningLetterPDF({
        documentNumber,
        name,
        internship,
        duration,
        startDate,
        endDate,
        issueDate,
        workMode,
      });

    /*
     * ==========================================
     * PDF RESPONSE
     * ==========================================
     */

    return new NextResponse(
      Buffer.from(pdfBytes),
      {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            `attachment; filename="ManageMedia-Joining-Letter-${documentNumber}.pdf"`,
          "Cache-Control":
            "no-store, max-age=0",
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
          "Failed to generate joining letter.",
      },
      {
        status: 500,
      }
    );
  }
}