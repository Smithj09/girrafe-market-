import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AuthUser } from '../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    const init = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth init error:', err);
      }
      setLoading(false);
    };
    
    init();
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    await authService.signUp(email, password, fullName);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}