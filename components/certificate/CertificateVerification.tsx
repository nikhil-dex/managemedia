"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface Certificate {
  certificateNumber: string;
  name: string;
  internship: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  status: string;
}

interface CertificateVerificationProps {
  initialCertificateNumber?: string;
  autoVerify?: boolean;
}

export default function CertificateVerification({
  initialCertificateNumber = "",
  autoVerify = false,
}: CertificateVerificationProps) {
  const [certificateNumber, setCertificateNumber] = useState(
    initialCertificateNumber
  );

  const [certificate, setCertificate] =
    useState<Certificate | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const autoVerifyStarted = useRef(false);

  async function verifyCertificate(number: string) {
    const normalizedNumber = number.trim().toUpperCase();

    if (!normalizedNumber) {
      setError("Please enter a certificate number.");
      setCertificate(null);
      return;
    }

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const response = await fetch(
        "/api/certificates/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            certificateNumber: normalizedNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Certificate could not be verified."
        );
        return;
      }

      setCertificate(data.certificate);
    } catch (error) {
      console.error(
        "Certificate verification error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  if (
    !autoVerify ||
    !initialCertificateNumber ||
    autoVerifyStarted.current
  ) {
    return;
  }

  autoVerifyStarted.current = true;

  const timer = window.setTimeout(() => {
    verifyCertificate(initialCertificateNumber);
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [autoVerify, initialCertificateNumber]);
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    await verifyCertificate(certificateNumber);
  }

  function handleReset() {
    setCertificateNumber("");
    setCertificate(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-black px-6 py-32 text-white">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/50">
            ManageMedia
          </p>

          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Verify Certificate
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50">
            Enter the certificate number to verify
            the authenticity of a ManageMedia
            certificate.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl"
        >
          <label
            htmlFor="certificateNumber"
            className="mb-3 block text-sm text-white/60"
          >
            Certificate Number
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="certificateNumber"
              type="text"
              value={certificateNumber}
              onChange={(event) =>
                setCertificateNumber(
                  event.target.value.toUpperCase()
                )
              }
              placeholder="MM-XXXX-XXXX-XXXX"
              autoComplete="off"
              spellCheck={false}
              className="h-14 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm uppercase tracking-wider text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 rounded-full bg-white px-8 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-center">
            <div className="mb-3 text-2xl text-red-400">
              ×
            </div>

            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Verified Certificate */}
        {certificate && (
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
            {/* Verification Status */}
            <div className="mb-10 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                ✓
              </span>

              <div>
                <p className="text-sm font-medium text-emerald-400">
                  Certificate Verified
                </p>

                <p className="text-xs text-white/40">
                  This certificate is valid.
                </p>
              </div>
            </div>

            {/* Certificate Holder */}
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Certificate Holder
              </p>

              <h2 className="mt-2 text-3xl font-medium md:text-4xl">
                {certificate.name}
              </h2>
            </div>

            {/* Certificate Details */}
            <div className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
              <Detail
                label="Internship"
                value={certificate.internship}
              />

              <Detail
                label="Duration"
                value={certificate.duration}
              />

              <Detail
                label="Internship Period"
                value={`${formatDate(
                  certificate.startDate
                )} – ${formatDate(
                  certificate.endDate
                )}`}
              />

              <Detail
                label="Date of Issue"
                value={formatDate(
                  certificate.issueDate
                )}
              />

              <Detail
                label="Certificate Number"
                value={certificate.certificateNumber}
              />

              <Detail
                label="Status"
                value="Valid"
              />
            </div>

            {/* Verify Another */}
            <div className="mt-10 border-t border-white/10 pt-8 text-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-white/50 underline underline-offset-4 transition hover:text-white"
              >
                Verify another certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm text-white/80">
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}