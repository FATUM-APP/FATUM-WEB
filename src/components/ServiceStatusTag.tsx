import type { ServiceStatus } from '../types';
import { SERVICE_STATUS_COLORS, SERVICE_STATUS_LABELS } from '../types';

interface ServiceStatusTagProps {
  status: ServiceStatus;
}

export default function ServiceStatusTag({ status }: ServiceStatusTagProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 12,
        backgroundColor: SERVICE_STATUS_COLORS[status],
        color: '#FFFFFF',
        fontFamily: "'Lato', sans-serif",
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {SERVICE_STATUS_LABELS[status]}
    </span>
  );
}
