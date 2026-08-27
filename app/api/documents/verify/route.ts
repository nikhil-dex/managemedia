import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const documentNumber =
      typeof body.documentNumber === "string"
        ? body.documentNumber.trim().toUpperCase()
        : "";

    if (!documentNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Document number is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * CONNECT DATABASE
     * ==========================================
     */

    await connectDB();

    /*
     * ==========================================
     * FIND DOCUMENT
     * ==========================================
     */

    const document =
      await Document.findOne({
        documentNumber,
      }).lean();

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ==========================================
     * CHECK STATUS
     * ==========================================
     */

    if (document.status !== "valid") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This document is no longer valid.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * ==========================================
     * RETURN VERIFIED DOCUMENT
     * ==========================================
     */

    return NextResponse.json({
      success: true,
      document: {
        documentNumber:
          document.documentNumber,

        documentType:
          document.documentType,

        name: document.name,

        internship:
          document.internship,

        duration:
          document.duration,

        startDate:
          document.startDate,

        endDate:
          document.endDate,

        issueDate:
          document.issueDate,

        workMode:
          document.workMode,

        status:
          document.status,
      },
    });
  } catch (error) {
    console.error(
      "Document verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to verify document.",
      },
      {
        status: 500,
      }
    );
  }
}