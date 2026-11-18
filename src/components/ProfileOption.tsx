import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

interface Props {
  icon: LucideIcon
  label: string
  onClick: () => void
  danger?: boolean
}

export default function ProfileOption({ icon: Icon, label, onClick, danger }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 0',
        width: '100%',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: danger ? '#c0392b' : 'var(--text)',
        fontFamily: "'Lato', sans-serif",
        fontSize: 16,
        textAlign: 'left',
      }}
    >
      <Icon size={20} />
      <span style={{ flex: 1 }}>{label}</span>
      <ChevronRight size={18} color="var(--inactive)" />
    </button>
  )
}
