import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import FatumButton from '../components/FatumButton';
import FatumTextField from '../components/FatumTextField';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLocalError(null);
    const noSpaces = email.replace(/\s/g, '');
    if (!noSpaces) {
      setLocalError('El correo electrónico es obligatorio');
      return;
    }
    if (!password) {
      setLocalError('La contraseña es obligatoria');
      return;
    }
    const ok = await signIn(noSpaces, password);
    if (!ok) setLocalError(error ?? 'Error al iniciar sesión');
  };

  const displayError = localError || error;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button
          onClick={() => navigate('/')}
          style={styles.backButton}
          aria-label="Volver"
        >
          <ChevronLeft size={24} color="var(--brand-primary)" />
        </button>

        <div style={styles.header}>
          <img
            src="/images/fatum-login.png"
            alt="Fatum"
            style={styles.logo}
          />
          <h1 style={styles.title}>Iniciar Sesión</h1>
          <p style={styles.subtitle}>
            Bienvenido devuelta! Ingresa tu correo y contraseña
          </p>
        </div>

        <div style={styles.form}>
          <FatumTextField
            placeholder="Correo electrónico"
            value={email}
            onChange={(v) => setEmail(v.replace(/\s/g, ''))}
            prefixIcon="envelope"
            type="email"
            fieldStyle="login"
          />

          <FatumTextField
            placeholder="Contraseña"
            value={password}
            onChange={(v) => setPassword(v.replace(/\s/g, ''))}
            prefixIcon="lock"
            isSecure
            fieldStyle="login"
          />

          {displayError && (
            <p style={styles.error}>{displayError}</p>
          )}

          <FatumButton
            variant="third"
            onClick={handleSignIn}
            loading={isLoading}
            disabled={isLoading}
          >
            Iniciar sesión
          </FatumButton>

          <button
            onClick={() => navigate('/password-reset')}
            style={styles.linkButton}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div style={{ flex: 1 }} />

        <FatumButton
          variant="borderedExpanded"
          onClick={() => navigate('/register')}
        >
          Crear cuenta nueva
        </FatumButton>
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
    position: 'relative',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  error: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 14,
    color: 'var(--error-border-login)',
    textAlign: 'center' as const,
    margin: 0,
  },
  linkButton: {
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
