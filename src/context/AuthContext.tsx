import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js';
import type { FatumUser, Gender, DocumentType } from '../types';
import { USER_POOL, getIdToken } from '../utils/cognito';

const USER_API = 'https://btx2xtbb3a.execute-api.us-east-1.amazonaws.com';

async function fetchUserProfile(): Promise<FatumUser> {
  const token = await getIdToken();
  console.log('[Fatum Auth] GET /users/me');
  const res = await fetch(`${USER_API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`[Fatum Auth] /users/me -> ${res.status}`);
  if (!res.ok) throw new Error(`/users/me ${res.status}`);
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
    const currentUser = USER_POOL.getCurrentUser();
    console.log('[Fatum Auth] loadCurrentUser, session exists:', !!currentUser);
    if (!currentUser) { setUser(null); setIsLoading(false); return; }
    try {
      setIsLoading(true);
      const profile = await fetchUserProfile();
      console.log('[Fatum Auth] loadCurrentUser success:', profile.userId);
      setUser(profile);
    } catch (e) {
      console.error('[Fatum Auth] loadCurrentUser failed:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadCurrentUser(); }, [loadCurrentUser]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    console.log('[Fatum Auth] signIn', email);
    try {
      const cognitoUser = new CognitoUser({ Username: email, Pool: USER_POOL });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });

      await new Promise<CognitoUserSession>((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
          onSuccess: resolve,
          onFailure: reject,
          newPasswordRequired: () => reject(new Error('Se requiere cambiar la contraseña')),
        });
      });
      console.log('[Fatum Auth] Cognito signIn success');
      await loadCurrentUser();
      return !!user || (USER_POOL.getCurrentUser() !== null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al iniciar sesión';
      console.error('[Fatum Auth] signIn error:', msg);
      setError(msg);
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (req: SignUpRequest): Promise<'needsConfirmation' | 'completed' | null> => {
    setError(null);
    setIsLoading(true);
    console.log('[Fatum Auth] signUp', req.email);
    try {
      const attributes = [
        new CognitoUserAttribute({ Name: 'email', Value: req.email }),
        new CognitoUserAttribute({ Name: 'name', Value: req.name }),
        new CognitoUserAttribute({ Name: 'phone_number', Value: `+57${req.phone}` }),
        new CognitoUserAttribute({ Name: 'birthdate', Value: req.birthday }),
        new CognitoUserAttribute({ Name: 'gender', Value: req.gender }),
        new CognitoUserAttribute({ Name: 'custom:username', Value: req.username }),
        new CognitoUserAttribute({ Name: 'custom:document', Value: req.document }),
        new CognitoUserAttribute({ Name: 'custom:documentType', Value: req.documentType }),
      ];

      const result = await new Promise<{ userConfirmed: boolean }>((resolve, reject) => {
        USER_POOL.signUp(req.email, req.password, attributes, [], (err, data) => {
          if (err) return reject(err);
          resolve({ userConfirmed: data?.userConfirmed ?? false });
        });
      });

      console.log('[Fatum Auth] signUp result, confirmed:', result.userConfirmed);
      setIsLoading(false);
      return result.userConfirmed ? 'completed' : 'needsConfirmation';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al registrar';
      console.error('[Fatum Auth] signUp error:', msg);
      setError(msg);
      setIsLoading(false);
      return null;
    }
  };

  const confirmSignUp = async (email: string, code: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    console.log('[Fatum Auth] confirmSignUp', email);
    try {
      const cognitoUser = new CognitoUser({ Username: email, Pool: USER_POOL });
      await new Promise<void>((resolve, reject) => {
        cognitoUser.confirmRegistration(code, true, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      console.log('[Fatum Auth] confirmSignUp success');
      setIsLoading(false);
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Código incorrecto';
      console.error('[Fatum Auth] confirmSignUp error:', msg);
      setError(msg);
      setIsLoading(false);
      return false;
    }
  };

  const signOut = () => {
    const currentUser = USER_POOL.getCurrentUser();
    if (currentUser) currentUser.signOut();
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
