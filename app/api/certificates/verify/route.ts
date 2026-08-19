import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

export async function POST(request: NextRequest) {
  try {
    const { certificateNumber } = await request.json();

    if (!certificateNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate number is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const certificate = await Certificate.findOne({
      certificateNumber: certificateNumber.trim().toUpperCase(),
    }).lean();

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found",
        },
        { status: 404 }
      );
    }

    if (certificate.status !== "valid") {
      return NextResponse.json(
        {
          success: false,
          message: "This certificate is no longer valid",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        name: certificate.name,
        internship: certificate.internship,
        duration: certificate.duration,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
        issueDate: certificate.issueDate,
        status: certificate.status,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify certificate",
      },
      { status: 500 }
    );
  }
}