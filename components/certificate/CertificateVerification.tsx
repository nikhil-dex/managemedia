"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type DocumentType =
  | "certificate"
  | "offer-letter"
  | "joining-letter"
  | "lor";

interface VerifiedDocument {
  documentNumber: string;
  documentType: DocumentType;

  name: string;
  internship: string;
  duration: string;

  startDate: string;
  endDate: string;
  issueDate: string;

  workMode?: string;

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
  const [
    documentNumber,
    setDocumentNumber,
  ] = useState(initialCertificateNumber);

  const [
    document,
    setDocument,
  ] = useState<VerifiedDocument | null>(
    null
  );

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const autoVerifyStarted =
    useRef(false);

  /*
   * ==========================================
   * DOCUMENT TYPE
   * ==========================================
   */

  function getDocumentType(
    number: string
  ): DocumentType | null {
    const normalized =
      number.trim().toUpperCase();

    if (
      normalized.startsWith("MM-CERT-")
    ) {
      return "certificate";
    }

    if (
      normalized.startsWith("MM-OFFER-")
    ) {
      return "offer-letter";
    }

    if (
      normalized.startsWith("MM-JOIN-")
    ) {
      return "joining-letter";
    }

    if (
      normalized.startsWith("MM-LOR-")
    ) {
      return "lor";
    }

    return null;
  }

  /*
   * ==========================================
   * DOCUMENT TYPE LABEL
   * ==========================================
   */

  function getDocumentLabel(
    type: DocumentType
  ): string {
    switch (type) {
      case "certificate":
        return "Certificate";

      case "offer-letter":
        return "Offer Letter";

      case "joining-letter":
        return "Joining Letter";

      case "lor":
        return "Letter of Recommendation";
    }
  }

  /*
   * ==========================================
   * VERIFY DOCUMENT
   * ==========================================
   */

  const verifyDocument = useCallback(
  async (number: string) => {
    const normalizedNumber =
      number.trim().toUpperCase();

    if (!normalizedNumber) {
      setError(
        "Please enter a document number."
      );

      setDocument(null);

      return;
    }

    setLoading(true);
    setError("");
    setDocument(null);

    try {
      const type =
        getDocumentType(
          normalizedNumber
        );

      /*
       * ========================================
       * INVALID PREFIX
       * ========================================
       */

      if (!type) {
        setError(
          "Invalid document number. Please check the number and try again."
        );

        return;
      }

      /*
       * ========================================
       * CERTIFICATE
       * ========================================
       *
       * Certificates continue using the
       * existing certificate verification API.
       */

      if (type === "certificate") {
        const response =
          await fetch(
            "/api/certificates/verify",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                certificateNumber:
                  normalizedNumber,
              }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          setError(
            data.message ||
              "Certificate could not be verified."
          );

          return;
        }

        setDocument({
          documentNumber:
            data.certificate
              .certificateNumber,

          documentType:
            "certificate",

          name:
            data.certificate.name,

          internship:
            data.certificate.internship,

          duration:
            data.certificate.duration,

          startDate:
            data.certificate.startDate,

          endDate:
            data.certificate.endDate,

          issueDate:
            data.certificate.issueDate,

          status:
            data.certificate.status,
        });

        return;
      }

      /*
       * ========================================
       * OFFER / JOINING / LOR
       * ========================================
       */

      const response =
        await fetch(
          "/api/documents/verify",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              documentNumber:
                normalizedNumber,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Document could not be verified."
        );

        return;
      }

      setDocument(
        data.document
      );
    } catch (error) {
      console.error(
        "Document verification error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
    },
  []
);

  /*
   * ==========================================
   * AUTO VERIFY
   * ==========================================
   */

  useEffect(() => {
    if (
      !autoVerify ||
      !initialCertificateNumber ||
      autoVerifyStarted.current
    ) {
      return;
    }

    autoVerifyStarted.current =
      true;

    const timer =
      window.setTimeout(() => {
        verifyDocument(
          initialCertificateNumber
        );
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    autoVerify,
    initialCertificateNumber,
    verifyDocument,
  ]);

  /*
   * ==========================================
   * FORM SUBMIT
   * ==========================================
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    await verifyDocument(
      documentNumber
    );
  }

  /*
   * ==========================================
   * RESET
   * ==========================================
   */

  function handleReset() {
    setDocumentNumber("");
    setDocument(null);
    setError("");
  }

  /*
   * ==========================================
   * DOCUMENT LABEL
   * ==========================================
   */

  const documentLabel =
    document
      ? getDocumentLabel(
          document.documentType
        )
      : "Document";

  /*
   * ==========================================
   * UI
   * ==========================================
   */

  return (
    <main className="min-h-screen bg-black px-6 py-32 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}

        <div className="mb-12 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/50">
            ManageMedia
          </p>

          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Verify Document
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50">
            Enter a certificate or document
            number to verify the authenticity
            of a ManageMedia document.
          </p>
        </div>

        {/* Search Form */}

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl"
        >
          <label
            htmlFor="documentNumber"
            className="mb-3 block text-sm text-white/60"
          >
            Certificate / Document Number
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="documentNumber"
              type="text"
              value={documentNumber}
              onChange={(event) =>
                setDocumentNumber(
                  event.target.value.toUpperCase()
                )
              }
              placeholder="MM-OFFER-2026-XXXXXXXX"
              autoComplete="off"
              spellCheck={false}
              className="h-14 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm uppercase tracking-wider text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 rounded-full bg-white px-8 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify"}
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

        {/* Verified Document */}

        {document && (
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">

            {/* Verification Status */}

            <div className="mb-10 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                ✓
              </span>

              <div>
                <p className="text-sm font-medium text-emerald-400">
                  {documentLabel} Verified
                </p>

                <p className="text-xs text-white/40">
                  This {documentLabel.toLowerCase()} is valid.
                </p>
              </div>
            </div>

            {/* Document Type */}

            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Document Type
              </p>

              <h2 className="mt-2 text-2xl font-medium">
                {documentLabel}
              </h2>
            </div>

            {/* Holder */}

            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Document Holder
              </p>

              <h2 className="mt-2 text-3xl font-medium md:text-4xl">
                {document.name}
              </h2>
            </div>

            {/* Details */}

            <div className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">

              <Detail
                label="Internship"
                value={
                  document.internship
                }
              />

              <Detail
                label="Duration"
                value={
                  document.duration
                }
              />

              <Detail
                label="Internship Period"
                value={`${formatDate(
                  document.startDate
                )} – ${formatDate(
                  document.endDate
                )}`}
              />

              <Detail
                label="Date of Issue"
                value={formatDate(
                  document.issueDate
                )}
              />

              {document.workMode && (
                <Detail
                  label="Work Mode"
                  value={
                    document.workMode
                  }
                />
              )}

              <Detail
                label="Document Number"
                value={
                  document.documentNumber
                }
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
                Verify another document
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/*
 * ==========================================
 * DETAIL
 * ==========================================
 */

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

/*
 * ==========================================
 * DATE FORMAT
 * ==========================================
 */

function formatDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(date));
}