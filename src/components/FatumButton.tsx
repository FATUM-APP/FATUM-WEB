import { type ReactNode, type CSSProperties, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'third' | 'bordered' | 'borderedExpanded' | 'outlined' | 'compact';

interface FatumButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const baseStyle: CSSProperties = {
  fontFamily: "'Lato', sans-serif",
  fontSize: 16,
  fontWeight: 700,
  borderRadius: 20,
  padding: '12px 24px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  border: 'none',
  transition: 'opacity 0.2s, transform 0.1s',
  outline: 'none',
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: '#FFFFFF',
    color: '#123F35',
    width: '100%',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '2px solid #FFFFFF',
    width: '100%',
  },
  third: {
    backgroundColor: '#123F35',
    color: '#FFFFFF',
    width: '100%',
  },
  bordered: {
    backgroundColor: 'transparent',
    color: '#192422',
    border: '2px solid #123F35',
    width: 'auto',
  },
  borderedExpanded: {
    backgroundColor: 'transparent',
    color: '#192422',
    border: '2px solid #123F35',
    width: '100%',
  },
  outlined: {
    backgroundColor: 'transparent',
    color: '#123F35',
    border: 'none',
    width: 'auto',
    padding: '8px 16px',
  },
  compact: {
    backgroundColor: '#E5E9EA',
    color: '#123F35',
    width: 'auto',
    padding: '8px 16px',
  },
};

export default function FatumButton({
  variant = 'primary',
  loading = false,
  fullWidth,
  disabled,
  children,
  className,
  ...rest
}: FatumButtonProps) {
  const vs = variantStyles[variant];
  const style: CSSProperties = {
    ...baseStyle,
    ...vs,
    ...(fullWidth !== undefined ? { width: fullWidth ? '100%' : 'auto' } : {}),
    ...(disabled || loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
  };

  return (
    <button
      className={className}
      style={style}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: 20,
            height: 20,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'fatum-spin 0.6s linear infinite',
          }}
        />
      ) : (
        children
      )}
    </button>
  );
}
