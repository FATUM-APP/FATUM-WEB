import { useNavigate } from 'react-router-dom'
import { Briefcase, Heart, User, Clock, MapPin, CreditCard, LogOut } from 'lucide-react'
import UserProfileHeader from '../components/UserProfileHeader'
import ProfileOption from '../components/ProfileOption'
import { useAuth } from '../context/AuthContext'
import { useResponsive } from '../hooks/useResponsive'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { layout } = useResponsive()

  if (!user) return null

  const isPro = user.role === 'PROFESSIONAL'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{ padding: layout.padding, maxWidth: 600, margin: '0 auto' }}>
      <h1 className="text-header" style={{ color: 'var(--brand-primary)', marginBottom: layout.spacingMedium }}>
        Perfil
      </h1>

      <UserProfileHeader
        user={user}
        avatarUrl={user.profileImageUrl}
        score={{ average: 4.5, count: 12 }}
      />

      <div style={{ marginTop: layout.spacingMedium }}>
        {!isPro ? (
          <ProfileOption
            icon={Briefcase}
            label="Ser profesional"
            onClick={() => {}}
          />
        ) : (
          <ProfileOption
            icon={Briefcase}
            label="Mis servicios"
            onClick={() => navigate('/my-services')}
          />
        )}
        <ProfileOption
          icon={Heart}
          label="Favoritos"
          onClick={() => navigate('/favorites')}
        />
        <ProfileOption
          icon={User}
          label="Gestionar perfil"
          onClick={() => navigate('/manage-profile')}
        />
        <ProfileOption
          icon={Clock}
          label="Servicios recibidos"
          onClick={() => navigate('/orders')}
        />
        <ProfileOption
          icon={MapPin}
          label="Direcciones"
          onClick={() => navigate('/addresses')}
        />
        <ProfileOption
          icon={CreditCard}
          label="Métodos de pago"
          onClick={() => {}}
        />
        <div style={{ marginTop: 8 }}>
          <ProfileOption
            icon={LogOut}
            label="Cerrar sesión"
            onClick={handleSignOut}
            danger
          />
        </div>
      </div>
    </div>
  )
}
