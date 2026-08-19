import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import { generateCertificatePDF } from "@/lib/generateCertificatePDF";

interface RouteProps {
  params: Promise<{
    certificateNumber: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteProps
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new Response(
        "Unauthorized",
        { status: 401 }
      );
    }

    const { certificateNumber } =
      await params;

    await connectDB();

    const certificate =
      await Certificate.findOne({
        certificateNumber:
          certificateNumber
            .trim()
            .toUpperCase(),
      }).lean();

    if (!certificate) {
      return new Response(
        "Certificate not found",
        { status: 404 }
      );
    }

    const pdfBytes =
      await generateCertificatePDF({
        certificateNumber:
          certificate.certificateNumber,
        name: certificate.name,
        internship:
          certificate.internship,
        duration:
          certificate.duration,
        startDate:
          certificate.startDate,
        endDate:
          certificate.endDate,
        issueDate:
          certificate.issueDate,
      });

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type":
          "application/pdf",
        "Content-Disposition":
          `attachment; filename="ManageMedia-${certificate.certificateNumber}.pdf"`,
      },
    });
  }   catch (error) {
    console.error("Certificate PDF error:", error);

    return new Response(
      process.env.NODE_ENV === "development"
        ? `Certificate PDF error: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        : "Unable to generate certificate",
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  }}