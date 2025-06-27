
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { authService } from '@/api/services/authService';
import type { LoginRequest, RegisterRequest, GoogleAuthRequest, UserRole } from '@/api/types';

// Our app's User interface matches the backend response
export interface User {
  id: string;
  fullname?: string;
  email: string;
  avatarUrl?: string;
  role?: UserRole;
}

interface GoogleAuthResponse {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (googleUserData: GoogleAuthResponse) => Promise<boolean>;
  register: (email: string, password: string, fullName: string,phone:string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const apiUser = await authService.getCurrentUser();
          setUser(apiUser);
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const credentials: LoginRequest = { email, password };
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Đăng nhập thành công');
      return true;
    } catch (error) {
      toast.error('Email hoặc mật khẩu không đúng');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google login function using API
  const loginWithGoogle = async (googleUserData: GoogleAuthResponse): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(googleUserData);
      // Prepare data for API
      const googleAuthData: GoogleAuthRequest = {
        email: googleUserData.email,
        googleId: googleUserData.id,
        avatarUrl: googleUserData.picture,
        fullname: googleUserData.name,
      };
      
      // Call API
      const response = await authService.googleAuth(googleAuthData);
      
      // Store the token
      localStorage.setItem('accessToken', response.accessToken);
      
      // User data từ API đã có cấu trúc phù hợp
      const appUser = {
        ...response.user,
        provider: 'google' as const
      };
      
      localStorage.setItem('user_data', JSON.stringify(appUser));
      setUser(appUser);
      
      toast.success('Đăng nhập với Google thành công');
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Đã xảy ra lỗi khi đăng nhập với Google');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real registration function using API
  const register = async (email: string, password: string, fullname: string,phone:string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const checkEmail = await authService.checkEmail(email);
      if (checkEmail) {
        toast.error('Tài khoản đã tồn tại');
        return false;
      }
      const checkPhone = await authService.checkPhone(phone);
      if (checkPhone) {
        toast.error('Số điện thoại đã tồn tại');
        return false;
      }
      // Prepare data for API
      const registerData: RegisterRequest = {
        email,
        password,
        fullname,
        phone
      };
      
      // Call API
      const response = await authService.register(registerData);
      
      // Store the token
      localStorage.setItem('accessToken', response.accessToken);
      
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Đăng ký tài khoản thành công');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Đã xảy ra lỗi khi đăng ký');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call API to logout
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with client-side logout even if API call fails
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user_data');
      setUser(null);
      toast.info('Đã đăng xuất');
      navigate('/');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
