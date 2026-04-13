"use client";

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  void error;

  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
          <div
            style={{
              width: "min(42rem, 100%)",
              border: "1px solid #e5e7eb",
              borderRadius: "1rem",
              padding: "2rem",
              background: "#fff",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b91c1c" }}>
              Critical error
            </p>
            <h1 style={{ marginTop: "0.9rem", marginBottom: "0.6rem", fontSize: "1.8rem" }}>
              The application could not render this request.
            </h1>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
              Please retry. If this keeps happening, redeploy the latest stable build.
            </p>
            <button
              onClick={reset}
              type="button"
              style={{
                marginTop: "1.3rem",
                minHeight: "2.75rem",
                borderRadius: "0.75rem",
                border: "none",
                padding: "0 1.2rem",
                fontWeight: 700,
                background: "#0f766e",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
