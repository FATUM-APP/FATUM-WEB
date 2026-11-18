import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { FatumUser, Gender, DocumentType } from '../types';

const API_BASE = import.meta.env.DEV
  ? '/api/users'
  : 'https://btx2xtbb3a.execute-api.us-east-1.amazonaws.com';

function getToken(): string | null {
  try { return localStorage.getItem('fatumToken'); } catch { return null; }
}

function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem('fatumToken', token);
    else localStorage.removeItem('fatumToken');
  } catch { /* private browsing */ }
}

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export interface SignUpRequest {
  name: string;
  phone: string;
  gender: Gender;
  email: string;
  username: string;
  password: string;
  birthday: string;
  document: string;
  documentType: DocumentType;
}

interface AuthState {
  user: FatumUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (req: SignUpRequest) => Promise<'needsConfirmation' | 'completed' | null>;
  confirmSignUp: (email: string, code: string) => Promise<boolean>;
  signOut: () => void;
  loadCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FatumUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentUser = useCallback(async () => {
    const token = getToken();
    if (!token) { setUser(null); setIsLoading(false); return; }
    try {
      setIsLoading(true);
      const data = await apiFetch<FatumUser>('/users/me');
      setUser(data);
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadCurrentUser(); }, [loadCurrentUser]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => 'Error al iniciar sesión');
        setError(msg);
        setIsLoading(false);
        return false;
      }
      const data = await res.json();
      setToken(data.token ?? data.idToken ?? data.accessToken ?? '');
      await loadCurrentUser();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión');
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (req: SignUpRequest): Promise<'needsConfirmation' | 'completed' | null> => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => 'Error al registrar');
        setError(msg);
        setIsLoading(false);
        return null;
      }
      const data = await res.json();
      setIsLoading(false);
      return data.confirmed ? 'completed' : 'needsConfirmation';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al registrar');
      setIsLoading(false);
      return null;
    }
  };

  const confirmSignUp = async (email: string, code: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      setIsLoading(false);
      if (!res.ok) {
        const msg = await res.text().catch(() => 'Código incorrecto');
        setError(msg);
        return false;
      }
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de confirmación');
      setIsLoading(false);
      return false;
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signIn,
        signUp,
        confirmSignUp,
        signOut,
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
