import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import CategoryChip from '../components/CategoryChip'
import FatumButton from '../components/FatumButton'
import { useCatalog } from '../context/CatalogContext'
import { useAuth } from '../context/AuthContext'
import { useResponsive } from '../hooks/useResponsive'
import type { ServiceStatus } from '../types'

export default function MyServicesPage() {
  const { items, categories } = useCatalog()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { isMobile, layout } = useResponsive()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [statusFilter] = useState<ServiceStatus | null>(null)

  const myItems = items.filter(i => i.providerId === user?.userId)
  const filtered = myItems
    .filter(i => !selectedCategory || i.category === selectedCategory)
    .filter(i => !statusFilter || i.status === statusFilter)

  return (
    <div style={{ padding: layout.padding, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: layout.spacingMedium }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brand-primary)' }}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-header" style={{ color: 'var(--brand-primary)', flex: 1 }}>
          Mis servicios
        </h1>
      </div>

      <div style={{ marginBottom: layout.spacingMedium }}>
        <FatumButton variant="third" onClick={() => navigate('/create-service')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={18} /> Ofrecer Servicio
          </div>
        </FatumButton>
      </div>

      <div style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 8,
        marginBottom: layout.spacingMedium,
        WebkitOverflowScrolling: 'touch',
      }}>
        <CategoryChip name="Todos" selected={!selectedCategory} onClick={() => setSelectedCategory(null)} />
        {categories.map(cat => (
          <CategoryChip
            key={cat.slug}
            name={cat.name}
            logoUrl={cat.logoUrl}
            selected={selectedCategory === cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--inactive)' }}>
          <p className="text-body">No tienes servicios creados</p>
          <p className="text-caption" style={{ marginTop: 8 }}>Presiona el botón para ofrecer tu primer servicio</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: layout.internalSpacing,
        }}>
          {filtered.map(item => (
            <ServiceCard key={item.id} item={item} onClick={() => navigate(`/service/${item.id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}
