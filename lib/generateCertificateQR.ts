import QRCode from "qrcode";

export async function generateCertificateQR(
  certificateNumber: string
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://managemedia.in";

  const verificationUrl = `${baseUrl}/verify/${encodeURIComponent(
    certificateNumber
  )}`;

  const qrCode = await QRCode.toDataURL(
    verificationUrl,
    {
      width: 500,
      margin: 2,
      errorCorrectionLevel: "H",
    }
  );

  return {
    verificationUrl,
    qrCode,
  };
}