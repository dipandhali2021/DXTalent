import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'recruiter' | 'admin';
  isEmailVerified: boolean;
  profilePicture?: string;
  stats: {
    skillsMastered: number;
    challengesCompleted: number;
    xpPoints: number;
    level: number;
    league?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
    currentStreak?: number;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  googleLogin: (
    credential: string,
    email: string,
    name: string,
    picture?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (profileData: {
    username?: string;
    email?: string;
    profilePicture?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          // Verify token by fetching current user
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        setUser(response.data.user);
        toast({
          title: '✅ Login Successful!',
          description: `Welcome back, ${response.data.user.username}!`,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast({
        title: '❌ Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authAPI.register({
        username,
        email,
        password,
        role: 'user', // Always register as user, role will be assigned based on subscription
      });

      if (response.success) {
        toast({
          title: '🎉 Registration Successful!',
          description: 'Please check your email to verify your account.',
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast({
        title: '❌ Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const googleLogin = async (
    credential: string,
    email: string,
    name: string,
    picture?: string
  ) => {
    try {
      const response = await authAPI.googleAuth({
        credential,
        email,
        name,
        picture,
      });

      if (response.success) {
        setUser(response.data.user);
        toast({
          title: '✅ Google Login Successful!',
          description: `Welcome, ${response.data.user.username}!`,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Google login failed. Please try again.';
      toast({
        title: '❌ Google Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast({
        title: '👋 Logged Out',
        description: 'See you soon!',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear local state anyway
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const updateProfile = async (profileData: {
    username?: string;
    email?: string;
    profilePicture?: string;
  }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.success) {
        setUser(response.data.user);
        toast({
          title: '✅ Profile Updated!',
          description: response.message,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to update profile. Please try again.';
      toast({
        title: '❌ Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
