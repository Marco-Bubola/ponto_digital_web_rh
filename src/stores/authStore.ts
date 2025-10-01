import { create } from 'zustand';
import api from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  companyId: string;
  company?: {
    id: string;
    name: string;
    emailDomain: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('hr_token'),
  isAuthenticated: !!localStorage.getItem('hr_token'),
  
  login: async (email: string, password: string) => {
    try {
      // Chamar API real de login
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Verificar se é Admin, Manager, ou HR
      if (!['admin', 'manager', 'hr'].includes(user.role)) {
        throw new Error('Acesso negado. Apenas Admin, Coordenador ou RH podem acessar este painel.');
      }
      
      localStorage.setItem('hr_token', token);
      
      set({
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          companyId: user.companyId,
          company: user.company
        },
        token,
        isAuthenticated: true,
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  },
  
  logout: () => {
    localStorage.removeItem('hr_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
  
  setUser: (user: User) => {
    set({ user });
  },
}));
