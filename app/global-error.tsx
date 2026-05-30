'use client';

export default function GlobalError({

  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: '#FAFAF8',
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '16px', color: '#1A1A1A' }}>
            Something went wrong.
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '32px' }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 32px',
              backgroundColor: '#1A1A1A',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
