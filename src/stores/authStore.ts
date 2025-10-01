import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
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
    // Implementar chamada real à API
    // Por enquanto, simulação
    const mockUser: User = {
      id: '1',
      name: 'RH Admin',
      email: email,
      role: 'hr',
      department: 'Recursos Humanos',
    };
    
    const mockToken = 'mock_token_' + Date.now();
    localStorage.setItem('hr_token', mockToken);
    
    set({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
    });
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
