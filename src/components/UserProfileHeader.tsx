import { Star, BadgeCheck } from 'lucide-react'
import type { FatumUser } from '../types'
import { useResponsive } from '../hooks/useResponsive'

interface Props {
  user: FatumUser
  avatarUrl?: string
  score?: { average: number; count: number }
}

export default function UserProfileHeader({ user, avatarUrl, score }: Props) {
  const { isMobile } = useResponsive()
  const size = isMobile ? 80 : 100

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '20px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user.username}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: 'var(--primary-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.4,
          color: 'var(--brand-primary)',
          fontWeight: 700,
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="text-subheader" style={{ color: 'var(--text)' }}>
            @{user.username}
          </span>
          {user.verificationStatus === 'VERIFIED' && (
            <BadgeCheck size={18} color="var(--fatum-accent)" fill="var(--fatum-accent)" stroke="white" />
          )}
        </div>
        {score && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Star size={16} fill="var(--fatum-accent)" color="var(--fatum-accent)" />
            <span className="text-body" style={{ color: 'var(--text)' }}>
              {score.average.toFixed(1)} ({score.count})
            </span>
          </div>
        )}
        <span className="text-caption" style={{ color: 'var(--inactive)', marginTop: 2, display: 'block' }}>
          {user.name}
        </span>
      </div>
    </div>
  )
}
