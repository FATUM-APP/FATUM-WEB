import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import OrderCard from '../components/OrderCard';

type OrderFilter = 'pending' | 'completed' | 'review';

const TABS: { key: OrderFilter; label: string }[] = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Completados' },
  { key: 'review', label: 'Revisión' },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, loadOrders, isLoading } = useOrders();
  const [filter, setFilter] = useState<OrderFilter>('pending');

  useEffect(() => {
    loadOrders();
  }, []);

  const role = user?.role ?? 'CLIENT';

  const filtered = orders.filter((o) => {
    switch (filter) {
      case 'pending':
        return ['PENDING', 'ACCEPTED', 'DELIVERING'].includes(o.status);
      case 'completed':
        return ['COMPLETED', 'CANCELLED', 'REFUNDED', 'SOLVED'].includes(o.status);
      case 'review':
        return ['REJECTED', 'NOT_DELIVERED', 'NOT_PAYED', 'DISPUTED'].includes(o.status);
    }
  });

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Órdenes</h1>

      {/* Segmented Picker */}
      <div style={styles.segmented}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              ...styles.segmentBtn,
              backgroundColor:
                filter === tab.key
                  ? 'var(--brand-primary)'
                  : 'transparent',
              color:
                filter === tab.key
                  ? 'var(--brand-secondary)'
                  : 'var(--text)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No tienes órdenes en esta sección</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: 'var(--brand-secondary)',
    minHeight: '100vh',
    padding: 16,
    paddingBottom: 80,
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text)',
    margin: '0 0 16px',
  },
  segmented: {
    display: 'flex',
    backgroundColor: 'var(--secondary-container)',
    borderRadius: 20,
    padding: 3,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    border: 'none',
    borderRadius: 18,
    padding: '10px 0',
    fontFamily: "'Lato', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: 48,
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid var(--border)',
    borderTopColor: 'var(--brand-primary)',
    borderRadius: '50%',
    animation: 'fatum-spin 0.6s linear infinite',
  },
  empty: {
    textAlign: 'center' as const,
    padding: 48,
  },
  emptyText: {
    fontFamily: "'Lato', sans-serif",
    fontSize: 16,
    color: 'var(--inactive)',
  },
};
