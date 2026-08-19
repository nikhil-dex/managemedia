import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CertificateAdmin from "./CertificateAdmin";

export default async function CertificatesAdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return <CertificateAdmin />;
}