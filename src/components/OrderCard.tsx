import { Calendar, User, DollarSign, Clock, Info, MessageCircle } from 'lucide-react';
import type { FatumOrder, UserRole, OrderStatus } from '../types';
import { ORDER_STATUS_LABELS, formatPrice, formatEstimatedTime } from '../types';
import FatumButton from './FatumButton';

const STATUS_COLORS: Partial<Record<OrderStatus, string>> = {
  PENDING: '#B8C2C0',
  ACCEPTED: '#7FCD6C',
  DELIVERING: '#2BB6A8',
  COMPLETED: '#7FCD6C',
  REJECTED: '#34344A',
  CANCELLED: '#34344A',
  DISPUTED: '#E5924A',
  NOT_DELIVERED: '#34344A',
  NOT_PAYED: '#E5924A',
  SOLVED: '#2BB6A8',
  REFUNDED: '#B8C2C0',
};

interface OrderCardProps {
  order: FatumOrder;
  onAction?: (action: string, orderId: string) => void;
  role: UserRole;
}

export default function OrderCard({ order, onAction, role }: OrderCardProps) {
  const statusColor = STATUS_COLORS[order.status] || '#B8C2C0';
  const bookingDate = order.booking ? new Date(order.booking) : null;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E9EA',
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{
            margin: 0,
            fontFamily: "'Poppins', sans-serif",
            fontSize: 16,
            fontWeight: 500,
            color: '#192422',
          }}>
            {order.catalogItemTitle}
          </h3>
          <span style={{
            padding: '3px 10px',
            borderRadius: 12,
            backgroundColor: statusColor,
            color: '#FFFFFF',
            fontFamily: "'Lato', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <User size={14} color="#B8C2C0" />
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: '#192422' }}>
            @{order.counterpartUsername}
          </span>
        </div>

        {order.negotiatedPrice !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <DollarSign size={14} color="#B8C2C0" />
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: '#123F35', fontWeight: 700 }}>
              ${formatPrice(order.negotiatedPrice)}
            </span>
          </div>
        )}

        {order.estimatedTime !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Clock size={14} color="#B8C2C0" />
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: '#192422' }}>
              {formatEstimatedTime(order.estimatedTime)}
            </span>
          </div>
        )}

        {onAction && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {order.status === 'PENDING' && role === 'PROFESSIONAL' && (
              <>
                <FatumButton variant="compact" onClick={() => onAction('accept', order.id)}>
                  Aceptar
                </FatumButton>
                <FatumButton variant="outlined" onClick={() => onAction('reject', order.id)}>
                  Rechazar
                </FatumButton>
              </>
            )}
            {order.status === 'PENDING' && role === 'CLIENT' && (
              <FatumButton variant="outlined" onClick={() => onAction('cancel', order.id)}>
                Cancelar
              </FatumButton>
            )}
            {order.status === 'ACCEPTED' && (
              <FatumButton variant="compact" onClick={() => onAction('confirm', order.id)}>
                Confirmar inicio
              </FatumButton>
            )}
            {order.status === 'DELIVERING' && (
              <FatumButton variant="compact" onClick={() => onAction('complete', order.id)}>
                Confirmar entrega
              </FatumButton>
            )}
            <button
              type="button"
              onClick={() => onAction?.('detail', order.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
              }}
              aria-label="Ver detalles"
            >
              <Info size={20} color="#123F35" />
            </button>
          </div>
        )}
      </div>

      <div style={{
        borderTop: '1px solid #E5E9EA',
        padding: '10px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {bookingDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} color="#B8C2C0" />
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: '#B8C2C0' }}>
              {bookingDate.toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              {' '}
              {bookingDate.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
        {order.reason && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MessageCircle size={14} color="#B8C2C0" />
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: '#B8C2C0' }}>
              {order.reason}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
