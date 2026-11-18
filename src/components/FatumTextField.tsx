import { useState, type CSSProperties, type InputHTMLAttributes } from 'react';
import {
  Mail, Lock, User, Phone, FileText, AtSign,
  Eye, EyeOff, Search, MapPin, type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  envelope: Mail,
  lock: Lock,
  person: User,
  phone: Phone,
  'doc.text': FileText,
  at: AtSign,
  eye: Eye,
  'eye.slash': EyeOff,
  'magnifyingglass': Search,
  'mappin': MapPin,
  mail: Mail,
  search: Search,
  'map-pin': MapPin,
  user: User,
};

type FieldStyle = 'login' | 'standard';

const STYLES: Record<FieldStyle, {
  borderColor: string;
  focusedBorderColor: string;
  errorBorderColor: string;
  fillColor: string;
  textColor: string;
  iconColor: string;
}> = {
  login: {
    borderColor: '#1B4965',
    focusedBorderColor: '#1B4965',
    errorBorderColor: '#34344A',
    fillColor: 'rgba(209, 229, 224, 0.6)',
    textColor: '#123F35',
    iconColor: '#123F35',
  },
  standard: {
    borderColor: '#E5E9EA',
    focusedBorderColor: '#E5E9EA',
    errorBorderColor: '#34344A',
    fillColor: 'transparent',
    textColor: '#192422',
    iconColor: '#192422',
  },
};

interface FatumTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  prefixIcon?: string;
  isSecure?: boolean;
  error?: string;
  fieldStyle?: FieldStyle;
  maxLength?: number;
}

export default function FatumTextField({
  placeholder,
  value,
  onChange,
  prefixIcon,
  isSecure = false,
  error,
  fieldStyle = 'login',
  maxLength,
  type = 'text',
  ...rest
}: FatumTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const s = STYLES[fieldStyle];
  const hasError = !!error;

  const borderColor = hasError ? s.errorBorderColor : focused ? s.focusedBorderColor : s.borderColor;
  const borderWidth = focused || hasError ? 2 : 1;

  const Icon = prefixIcon ? ICON_MAP[prefixIcon] : null;

  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: s.fillColor,
    borderRadius: 12,
    border: `${borderWidth}px solid ${borderColor}`,
    transition: 'border-color 0.2s',
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: s.textColor,
    width: '100%',
  };

  const inputType = isSecure && !revealed ? 'password' : type;

  return (
    <div style={{ width: '100%' }}>
      <div style={containerStyle}>
        {Icon && <Icon size={20} color={s.iconColor} />}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            let v = e.target.value;
            if (maxLength && v.length > maxLength) v = v.slice(0, maxLength);
            onChange(v);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
          autoComplete={isSecure ? 'current-password' : undefined}
          {...rest}
        />
        {isSecure && (
          <button
            type="button"
            onClick={() => setRevealed(!revealed)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
            }}
            aria-label={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {revealed
              ? <EyeOff size={20} color={s.iconColor} />
              : <Eye size={20} color={s.iconColor} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 14,
          color: s.errorBorderColor,
          marginTop: 5,
          marginBottom: 0,
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
