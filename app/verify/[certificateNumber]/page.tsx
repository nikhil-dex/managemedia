import CertificateVerification from "@/components/certificate/CertificateVerification";

interface VerifyCertificatePageProps {
  params: Promise<{
    certificateNumber: string;
  }>;
}

export default async function VerifyCertificatePage({
  params,
}: VerifyCertificatePageProps) {
  const { certificateNumber } = await params;

  return (
    <CertificateVerification
      initialCertificateNumber={certificateNumber}
      autoVerify
    />
  );
}