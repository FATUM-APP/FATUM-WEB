import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Plus, Settings } from 'lucide-react';
import type { FatumAddress } from '../types';

interface HomeAddressSelectorProps {
  addresses: FatumAddress[];
  selected: FatumAddress | null;
  onSelect: (address: FatumAddress) => void;
  onManage: () => void;
  onAdd?: () => void;
}

export default function HomeAddressSelector({
  addresses,
  selected,
  onSelect,
  onManage,
  onAdd,
}: HomeAddressSelectorProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '10px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <MapPin size={18} color="#123F35" />
        <div style={{ flex: 1 }}>
          {selected ? (
            <>
              <span style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: '#192422',
                display: 'block',
              }}>
                {selected.alias}
              </span>
              <span style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 12,
                color: '#B8C2C0',
              }}>
                {selected.residence}, {selected.city}
              </span>
            </>
          ) : (
            <span style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 14,
              color: '#B8C2C0',
            }}>
              Seleccionar dirección
            </span>
          )}
        </div>
        {expanded
          ? <ChevronUp size={18} color="#123F35" />
          : <ChevronDown size={18} color="#123F35" />}
      </button>

      {expanded && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E9EA',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          zIndex: 10,
          overflow: 'hidden',
        }}>
          {addresses.map((addr) => (
            <button
              key={addr.alias}
              type="button"
              onClick={() => { onSelect(addr); setExpanded(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 16px',
                background: selected?.alias === addr.alias ? '#F5FAF9' : 'transparent',
                border: 'none',
                borderBottom: '1px solid #E5E9EA',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <MapPin size={16} color="#B8C2C0" />
              <div>
                <span style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#192422',
                  display: 'block',
                }}>
                  {addr.alias}
                </span>
                <span style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 12,
                  color: '#B8C2C0',
                }}>
                  {addr.residence}, {addr.city}
                </span>
              </div>
            </button>
          ))}

          <div style={{
            display: 'flex',
            borderTop: '1px solid #E5E9EA',
          }}>
            {onAdd && (
              <button
                type="button"
                onClick={() => { onAdd(); setExpanded(false); }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderRight: '1px solid #E5E9EA',
                  cursor: 'pointer',
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 14,
                  color: '#123F35',
                  fontWeight: 700,
                }}
              >
                <Plus size={16} />
                Agregar
              </button>
            )}
            <button
              type="button"
              onClick={() => { onManage(); setExpanded(false); }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Lato', sans-serif",
                fontSize: 14,
                color: '#123F35',
                fontWeight: 700,
              }}
            >
              <Settings size={16} />
              Administrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
