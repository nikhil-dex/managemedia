"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

type DocumentType =
  | "certificate"
  | "offer-letter"
  | "joining-letter"
  | "lor";

interface OfferLetterForm {
  name: string;
  internship: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  stipend: string;
  workMode: string;
}

interface JoiningLetterForm {
  name: string;
  internship: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  workMode: string;
}

interface RecommendationLetterForm {
  name: string;
  internship: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  workMode: string;
  performance: string;
}

export default function CertificatesAdminPage() {
  const router = useRouter();

  /*
   * ==========================================
   * DOCUMENT TYPE
   * ==========================================
   */

  const [documentType, setDocumentType] =
    useState<DocumentType>("certificate");

  /*
   * ==========================================
   * CERTIFICATE STATE
   * ==========================================
   */

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

  /*
   * ==========================================
   * OFFER LETTER STATE
   * ==========================================
   */

  const [offerForm, setOfferForm] =
    useState<OfferLetterForm>({
      name: "",
      internship: "Web Development Intern",
      duration: "1 Month",
      startDate: "",
      endDate: "",
      issueDate: "",
      stipend: "Unpaid",
      workMode: "Remote",
    });

  const [joiningForm, setJoiningForm] =
  useState<JoiningLetterForm>({
    name: "",
    internship: "Web Development Intern",
    duration: "1 Month",
    startDate: "",
    endDate: "",
    issueDate: "",
    workMode: "Remote",
  });

  const [lorForm, setLorForm] =
  useState<RecommendationLetterForm>({
    name: "",
    internship: "Web Development Intern",
    duration: "1 Month",
    startDate: "",
    endDate: "",
    issueDate: "",
    workMode: "Remote",
    performance: "",
  });

  /*
   * ==========================================
   * COMMON STATE
   * ==========================================
   */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * ==========================================
   * CERTIFICATE FIELD UPDATE
   * ==========================================
   */

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
   * ==========================================
   * OFFER LETTER FIELD UPDATE
   * ==========================================
   */

  function updateOfferField(
    field: keyof OfferLetterForm,
    value: string
  ) {
    setOfferForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateJoiningField(
  field: keyof JoiningLetterForm,
  value: string
) {
  setJoiningForm((current) => ({
    ...current,
    [field]: value,
  }));
}

function updateLorField(
  field: keyof RecommendationLetterForm,
  value: string
) {
  setLorForm((current) => ({
    ...current,
    [field]: value,
  }));
}
  /*
   * ==========================================
   * CERTIFICATE SUBMIT
   * ==========================================
   */

  async function handleCertificateSubmit(
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

  /*
   * ==========================================
   * OFFER LETTER SUBMIT
   * ==========================================
   */

  async function handleOfferLetterSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/documents/offer-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(offerForm),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      /*
       * Successful PDF response
       */

      if (
        response.ok &&
        contentType.includes("application/pdf")
      ) {
        const blob = await response.blob();

        const url =
          window.URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          "ManageMedia-Offer-Letter.pdf";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        return;
      }

      /*
       * Error response
       */

      let message =
        "Unable to generate offer letter.";

      try {
        const data = await response.json();

        if (data?.error) {
          message = data.error;
        }
      } catch {
        // Response wasn't JSON.
      }

      setError(message);
    } catch (error) {
      console.error(
        "Offer letter generation error:",
        error
      );

      setError(
        "Something went wrong while generating the offer letter."
      );
    } finally {
      setLoading(false);
    }
  }


  async function handleJoiningLetterSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      "/api/documents/joining-letter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joiningForm),
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    if (
      response.ok &&
      contentType.includes("application/pdf")
    ) {
      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "ManageMedia-Joining-Letter.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      return;
    }

    let message =
      "Unable to generate joining letter.";

    try {
      const data = await response.json();

      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Response wasn't JSON.
    }

    setError(message);
  } catch (error) {
    console.error(
      "Joining letter generation error:",
      error
    );

    setError(
      "Something went wrong while generating the joining letter."
    );
  } finally {
    setLoading(false);
  }
}

async function handleLorSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      "/api/documents/lor",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(lorForm),
      }
    );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    if (
      response.ok &&
      contentType.includes("application/pdf")
    ) {
      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "ManageMedia-LOR.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      return;
    }

    let message =
      "Unable to generate letter of recommendation.";

    try {
      const data =
        await response.json();

      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Response wasn't JSON.
    }

    setError(message);
  } catch (error) {
    console.error(
      "LOR generation error:",
      error
    );

    setError(
      "Something went wrong while generating the letter of recommendation."
    );
  } finally {
    setLoading(false);
  }
}
  /*
   * ==========================================
   * RESET
   * ==========================================
   */

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

    setOfferForm({
      name: "",
      internship: "Web Development Intern",
      duration: "1 Month",
      startDate: "",
      endDate: "",
      issueDate: "",
      stipend: "Unpaid",
      workMode: "Remote",
    });

    setJoiningForm({
  name: "",
  internship: "Web Development Intern",
  duration: "1 Month",
  startDate: "",
  endDate: "",
  issueDate: "",
  workMode: "Remote",
});

