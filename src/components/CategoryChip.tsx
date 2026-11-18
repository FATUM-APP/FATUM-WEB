import type { CSSProperties } from 'react';

interface CategoryChipProps {
  name: string;
  logoUrl?: string;
  selected: boolean;
  onClick: () => void;
}

export default function CategoryChip({ name, logoUrl, selected, onClick }: CategoryChipProps) {
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 20,
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    fontSize: 14,
    fontWeight: 400,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    border: selected ? '1px solid transparent' : '1px solid #192422',
    backgroundColor: selected ? '#E5E9EA' : 'transparent',
    color: selected ? '#123F35' : '#192422',
  };

  return (
    <button type="button" onClick={onClick} style={style}>
      {logoUrl && (
        <img
          src={logoUrl}
          alt=""
          style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }}
        />
      )}
      {name}
    </button>
  );
}
