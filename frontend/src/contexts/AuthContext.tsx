import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '../types/auth';
import { decodeToken, isTokenExpired } from '../utils/tokenUtils';
import { login as loginService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Verificar token al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      const user = decodeToken(token);
      if (user) {
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
      } else {
        localStorage.removeItem('token');
      }
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  const login = async (correo: string, password: string) => {
    try {
      const response = await loginService({ correo, password });
      const { token } = response;
      const user = decodeToken(token);
      if (user) {
        localStorage.setItem('token', token);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
        toast.success('Inicio de sesión exitoso');
      } else {
        throw new Error('Token inválido');
      }
    } catch (error: any) {
      // Manejar error de la API
      const errorMsg = error.response?.data?.error || error.message || 'Error al iniciar sesión';
      toast.error(errorMsg);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};