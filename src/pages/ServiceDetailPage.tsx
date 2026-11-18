import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react'
import FatumButton from '../components/FatumButton'
import ServiceStatusTag from '../components/ServiceStatusTag'
import CategoryChip from '../components/CategoryChip'
import { useCatalog } from '../context/CatalogContext'
import { useResponsive } from '../hooks/useResponsive'
import { formatPrice, formatEstimatedTime } from '../types'

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { items } = useCatalog()
  const navigate = useNavigate()
  const { isMobile, layout } = useResponsive()
  const [photoIndex, setPhotoIndex] = useState(0)

  const item = items.find(i => i.id === id)

  if (!item) {
    return (
      <div style={{ padding: layout.padding, maxWidth: 900, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={22} />
          <span className="text-body">Volver</span>
        </button>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--inactive)' }}>
          <p className="text-header">Servicio no encontrado</p>
        </div>
      </div>
    )
  }

  const photos = item.coverImageUrl ? [item.coverImageUrl] : []
  const priceLabel = item.priceType === 'HOURLY' ? '/hora' : ''

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ padding: `${layout.padding}px ${layout.padding}px 0` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: layout.spacingMedium }}>
          <ArrowLeft size={22} />
          <span className="text-body">Volver</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: layout.externalSpacing }}>
        {/* Photo carousel */}
        <div style={{
          width: isMobile ? '100%' : '45%',
          aspectRatio: isMobile ? '16/10' : '1/1',
          backgroundColor: 'var(--secondary-container)',
          borderRadius: isMobile ? 0 : 16,
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}>
          {photos.length > 0 ? (
            <>
              <img src={photos[photoIndex]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {photos.length > 1 && (
                <>
                  <button onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setPhotoIndex(Math.min(photos.length - 1, photoIndex + 1))} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--inactive)' }}>
              <span className="text-body">Sin foto</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ flex: 1, padding: isMobile ? layout.padding : `0 ${layout.padding}px ${layout.padding}px 0` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 className="text-header" style={{ color: 'var(--text)' }}>{item.title}</h1>
            <ServiceStatusTag status={item.status} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <CategoryChip name={item.category} selected={false} onClick={() => {}} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: layout.spacingMedium, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={16} fill="var(--fatum-accent)" color="var(--fatum-accent)" />
              <span className="text-body" style={{ fontWeight: 600 }}>
                {item.averageRating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-caption" style={{ color: 'var(--inactive)' }}>
                ({item.totalReviews || 0} reseñas)
              </span>
            </div>
            <span className="text-body" style={{ color: 'var(--brand-primary)' }}>
              @{item.providerUsername}
            </span>
          </div>

          <p className="text-body" style={{ color: 'var(--text)', marginBottom: layout.spacingMedium, lineHeight: 1.6 }}>
            {item.description}
          </p>

          {/* Info grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
            marginBottom: layout.externalSpacing,
          }}>
            <div style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <DollarSign size={16} color="var(--brand-primary)" />
                <span className="text-footer" style={{ color: 'var(--inactive)' }}>Precio</span>
              </div>
              <span className="text-subheader" style={{ color: 'var(--brand-primary)' }}>
                ${formatPrice(item.basePrice)}{priceLabel}
              </span>
              {item.isNegotiable && (
                <span className="text-footer" style={{ color: 'var(--fatum-accent)', display: 'block' }}>
                  Negociable
                </span>
              )}
            </div>
            <div style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <MapPin size={16} color="var(--brand-primary)" />
                <span className="text-footer" style={{ color: 'var(--inactive)' }}>Modalidad</span>
              </div>
              <span className="text-body" style={{ fontWeight: 600, color: 'var(--text)' }}>
                Presencial
              </span>
            </div>
            <div style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Clock size={16} color="var(--brand-primary)" />
                <span className="text-footer" style={{ color: 'var(--inactive)' }}>Tiempo est.</span>
              </div>
              <span className="text-body" style={{ fontWeight: 600, color: 'var(--text)' }}>
                {formatEstimatedTime(item.defaultEstimatedTime)}
              </span>
            </div>
          </div>

          {/* Fixed questions */}
          {item.fixedQuestions.length > 0 && (
            <div style={{ marginBottom: layout.externalSpacing }}>
              <h3 className="text-subheader" style={{ color: 'var(--text)', marginBottom: layout.internalSpacing }}>
                Preguntas del servicio
              </h3>
              {item.fixedQuestions.map((q, i) => (
                <div key={i} style={{
                  padding: 14,
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  marginBottom: 8,
                }}>
                  <span className="text-body" style={{ fontWeight: 600, color: 'var(--text)' }}>{q.question}</span>
                  {q.options && q.options.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {q.options.map((opt, oi) => (
                        <span key={oi} style={{
                          padding: '4px 12px',
                          borderRadius: 20,
                          border: '1px solid var(--border)',
                          fontSize: 13,
                          color: 'var(--text)',
                        }}>
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom hiring bar */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'var(--brand-primary)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: isMobile ? 0 : '0 0 16px 16px',
      }}>
        <div>
          <span className="text-footer" style={{ color: 'var(--primary-container)' }}>Total</span>
          <div className="text-header" style={{ color: 'var(--brand-secondary)' }}>
            ${formatPrice(item.basePrice)}
          </div>
        </div>
        <FatumButton variant="primary" onClick={() => {}}>
          Contratar
        </FatumButton>
      </div>
    </div>
  )
}
