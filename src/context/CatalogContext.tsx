import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FatumCategory, FatumItem } from '../types';

const API_BASE = 'https://api.fatumapp.click/catalog';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('fatumToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
}

interface CatalogState {
  categories: FatumCategory[];
  items: FatumItem[];
  isLoading: boolean;
  loadCategories: () => Promise<void>;
  loadItems: (categorySlug?: string) => Promise<void>;
  searchItems: (query: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogState | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<FatumCategory[]>([]);
  const [items, setItems] = useState<FatumItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/categories`, { headers: authHeaders() });
      if (res.ok) setCategories(await res.json());
    } catch { /* network error */ }
    finally { setIsLoading(false); }
  }, []);

  const loadItems = useCallback(async (categorySlug?: string) => {
    try {
      setIsLoading(true);
      const url = categorySlug ? `${API_BASE}/items?category=${categorySlug}` : `${API_BASE}/items`;
      const res = await fetch(url, { headers: authHeaders() });
      if (res.ok) setItems(await res.json());
    } catch { /* network error */ }
    finally { setIsLoading(false); }
  }, []);

  const searchItems = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/items?search=${encodeURIComponent(query)}`, { headers: authHeaders() });
      if (res.ok) setItems(await res.json());
    } catch { /* network error */ }
    finally { setIsLoading(false); }
  }, []);

  return (
    <CatalogContext.Provider value={{ categories, items, isLoading, loadCategories, loadItems, searchItems }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogState {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
