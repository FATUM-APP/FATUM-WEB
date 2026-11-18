import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useResponsive } from '../hooks/useResponsive'

export default function ManageProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { layout } = useResponsive()

  if (!user) return null

  const fields = [
    { label: 'Nombre', value: user.name },
    { label: 'Nombre de usuario', value: `@${user.username}` },
    { label: 'Correo electrónico', value: user.email },
    { label: 'Teléfono', value: user.phoneNumber || 'No registrado' },
    { label: 'Fecha de nacimiento', value: user.birthDate || 'No registrada' },
    { label: 'Estado de verificación', value: user.verificationStatus === 'VERIFIED' ? 'Verificado' : 'No verificado' },
  ]

  return (
    <div style={{ padding: layout.padding, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: layout.externalSpacing }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brand-primary)' }}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-header" style={{ color: 'var(--brand-primary)' }}>
          Gestionar perfil
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: layout.externalSpacing }}>
        <div style={{ position: 'relative' }}>
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              color: 'var(--brand-primary)',
              fontWeight: 700,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <button style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'var(--brand-primary)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>
            <Camera size={18} />
          </button>
        </div>
      </div>

      <div>
        {fields.map((field) => (
          <button
            key={field.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: '16px 0',
              borderBottom: '1px solid var(--border)',
              background: 'none',
              border: 'none',
              borderBottomStyle: 'solid',
              borderBottomWidth: 1,
              borderBottomColor: 'var(--border)',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: "'Lato', sans-serif",
            }}
          >
            <div>
              <div className="text-body" style={{ fontWeight: 700, color: 'var(--text)' }}>
                {field.label}
              </div>
              <div className="text-caption" style={{ color: 'var(--inactive)', marginTop: 2 }}>
                {field.value}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
