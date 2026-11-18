import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, Heart, Calendar, User, Briefcase } from 'lucide-react'
import type { FatumUser } from '../types'
import { useResponsive } from '../hooks/useResponsive'

interface Props {
  user: FatumUser
}

const tabs = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/favorites', label: 'Favoritos', altLabel: 'Mis servicios', icon: Heart, altIcon: Briefcase },
  { path: '/calendar', label: 'Calendario', icon: Calendar },
  { path: '/profile', label: 'Perfil', icon: User },
]

export default function MainLayout({ user }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isMobile } = useResponsive()
  const isPro = user.role === 'PROFESSIONAL'

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh' }}>
      {!isMobile && (
        <nav style={{
          width: 240,
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--brand-secondary)',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
        }}>
          <div style={{
            padding: '0 20px 24px',
            borderBottom: '1px solid var(--border)',
            marginBottom: 12,
          }}>
            <img src="/images/fatum-login.png" alt="Fatum" style={{ height: 32 }} />
          </div>
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path
            const Icon = isPro && tab.altIcon ? tab.altIcon : tab.icon
            const label = isPro && tab.altLabel ? tab.altLabel : tab.label
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 20px',
                  background: isActive ? 'var(--primary-container)' : 'transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text)',
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 16,
                  fontWeight: isActive ? 700 : 400,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 0,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Icon size={20} />
                {label}
              </button>
            )
          })}
        </nav>
      )}

      <main style={{
        flex: 1,
        paddingBottom: isMobile ? 72 : 0,
        backgroundColor: 'var(--brand-secondary)',
        minHeight: isMobile ? 'calc(100vh - 72px)' : '100vh',
        overflow: 'auto',
      }}>
        <Outlet />
      </main>

      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          backgroundColor: 'var(--brand-secondary)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        }}>
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path
            const Icon = isPro && tab.altIcon ? tab.altIcon : tab.icon
            const label = isPro && tab.altLabel ? tab.altLabel : tab.label
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? 'var(--fatum-accent)' : 'var(--brand-primary)',
                  fontSize: 11,
                  fontFamily: "'Lato', sans-serif",
                  padding: '8px 0',
                  minWidth: 64,
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}
