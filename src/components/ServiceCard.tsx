import { Heart, Star, Clock, MapPin } from 'lucide-react';
import type { FatumItem } from '../types';
import { formatPrice, formatEstimatedTime } from '../types';

interface ServiceCardProps {
  item: FatumItem;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  onClick?: () => void;
}

export default function ServiceCard({ item, onFavoriteToggle, isFavorite, onClick }: ServiceCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E9EA',
        borderRadius: 12,
        cursor: onClick ? 'pointer' : 'default',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          minWidth: 110,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#E5E9EA',
        }}
      >
        {item.coverImageUrl ? (
          <img
            src={item.coverImageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B8C2C0',
            fontFamily: "'Lato', sans-serif",
            fontSize: 12,
          }}>
            Sin imagen
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{
            margin: 0,
            fontFamily: "'Poppins', sans-serif",
            fontSize: 16,
            fontWeight: 500,
            color: '#192422',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {item.title}
          </h3>
          {onFavoriteToggle && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFavoriteToggle(); }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                flexShrink: 0,
              }}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart
                size={20}
                color="#7FCD6C"
                fill={isFavorite ? '#7FCD6C' : 'none'}
              />
            </button>
          )}
        </div>

        {(item.averageRating !== undefined && item.averageRating > 0) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={14} color="#F5A623" fill="#F5A623" />
            <span style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 13,
              color: '#192422',
            }}>
              {item.averageRating.toFixed(1)}
              {item.totalReviews !== undefined && (
                <span style={{ color: '#B8C2C0' }}> ({item.totalReviews})</span>
              )}
            </span>
          </div>
        )}

        <p style={{
          margin: 0,
          fontFamily: "'Lato', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: '#123F35',
        }}>
          ${formatPrice(item.basePrice)}
          <span style={{ fontWeight: 400, fontSize: 13, color: '#B8C2C0' }}>
            {item.priceType === 'HOURLY' ? ' /hora' : ''}
          </span>
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            color: '#B8C2C0',
          }}>
            <MapPin size={13} />
            {item.jobType === 'PRESENCIAL' ? 'Presencial' : item.jobType}
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            color: '#B8C2C0',
          }}>
            <Clock size={13} />
            {formatEstimatedTime(item.defaultEstimatedTime)}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 10,
            backgroundColor: '#D4E2D0',
            fontFamily: "'Lato', sans-serif",
            fontSize: 12,
            color: '#123F35',
          }}>
            {item.category}
          </span>
          {item.isNegotiable && (
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 10,
              backgroundColor: '#F5FAF9',
              fontFamily: "'Lato', sans-serif",
              fontSize: 12,
              color: '#2BB6A8',
            }}>
              Negociable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
