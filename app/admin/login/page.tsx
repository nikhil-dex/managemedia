import { signIn } from "@/auth";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/40">
          ManageMedia
        </p>

        <h1 className="text-3xl font-semibold">
          Admin Login
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-white/45">
          Sign in with your authorized ManageMedia
          account to manage internship certificates.
        </p>

        <form
          action={async () => {
            "use server";

            await signIn("google", {
              redirectTo: "/admin/certificates",
            });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-white px-6 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}