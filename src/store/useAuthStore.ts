// src/store/useAuthStore.ts
import { create } from 'zustand';

interface User {
  username: string;
  password: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  users: Record<string, User>;
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, name: string, email: string) => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set, get) => {
  // Simulated user data
  const initialUsers = JSON.parse(localStorage.getItem('users') || '{}');
  const defaultUser: Record<string, User> = {
    admin: { username: 'admin', password: 'admin', name: 'Admin', email: 'admin@example.com' }
  };
  const usersWithDefault = { ...defaultUser, ...initialUsers };

  return {
    isAuthenticated: !!localStorage.getItem('currentUser'),
    users: usersWithDefault,
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    loading: false,

    login: async (username, password) => {
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate server delay
      const users = get().users;
      if (users[username] && users[username].password === password) {
        localStorage.setItem('currentUser', JSON.stringify(users[username]));
        set({ isAuthenticated: true, currentUser: users[username], loading: false });
        return true;
      }
      set({ loading: false });
      return false;
    },

    register: async (username, password, name, email) => {
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate server delay
      const users = get().users;
      if (users[username]) {
        set({ loading: false });
        return false;
      }
      const newUser = { username, password, name, email };
      users[username] = newUser;
      localStorage.setItem('users', JSON.stringify(users));
      set({ loading: false });
      return true;
    },

    logout: () => {
      localStorage.removeItem('currentUser');
      set({ isAuthenticated: false, currentUser: null });
    }
  };
});

export default useAuthStore;