setLorForm({
  name: "",
  internship: "Web Development Intern",
  duration: "1 Month",
  startDate: "",
  endDate: "",
  issueDate: "",
  workMode: "Remote",
  performance: "",
});
  }

  /*
   * ==========================================
   * COPY
   * ==========================================
   */

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  }

  /*
   * ==========================================
   * DOCUMENT SELECTOR
   * ==========================================
   */

  function renderDocumentSelector() {
    return (
      <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => {
              setDocumentType("certificate");
              setError("");
              setCertificate(null);
            }}
            className={`h-12 rounded-xl text-sm transition ${
              documentType === "certificate"
                ? "bg-white text-black"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            Certificate
          </button>

          <button
            type="button"
            onClick={() => {
              setDocumentType("offer-letter");
              setError("");
              setCertificate(null);
            }}
            className={`h-12 rounded-xl text-sm transition ${
              documentType === "offer-letter"
                ? "bg-white text-black"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            Offer Letter
          </button>

          <button
  type="button"
  onClick={() => {
    setDocumentType("joining-letter");
    setError("");
    setCertificate(null);
  }}
  className={`h-12 rounded-xl text-sm transition ${
    documentType === "joining-letter"
      ? "bg-white text-black"
      : "text-white/50 hover:bg-white/5 hover:text-white"
  }`}
>
  Joining Letter
</button>

<button
  type="button"
  onClick={() => {
    setDocumentType("lor");
    setError("");
    setCertificate(null);
  }}
  className={`h-12 rounded-xl text-sm transition ${
    documentType === "lor"
      ? "bg-white text-black"
      : "text-white/50 hover:bg-white/5 hover:text-white"
  }`}
>
  LOR
</button>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * CERTIFICATE FORM
   * ==========================================
   */

  function renderCertificateForm() {
    return (
      <form
        onSubmit={handleCertificateSubmit}
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
              htmlFor="certificate-internship"
              className="mb-3 block text-sm text-white/60"
            >
              Internship
            </label>

            <select
              id="certificate-internship"
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
                Business Analyst Intern
              </option>
              <option>
                UI/UX Intern
              </option>
              <option>
                Content Writing Intern
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
              updateField(
                "duration",
                value
              )
            }
            required
          />

          <div className="grid gap-6 sm:grid-cols-3">
            <DateField
              label="Start Date"
              value={form.startDate}
              onChange={(value) =>
                updateField(
                  "startDate",
                  value
                )
              }
              required
            />

            <DateField
              label="End Date"
              value={form.endDate}
              onChange={(value) =>
                updateField(
                  "endDate",
                  value
                )
              }
              required
            />

            <DateField
              label="Issue Date"
              value={form.issueDate}
              onChange={(value) =>
                updateField(
                  "issueDate",
                  value
                )
              }
              required
            />
          </div>

          {error && (
            <ErrorMessage message={error} />
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
    );
  }

  /*
   * ==========================================
   * OFFER LETTER FORM
   * ==========================================
   */

  function renderOfferLetterForm() {
    return (
      <form
        onSubmit={handleOfferLetterSubmit}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10"
      >
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/35">
            Internship Document
          </p>

          <h2 className="mt-2 text-2xl font-medium">
            Generate Offer Letter
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-white/40">
            Generate a two-page ManageMedia internship
            offer letter with terms and conditions.
          </p>
        </div>

        <div className="grid gap-7">
          <Field
            label="Intern Name"
            value={offerForm.name}
            placeholder="Enter intern's full name"
            onChange={(value) =>
              updateOfferField(
                "name",
                value
              )
            }
            required
          />

          <div>
            <label
              htmlFor="offer-internship"
              className="mb-3 block text-sm text-white/60"
            >
              Internship
            </label>

            <select
              id="offer-internship"
              value={offerForm.internship}
              onChange={(event) =>
                updateOfferField(
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
                Business Analyst Intern
              </option>
              <option>
                UI/UX Intern
              </option>
              <option>
                Content Writing Intern
              </option>

              <option>
                Other
              </option>
            </select>
          </div>

          <Field
            label="Duration"
            value={offerForm.duration}
            placeholder="e.g. 1 Month"
            onChange={(value) =>
              updateOfferField(
                "duration",
                value
              )
            }
            required
          />

          <div className="grid gap-6 sm:grid-cols-3">
            <DateField
              label="Start Date"
              value={offerForm.startDate}
              onChange={(value) =>
                updateOfferField(
                  "startDate",
                  value
                )
              }
              required
            />

            <DateField
              label="End Date"
              value={offerForm.endDate}
              onChange={(value) =>
                updateOfferField(
                  "endDate",
                  value
                )
              }
              required
            />

            <DateField
              label="Issue Date"
              value={offerForm.issueDate}
              onChange={(value) =>
                updateOfferField(
                  "issueDate",
                  value
                )
              }
              required
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Stipend"
              value={offerForm.stipend}
              placeholder="e.g. ₹5,000 / month or Unpaid"
              onChange={(value) =>
                updateOfferField(
                  "stipend",
                  value
                )
              }
              required
            />

            <div>
              <label
                htmlFor="work-mode"
                className="mb-3 block text-sm text-white/60"
              >
                Work Mode
              </label>

              <select
                id="work-mode"
                value={offerForm.workMode}
                onChange={(event) =>
                  updateOfferField(
                    "workMode",
                    event.target.value
                  )
                }
                className="h-14 w-full rounded-2xl border border-white/10 bg-black px-5 text-sm text-white outline-none transition focus:border-white/30"
              >
                <option>
                  Remote
                </option>

                <option>
                  Hybrid
                </option>

                <option>
                  On-site
                </option>
              </select>
            </div>
          </div>

          {error && (
            <ErrorMessage message={error} />
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-14 rounded-full bg-white px-8 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Generating Offer Letter..."
              : "Generate Offer Letter"}
          </button>
        </div>
      </form>
    );
  }


  function renderJoiningLetterForm() {
  return (
    <form
      onSubmit={handleJoiningLetterSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Internship Document
        </p>

        <h2 className="mt-2 text-2xl font-medium">
          Generate Joining Letter
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-white/40">
          Generate an official ManageMedia internship
          joining letter.
        </p>
      </div>

      <div className="grid gap-7">
        <Field
          label="Intern Name"
          value={joiningForm.name}
          placeholder="Enter intern's full name"
          onChange={(value) =>
            updateJoiningField("name", value)
          }
          required
        />

        <div>
          <label
            htmlFor="joining-internship"
            className="mb-3 block text-sm text-white/60"
          >
            Internship
          </label>

          <select
            id="joining-internship"
            value={joiningForm.internship}
            onChange={(event) =>
              updateJoiningField(
                "internship",
                event.target.value
              )
            }
            className="h-14 w-full rounded-2xl border border-white/10 bg-black px-5 text-sm text-white outline-none transition focus:border-white/30"
          >
            <option>Web Development Intern</option>
            <option>Digital Marketing Intern</option>
            <option>Social Media Marketing Intern</option>
            <option>Graphic Design Intern</option>
            <option>Data Analyst Intern</option>
            <option>Business Analyst Intern</option>
            <option>UI/UX Intern</option>
            <option>Content Writing Intern</option>
            <option>Other</option>
          </select>
        </div>

        <Field
          label="Duration"
          value={joiningForm.duration}
          placeholder="e.g. 1 Month"
          onChange={(value) =>
            updateJoiningField("duration", value)
          }
          required
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <DateField
            label="Joining Date"
            value={joiningForm.startDate}
            onChange={(value) =>
              updateJoiningField("startDate", value)
            }
            required
          />

          <DateField
            label="End Date"
            value={joiningForm.endDate}
            onChange={(value) =>
              updateJoiningField("endDate", value)
            }
            required
          />

          <DateField
            label="Issue Date"
            value={joiningForm.issueDate}
            onChange={(value) =>
              updateJoiningField("issueDate", value)
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="joining-work-mode"
            className="mb-3 block text-sm text-white/60"
          >
            Work Mode
          </label>

          <select
            id="joining-work-mode"
            value={joiningForm.workMode}
            onChange={(event) =>
              updateJoiningField(
                "workMode",
                event.target.value
              )
            }
            className="h-14 w-full rounded-2xl border border-white/10 bg-black px-5 text-sm text-white outline-none transition focus:border-white/30"
          >
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
        </div>

        {error && (
          <ErrorMessage message={error} />
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-14 rounded-full bg-white px-8 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Generating Joining Letter..."
            : "Generate Joining Letter"}
        </button>
      </div>
    </form>
  );
}

function renderLorForm() {
  return (
    <form
      onSubmit={handleLorSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Internship Document
        </p>

        <h2 className="mt-2 text-2xl font-medium">
          Generate Letter of Recommendation
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-white/40">
          Generate an official ManageMedia
          letter of recommendation for a
          completed internship.
        </p>
      </div>

      <div className="grid gap-7">

        <Field
          label="Intern Name"
          value={lorForm.name}
          placeholder="Enter intern's full name"
          onChange={(value) =>
            updateLorField("name", value)
          }
          required
        />

        <div>
          <label
            htmlFor="lor-internship"
            className="mb-3 block text-sm text-white/60"
          >
            Internship
          </label>

          <select
            id="lor-internship"
            value={lorForm.internship}
            onChange={(event) =>
              updateLorField(
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
              UI/UX Intern
            </option>
            <option>
              Content Writing Intern
            </option>
            <option>
              Business Analyst Intern
            </option>

            <option>
              Other
            </option>
          </select>
        </div>

        <Field
          label="Duration"
          value={lorForm.duration}
          placeholder="e.g. 1 Month"
          onChange={(value) =>
            updateLorField(
              "duration",
              value
            )
          }
          required
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <DateField
            label="Start Date"
            value={lorForm.startDate}
            onChange={(value) =>
              updateLorField(
                "startDate",
                value
              )
            }
            required
          />

          <DateField
            label="End Date"
            value={lorForm.endDate}
            onChange={(value) =>
              updateLorField(
                "endDate",
                value
              )
            }
            required
          />

          <DateField
            label="Issue Date"
            value={lorForm.issueDate}
            onChange={(value) =>
              updateLorField(
                "issueDate",
                value
              )
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="lor-work-mode"
            className="mb-3 block text-sm text-white/60"
          >
            Work Mode
          </label>

          <select
            id="lor-work-mode"
            value={lorForm.workMode}
            onChange={(event) =>
              updateLorField(
                "workMode",
                event.target.value
              )
            }
            className="h-14 w-full rounded-2xl border border-white/10 bg-black px-5 text-sm text-white outline-none transition focus:border-white/30"
          >
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="lor-performance"
            className="mb-3 block text-sm text-white/60"
          >
            Performance / Recommendation
          </label>

          <textarea
            id="lor-performance"
            value={lorForm.performance}
            onChange={(event) =>
              updateLorField(
                "performance",
                event.target.value
              )
            }
            placeholder="Optional recommendation or performance statement..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
          />
        </div>

        {error && (
          <ErrorMessage message={error} />
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-14 rounded-full bg-white px-8 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Generating LOR..."
            : "Generate Letter of Recommendation"}
        </button>
      </div>
    </form>
  );
}
  /*
   * ==========================================
   * CERTIFICATE RESULT
   * ==========================================
   */

  function renderCertificateResult() {
    if (!certificate) {
      return null;
    }

    const verificationUrl =
      `https://www.managemedia.tech/verify/${certificate.certificateNumber}`;

    return (
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
            value={
              certificate.certificateNumber
            }
          />
        </div>

        <div className="mt-8">
          <p className="mb-3 text-xs uppercase tracking-[0.15em] text-white/35">
            Verification URL
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              readOnly
              value={verificationUrl}
              className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 text-xs text-white/60 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                copyText(verificationUrl)
              }
              className="h-12 rounded-xl border border-white/10 px-5 text-xs transition hover:bg-white/5"
            >
              Copy URL
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const url =
              `/api/certificates/${certificate.certificateNumber}/pdf`;

            console.log(
              "Downloading certificate:",
              url
            );

            router.push(url);
          }}
          className="mt-8 h-12 rounded-full bg-white px-6 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Download Certificate
        </button>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
    );
  }

  /*
   * ==========================================
   * PAGE
   * ==========================================
   */

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/40">
            ManageMedia
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Document Center
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/45">
            Create internship certificates and
            official internship documents.
          </p>
        </div>

        {renderDocumentSelector()}

        {documentType === "certificate" ? (
  certificate ? (
    renderCertificateResult()
  ) : (
    renderCertificateForm()
  )
) : documentType === "offer-letter" ? (
  renderOfferLetterForm()
) : documentType === "joining-letter" ? (
  renderJoiningLetterForm()
) : (
  renderLorForm()
)}
      </div>
    </main>
  );
}

/*
 * ==========================================
 * FIELD
 * ==========================================
 */

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

/*
 * ==========================================
 * DATE FIELD
 * ==========================================
 */

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

/*
 * ==========================================
 * ERROR MESSAGE
 * ==========================================
 */

function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4">
      <p className="text-sm text-red-300">
        {message}
      </p>
    </div>
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