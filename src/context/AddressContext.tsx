import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FatumAddress } from '../types';
import { authHeaders } from '../utils/cognito';

const API_BASE = 'https://btx2xtbb3a.execute-api.us-east-1.amazonaws.com';

interface AddressState {
  addresses: FatumAddress[];
  principalAddress: FatumAddress | null;
  isLoading: boolean;
  loadAddresses: () => Promise<void>;
  createAddress: (addr: Omit<FatumAddress, 'userName'>) => Promise<boolean>;
  makePrincipal: (alias: string) => Promise<boolean>;
  deleteAddress: (alias: string) => Promise<boolean>;
}

const AddressContext = createContext<AddressState | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<FatumAddress[]>([]);
  const [principalAddress, setPrincipalAddress] = useState<FatumAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const headers = await authHeaders();
      const [allRes, principalRes] = await Promise.all([
        fetch(`${API_BASE}/users/addresses/mine`, { headers }),
        fetch(`${API_BASE}/users/addresses/principal`, { headers }),
      ]);
      if (allRes.ok) setAddresses(await allRes.json());
      if (principalRes.ok) setPrincipalAddress(await principalRes.json());
    } catch { /* network error */ }
    finally { setIsLoading(false); }
  }, []);

  const createAddress = async (addr: Omit<FatumAddress, 'userName'>): Promise<boolean> => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/users/addresses/new`, {
        method: 'POST',
        headers,
        body: JSON.stringify(addr),
      });
      if (res.ok) { await loadAddresses(); return true; }
    } catch { /* network error */ }
    return false;
  };

  const makePrincipal = async (alias: string): Promise<boolean> => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/users/addresses/principal?alias=${encodeURIComponent(alias)}`, {
        method: 'PUT',
        headers,
      });
      if (res.ok) { await loadAddresses(); return true; }
    } catch { /* network error */ }
    return false;
  };

  const deleteAddress = async (alias: string): Promise<boolean> => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/users/addresses/delete?alias=${encodeURIComponent(alias)}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) { await loadAddresses(); return true; }
    } catch { /* network error */ }
    return false;
  };

  return (
    <AddressContext.Provider value={{ addresses, principalAddress, isLoading, loadAddresses, createAddress, makePrincipal, deleteAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses(): AddressState {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddresses must be used within AddressProvider');
  return ctx;
}
