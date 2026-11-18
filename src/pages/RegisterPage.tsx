import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, FileText } from 'lucide-react';
import FatumButton from '../components/FatumButton';
import FatumTextField from '../components/FatumTextField';
import FatumPicker from '../components/FatumPicker';
import { useAuth, type SignUpRequest } from '../context/AuthContext';
import { GENDER_OPTIONS, DOCUMENT_TYPE_OPTIONS, type Gender, type DocumentType } from '../types';

type Step = 'basicData' | 'accountInfo' | 'identity';
const STEPS: Step[] = ['basicData', 'accountInfo', 'identity'];

const stepMeta: Record<Step, { title: string; subtitle: string }> = {
  basicData: {
    title: 'Datos básicos',
    subtitle: 'Ingresa tu nombre, teléfono y género',
  },
  accountInfo: {
    title: 'Información de cuenta',
    subtitle: 'Configura tu correo, usuario y contraseña',
  },
  identity: {
    title: 'Identidad',
    subtitle: 'Fecha de nacimiento y documento de identidad',
  },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, signIn, error: authError, isLoading } = useAuth();

  const [step, setStep] = useState<Step>('basicData');
  const stepIndex = STEPS.indexOf(step);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<Gender>('MALE');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [birthday, setBirthday] = useState('');
  const [document, setDocument] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('ID');

  const [localError, setLocalError] = useState<string | null>(null);

  const validate = (): boolean => {
    setLocalError(null);
    switch (step) {
      case 'basicData':
        if (!name.trim()) { setLocalError('El nombre es obligatorio'); return false; }
        if (!phone.trim()) { setLocalError('El teléfono es obligatorio'); return false; }
        return true;
      case 'accountInfo':
        if (!email.trim()) { setLocalError('El correo electrónico es obligatorio'); return false; }
        if (!username.trim()) { setLocalError('El nombre de usuario es obligatorio'); return false; }
        if (!password) { setLocalError('La contraseña es obligatoria'); return false; }
        if (password !== confirmPassword) { setLocalError('Las contraseñas no coinciden'); return false; }
        return true;
      case 'identity': {
        if (!birthday) { setLocalError('La fecha de nacimiento es obligatoria'); return false; }
        const bd = new Date(birthday);
        const age = (Date.now() - bd.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 18) { setLocalError('Debes tener al menos 18 años para registrarte'); return false; }
        if (!document.trim()) { setLocalError('El número de documento es obligatorio'); return false; }
        return true;
      }
    }
  };

  const advanceStep = async () => {
    if (!validate()) return;
    if (step === 'basicData') setStep('accountInfo');
    else if (step === 'accountInfo') setStep('identity');
    else {
      const req: SignUpRequest = {
        name: name.trim(),
        phone,
        gender,
        email: email.trim(),
        username: username.trim(),
        password,
        birthday,
        document: document.trim(),
        documentType,
      };
      const result = await signUp(req);
      if (result === 'needsConfirmation') {
        navigate('/confirm', { state: { email, password } });
      } else if (result === 'completed') {
        await signIn(email, password);
      } else {
        setLocalError(authError ?? 'Error al registrar el usuario');
      }
    }
  };

  const goBack = () => {
    setLocalError(null);
    if (step === 'basicData') navigate('/');
    else if (step === 'accountInfo') setStep('basicData');
    else setStep('accountInfo');
  };

  const displayError = localError || authError;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button onClick={goBack} style={styles.backButton} aria-label="Volver">
          <ChevronLeft size={24} color="var(--brand-primary)" />
        </button>

        <div style={styles.stepIndicator}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.stepBar,
                backgroundColor:
                  i <= stepIndex ? 'var(--brand-primary)' : 'var(--border-login)',
              }}
            />
          ))}
        </div>

        <div style={styles.scrollArea}>
          <div style={styles.header}>
            <img src="/images/fatum-login.png" alt="Fatum" style={styles.logo} />
            <h1 style={styles.title}>{stepMeta[step].title}</h1>
            <p style={styles.subtitle}>{stepMeta[step].subtitle}</p>
          </div>

          <div style={styles.form}>
            {step === 'basicData' && (
              <>
                <FatumTextField
                  placeholder="Nombre completo"
                  value={name}
                  onChange={setName}
                  prefixIcon="person"
                  fieldStyle="login"
                  maxLength={142}
                />
                <FatumTextField
                  placeholder="Teléfono"
                  value={phone}
                  onChange={(v) => setPhone(v.replace(/\D/g, ''))}
                  prefixIcon="phone"
                  type="tel"
                  fieldStyle="login"
                  maxLength={20}
                />
                <FatumPicker
                  title="Género"
                  options={GENDER_OPTIONS}
                  value={gender}
                  onChange={(v) => setGender(v as Gender)}
                  fieldStyle="login"
                  icon={Users}
                />
              </>
            )}

            {step === 'accountInfo' && (
              <>
                <FatumTextField
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(v) => {
                    const noSpaces = v.replace(/\s/g, '');
                    if ((noSpaces.match(/@/g) || []).length > 1) return;
                    setEmail(noSpaces);
                  }}
                  prefixIcon="envelope"
                  type="email"
                  fieldStyle="login"
                />
                <FatumTextField
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(v) => setUsername(v.replace(/\s/g, '').toLowerCase())}
                  prefixIcon="at"
                  fieldStyle="login"
                  maxLength={15}
                />
                <FatumTextField
                  placeholder="Contraseña"
                  value={password}
                  onChange={(v) => setPassword(v.replace(/\s/g, ''))}
                  prefixIcon="lock"
                  isSecure
                  fieldStyle="login"
                />
                <FatumTextField
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(v) => setConfirmPassword(v.replace(/\s/g, ''))}
                  prefixIcon="lock"
                  isSecure
                  fieldStyle="login"
                />
              </>
            )}

            {step === 'identity' && (
              <>
                <div style={styles.dateField}>
                  <label style={styles.dateLabel}>Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={styles.dateInput}
                  />
                </div>
                <FatumTextField
                  placeholder="Número de documento"
                  value={document}
                  onChange={(v) => setDocument(v.replace(/\D/g, ''))}
                  prefixIcon="doc.text"
                  type="text"
                  fieldStyle="login"
                  maxLength={10}
                />
                <FatumPicker
                  title="Tipo de documento"
                  options={DOCUMENT_TYPE_OPTIONS}
                  value={documentType}
                  onChange={(v) => setDocumentType(v as DocumentType)}
                  fieldStyle="login"
                  icon={FileText}
                />
              </>
            )}

            {displayError && <p style={styles.error}>{displayError}</p>}

            <FatumButton
              variant="third"
              onClick={advanceStep}
              loading={isLoading}
              disabled={isLoading}
            >
              {step === 'identity' ? 'Registrar Usuario' : 'Siguiente'}
            </FatumButton>
          </div>

          <FatumButton
            variant="borderedExpanded"
            onClick={() => navigate('/login')}
          >
            Ya tengo una cuenta
          </FatumButton>
        </div>
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
    padding: '20px 0',
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 24px',
    alignSelf: 'flex-start',
  },
  stepIndicator: {
    display: 'flex',
    gap: 5,
    padding: '20px 24px',
  },
  stepBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    transition: 'background-color 0.3s',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column',
    gap: 25,
    padding: '0 24px 40px',
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
  dateField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  dateLabel: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--brand-primary)',
    fontWeight: 400,
  },
  dateInput: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--brand-primary)',
    padding: 15,
    backgroundColor: 'rgba(209, 229, 224, 0.6)',
    border: '1px solid var(--border-login)',
    borderRadius: 12,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
};
