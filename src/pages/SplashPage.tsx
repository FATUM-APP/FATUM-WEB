import type { CSSProperties } from 'react';

const container: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: 'var(--brand-primary)',
  gap: 32,
};

const dotContainer: CSSProperties = {
  display: 'flex',
  gap: 8,
};

export default function SplashPage() {
  return (
    <div style={container}>
      <img
        src="/images/fatum-login.png"
        alt="Fatum"
        style={{ width: 200, filter: 'brightness(0) invert(1)' }}
      />
      <div style={dotContainer}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: 'var(--brand-secondary)',
              animation: `fatum-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
