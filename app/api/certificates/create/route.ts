import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

function generateCertificateNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const randomPart = Array.from(
    crypto.randomBytes(12),
    (byte) => chars[byte % chars.length]
  ).join("");

  return `MM-${randomPart.slice(0, 4)}-${randomPart.slice(
    4,
    8
  )}-${randomPart.slice(8, 12)}`;
}

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
    } = body;

    if (
      !name ||
      !internship ||
      !duration ||
      !startDate ||
      !endDate ||
      !issueDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All certificate fields are required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    let certificateNumber = generateCertificateNumber();

    while (
      await Certificate.exists({
        certificateNumber,
      })
    ) {
      certificateNumber = generateCertificateNumber();
    }

    const certificate = await Certificate.create({
      certificateNumber,
      name: name.trim(),
      internship: internship.trim(),
      duration: duration.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      issueDate: new Date(issueDate),
      status: "valid",
    });

    return NextResponse.json(
      {
        success: true,
        certificate: {
          certificateNumber:
            certificate.certificateNumber,
          name: certificate.name,
          internship: certificate.internship,
          duration: certificate.duration,
          startDate: certificate.startDate,
          endDate: certificate.endDate,
          issueDate: certificate.issueDate,
          status: certificate.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Certificate creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create certificate.",
      },
      { status: 500 }
    );
  }
}