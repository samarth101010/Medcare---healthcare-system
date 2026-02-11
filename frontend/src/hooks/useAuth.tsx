import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  session: { user: User } | null;
  user: User | null;
  profile: any;
  loading: boolean;
  role: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data
      authAPI.getMe()
        .then(({ data }) => {
          const userData = data.data.user;
          setUser(userData);
          setSession({ user: userData });
          setRole(userData.role);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setSession(null);
          setUser(null);
          setRole(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    localStorage.removeItem('token');
    setSession(null);
    setUser(null);
    setRole(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ session, user, profile: user, loading, role, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
