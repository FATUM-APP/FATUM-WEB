import { MapPin, MoreVertical, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { FatumAddress } from '../types'

interface Props {
  address: FatumAddress
  isPrincipal?: boolean
  onMakePrincipal?: () => void
  onDelete?: () => void
}

export default function AddressCard({ address, isPrincipal, onMakePrincipal, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: 16,
      border: '1px solid var(--border)',
      borderRadius: 12,
      backgroundColor: 'var(--brand-secondary)',
      position: 'relative',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'var(--primary-container)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <MapPin size={20} color="var(--brand-primary)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="text-body" style={{ fontWeight: 700, color: 'var(--text)' }}>
            {address.alias}
          </span>
          {isPrincipal && (
            <Star size={14} fill="var(--fatum-accent)" color="var(--fatum-accent)" />
          )}
        </div>
        <span className="text-caption" style={{ color: 'var(--text)', display: 'block' }}>
          {address.residence}
        </span>
        <span className="text-footer" style={{ color: 'var(--inactive)' }}>
          {address.city}, {address.state}, {address.country}
        </span>
      </div>
      {(onMakePrincipal || onDelete) && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--inactive)',
            }}
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              backgroundColor: 'var(--brand-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 10,
              minWidth: 160,
              overflow: 'hidden',
            }}>
              {onMakePrincipal && !isPrincipal && (
                <button
                  onClick={() => { onMakePrincipal(); setMenuOpen(false) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: 'var(--text)',
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  <Star size={16} /> Hacer principal
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => { onDelete(); setMenuOpen(false) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#c0392b',
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
