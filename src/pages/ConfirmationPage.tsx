import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import FatumButton from '../components/FatumButton';
import { useAuth } from '../context/AuthContext';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUp, signIn, error, isLoading } = useAuth();

  const stateEmail = (location.state as { email?: string; password?: string })?.email ?? '';
  const statePassword = (location.state as { email?: string; password?: string })?.password ?? '';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < 6) {
      setLocalError('Ingresa el código completo de 6 dígitos');
      return;
    }
    setLocalError(null);
    const ok = await confirmSignUp(stateEmail, code);
    if (ok) {
      if (statePassword) {
        await signIn(stateEmail, statePassword);
      } else {
        navigate('/login');
      }
    } else {
      setLocalError(error ?? 'Código incorrecto');
    }
  };

  const displayError = localError || error;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
          aria-label="Volver"
        >
          <ChevronLeft size={24} color="var(--brand-primary)" />
        </button>

        <div style={styles.header}>
          <img src="/images/fatum-login.png" alt="Fatum" style={styles.logo} />
          <h1 style={styles.title}>Verificación</h1>
          <p style={styles.subtitle}>
            Ingresa el código enviado a tu correo
          </p>
          {stateEmail && (
            <p style={styles.email}>{stateEmail}</p>
          )}
        </div>

        <div style={styles.codeRow}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={styles.codeInput}
            />
          ))}
        </div>

        {displayError && <p style={styles.error}>{displayError}</p>}

        <FatumButton
          variant="third"
          onClick={handleVerify}
          loading={isLoading}
          disabled={isLoading}
        >
          Verificar
        </FatumButton>

        <button style={styles.resendButton}>
          Reenviar código
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'var(--brand-secondary)',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: 25,
    padding: '20px 24px 40px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    alignSelf: 'flex-start',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: '40%',
    objectFit: 'contain' as const,
  },
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 20,
    fontWeight: 500,
    color: 'var(--login-text)',
    margin: 0,
  },
  subtitle: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--login-text)',
    textAlign: 'center' as const,
    margin: 0,
  },
  email: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 14,
    color: 'var(--brand-primary)',
    fontWeight: 700,
    margin: 0,
  },
  codeRow: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
  },
  codeInput: {
    width: 48,
    height: 56,
    textAlign: 'center' as const,
    fontSize: 24,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    color: 'var(--brand-primary)',
    border: '2px solid var(--border-login)',
    borderRadius: 12,
    backgroundColor: 'rgba(209, 229, 224, 0.6)',
    outline: 'none',
  },
  error: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 14,
    color: 'var(--error-border-login)',
    textAlign: 'center' as const,
    margin: 0,
  },
  resendButton: {
    background: 'none',
    border: 'none',
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--login-text)',
    cursor: 'pointer',
    textAlign: 'center' as const,
  },
};
