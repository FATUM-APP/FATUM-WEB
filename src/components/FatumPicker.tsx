import { useState, type CSSProperties } from 'react';
import { type LucideIcon } from 'lucide-react';

type FieldStyle = 'login' | 'standard';

const STYLES: Record<FieldStyle, {
  borderColor: string;
  fillColor: string;
  textColor: string;
  iconColor: string;
}> = {
  login: {
    borderColor: '#1B4965',
    fillColor: 'rgba(209, 229, 224, 0.6)',
    textColor: '#123F35',
    iconColor: '#123F35',
  },
  standard: {
    borderColor: '#E5E9EA',
    fillColor: 'transparent',
    textColor: '#192422',
    iconColor: '#192422',
  },
};

interface FatumPickerProps {
  title: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  fieldStyle?: FieldStyle;
  icon?: LucideIcon;
}

export default function FatumPicker({
  title,
  options,
  value,
  onChange,
  fieldStyle = 'login',
  icon: Icon,
}: FatumPickerProps) {
  const [focused, setFocused] = useState(false);
  const s = STYLES[fieldStyle];
  const borderWidth = focused ? 2 : 1;

  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: s.fillColor,
    borderRadius: 12,
    border: `${borderWidth}px solid ${s.borderColor}`,
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  };

  const selectStyle: CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: s.textColor,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  };

  return (
    <div style={containerStyle}>
      {Icon && <Icon size={20} color={s.iconColor} />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={selectStyle}
        aria-label={title}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ flexShrink: 0 }}>
        <path d="M1 1.5L6 6.5L11 1.5" stroke={s.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
