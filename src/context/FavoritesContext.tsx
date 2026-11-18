import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FatumItem } from '../types';

const API_BASE = import.meta.env.DEV
  ? '/api/catalog'
  : 'https://api.fatumapp.click/catalog';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('fatumToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
}

interface FavoritesState {
  favorites: FatumItem[];
  isLoading: boolean;
  loadFavorites: (categorySlug?: string) => Promise<void>;
  addFavorite: (itemId: string) => Promise<boolean>;
  removeFavorite: (itemId: string) => Promise<boolean>;
  isFavorite: (itemId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesState | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FatumItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFavorites = useCallback(async (categorySlug?: string) => {
    try {
      setIsLoading(true);
      const url = categorySlug
        ? `${API_BASE}/favorites?category=${categorySlug}`
        : `${API_BASE}/favorites`;
      const res = await fetch(url, { headers: authHeaders() });
      if (res.ok) setFavorites(await res.json());
    } catch { /* network error */ }
    finally { setIsLoading(false); }
  }, []);

  const addFavorite = async (itemId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/favorites/${itemId}`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (res.ok) {
        await loadFavorites();
        return true;
      }
    } catch { /* network error */ }
    return false;
  };

  const removeFavorite = async (itemId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/favorites/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.id !== itemId));
        return true;
      }
    } catch { /* network error */ }
    return false;
  };

  const isFavorite = (itemId: string): boolean => favorites.some(f => f.id === itemId);

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, loadFavorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesState {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
