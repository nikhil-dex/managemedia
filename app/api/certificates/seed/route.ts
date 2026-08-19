import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

export async function POST() {
  try {
    await connectDB();

    const certificate = await Certificate.findOneAndUpdate(
      {
        certificateNumber: "MM-INT-2026-0001",
      },
      {
        certificateNumber: "MM-INT-2026-0001",
        name: "Nikhil",
        internship: "Web Development Intern",
        duration: "1 Month",
        startDate: new Date("2026-07-15"),
        endDate: new Date("2026-08-15"),
        issueDate: new Date("2026-08-20"),
        status: "valid",
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Test certificate created",
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
    console.error("Certificate seed error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create test certificate",
      },
      { status: 500 }
    );
  }
}