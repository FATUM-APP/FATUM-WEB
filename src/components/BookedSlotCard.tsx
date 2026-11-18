import type { BookedSlot, OrderStatus } from '../types';
import { formatEstimatedTime } from '../types';

const STATUS_COLORS: Partial<Record<OrderStatus, string>> = {
  PENDING: '#B8C2C0',
  ACCEPTED: '#7FCD6C',
  DELIVERING: '#2BB6A8',
  COMPLETED: '#7FCD6C',
};

interface BookedSlotCardProps {
  slot: BookedSlot;
  onClick?: () => void;
}

export default function BookedSlotCard({ slot, onClick }: BookedSlotCardProps) {
  const color = STATUS_COLORS[slot.status] || '#B8C2C0';
  const start = new Date(slot.booking);
  const end = new Date(slot.endTime);

  const timeRange = `${start.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: `${color}20`,
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid #E5E9EA',
      }}
    >
      <div style={{ width: 4, backgroundColor: color, flexShrink: 0 }} />
      <div style={{ padding: 12, flex: 1 }}>
        <h4 style={{
          margin: 0,
          fontFamily: "'Poppins', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: '#192422',
          marginBottom: 4,
        }}>
          {slot.serviceTitle}
        </h4>
        <p style={{
          margin: 0,
          fontFamily: "'Lato', sans-serif",
          fontSize: 13,
          color: '#B8C2C0',
        }}>
          {timeRange} · {formatEstimatedTime(slot.estimatedTime)}
        </p>
      </div>
    </div>
  );
}
