import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FatumOrder } from '../types';

const API_BASE = import.meta.env.DEV
  ? '/api/order'
  : 'https://api.fatumapp.click/order';

type OrderFilter = 'pending' | 'completed' | 'review';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('fatumToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
}

interface OrderState {
  orders: FatumOrder[];
  filter: OrderFilter;
  isLoading: boolean;
  setFilter: (f: OrderFilter) => void;
  loadOrders: () => Promise<void>;
  accept: (id: string, estimatedMinutes: number) => Promise<boolean>;
  reject: (id: string, reason: string) => Promise<boolean>;
  cancel: (id: string, reason: string) => Promise<boolean>;
  confirm: (id: string, stage: string) => Promise<boolean>;
}

const OrderContext = createContext<OrderState | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<FatumOrder[]>([]);
  const [filter, setFilter] = useState<OrderFilter>('pending');
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/mine?filter=${filter}`, { headers: authHeaders() });
      if (res.ok) setOrders(await res.json());
    } catch { /* network error */ }
    finally { setIsLoading(false); }
  }, [filter]);

  const accept = async (id: string, estimatedMinutes: number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${id}/accept`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ estimatedMinutes }),
      });
      if (res.ok) { await loadOrders(); return true; }
    } catch { /* network error */ }
    return false;
  };

  const reject = async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${id}/reject`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ reason }),
      });
      if (res.ok) { await loadOrders(); return true; }
    } catch { /* network error */ }
    return false;
  };

  const cancel = async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${id}/cancel`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ reason }),
      });
      if (res.ok) { await loadOrders(); return true; }
    } catch { /* network error */ }
    return false;
  };

  const confirm = async (id: string, stage: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${id}/confirm`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ stage }),
      });
      if (res.ok) { await loadOrders(); return true; }
    } catch { /* network error */ }
    return false;
  };

  return (
    <OrderContext.Provider value={{ orders, filter, isLoading, setFilter, loadOrders, accept, reject, cancel, confirm }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders(): OrderState {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
