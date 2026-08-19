"use client";


import { FormEvent, useState } from "react";

interface CreatedCertificate {
  certificateNumber: string;
  name: string;
  internship: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  status: string;
}

export default function CertificatesAdminPage() {
  const [form, setForm] = useState({
    name: "",
    internship: "Web Development Intern",
    duration: "1 Month",
    startDate: "",
    endDate: "",
    issueDate: "",
  });

  const [certificate, setCertificate] =
    useState<CreatedCertificate | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const response = await fetch(
        "/api/certificates/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to create certificate."
        );
        return;
      }

      setCertificate(data.certificate);
    } catch (error) {
      console.error(
        "Certificate creation error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCertificate(null);
    setError("");

    setForm({
      name: "",
      internship: "Web Development Intern",
      duration: "1 Month",
      startDate: "",
      endDate: "",
      issueDate: "",
    });
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/40">
            ManageMedia
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Create Certificate
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/45">
            Create an internship certificate and
            generate a unique certificate number for
            verification.
          </p>
        </div>

        {!certificate ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10"
          >
            <div className="grid gap-7">
              <Field
                label="Intern Name"
                value={form.name}
                placeholder="Enter intern's full name"
                onChange={(value) =>
                  updateField("name", value)
                }
                required
              />
              

              <div>
                <label
                  htmlFor="internship"
                  className="mb-3 block text-sm text-white/60"
                >
                  Internship
                </label>

                <select
                  id="internship"
                  value={form.internship}
                  onChange={(event) =>
                    updateField(
                      "internship",
                      event.target.value
                    )
                  }
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black px-5 text-sm text-white outline-none transition focus:border-white/30"
                >
                  <option>
                    Web Development Intern
                  </option>
                  <option>
                    Digital Marketing Intern
                  </option>
                  <option>
                    Social Media Marketing Intern
                  </option>
                  <option>
                    Graphic Design Intern
                  </option>
                  <option>
                    Data Analyst Intern
                  </option>
                  <option>
                    Other
                  </option>
                </select>
              </div>

              <Field
                label="Duration"
                value={form.duration}
                placeholder="e.g. 1 Month"
                onChange={(value) =>
                  updateField("duration", value)
                }
                required
              />

              <div className="grid gap-6 sm:grid-cols-3">
                <DateField
                  label="Start Date"
                  value={form.startDate}
                  onChange={(value) =>
                    updateField("startDate", value)
                  }
                  required
                />

                <DateField
                  label="End Date"
                  value={form.endDate}
                  onChange={(value) =>
                    updateField("endDate", value)
                  }
                  required
                />

                <DateField
                  label="Issue Date"
                  value={form.issueDate}
                  onChange={(value) =>
                    updateField("issueDate", value)
                  }
                  required
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4">
                  <p className="text-sm text-red-300">
                    {error}
                  </p>
                </div>
              )}


              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-14 rounded-full bg-white px-8 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating Certificate..."
                  : "Generate Certificate"}
              </button>
              
              
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6 md:p-10">
            <div className="mb-10 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                ✓
              </span>

              <div>
                <p className="text-sm font-medium text-emerald-400">
                  Certificate Created
                </p>

                <p className="text-xs text-white/40">
                  The certificate has been saved
                  successfully.
                </p>
              </div>
            </div>

            <div className="grid gap-6 border-b border-white/10 pb-8 sm:grid-cols-2">
              <Detail
                label="Intern"
                value={certificate.name}
              />

              <Detail
                label="Internship"
                value={certificate.internship}
              />

              <Detail
                label="Duration"
                value={certificate.duration}
              />

              <Detail
                label="Certificate Number"
                value={certificate.certificateNumber}
              />
            </div>

            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-white/35">
                Verification URL
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  readOnly
                  value={`https://managemedia.in/verify/${certificate.certificateNumber}`}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 text-xs text-white/60 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      `https://managemedia.in/verify/${certificate.certificateNumber}`
                    )
                  }
                  className="h-12 rounded-xl border border-white/10 px-5 text-xs transition hover:bg-white/5"
                >
                  Copy URL
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
    type="button"
    onClick={() =>
      window.open(
        `/api/certificates/${certificate.certificateNumber}/pdf`,
        "_blank"
      )
    }
    className="h-12 rounded-full bg-white px-6 text-sm font-medium text-black transition hover:bg-white/90"
  >
    Download Certificate
  </button>
              <button
                type="button"
                onClick={() =>
                  copyText(
                    certificate.certificateNumber
                  )
                }
                className="h-12 rounded-full bg-white px-6 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Copy Certificate Number
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="h-12 rounded-full border border-white/10 px-6 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={label}
        className="mb-3 block text-sm text-white/60"
      >
        {label}
      </label>

      <input
        id={label}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required={required}
        className="h-14 w-full rounded-2xl border border-white/10 bg-black px-5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
      />
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={label}
        className="mb-3 block text-sm text-white/60"
      >
        {label}
      </label>

      <input
        id={label}
        type="date"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required={required}
        className="h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-white/30"
      />
    </div>
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