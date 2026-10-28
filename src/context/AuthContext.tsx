import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserStatus } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  isAuthenticated: boolean;
  isLocked: boolean;
  login: (userId: string) => void;
  createAccount: (name: string, handle: string, role: string) => void;
  logout: () => void;
  lockTerminal: () => void;
  unlockTerminal: (pin?: string) => boolean;
  updateStatus: (status: UserStatus) => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'obsidian_signal_user_id';
const STORAGE_KEY_USERS = 'obsidian_signal_all_users';
const STORAGE_KEY_LOCKED = 'obsidian_signal_locked';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved && allUsers.some(u => u.id === saved)) {
      return saved;
    }
    return 'usr-alex';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_LOCKED) === 'true';
  });

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOCKED, String(isLocked));
  }, [isLocked]);

  const login = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      setIsAuthenticated(true);
      setIsLocked(false);
    }
  };

  const createAccount = (name: string, handle: string, role: string) => {
    const cleanHandle = handle.replace(/^@/, '').toLowerCase().trim();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      handle: cleanHandle,
      role: role.trim() || 'Systems Operator',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      status: 'active',
      keyFingerprint: `ed25519:${Math.random().toString(36).substring(2, 6).toUpperCase()}..${Math.random().toString(36).substring(2, 6).toUpperCase()}:4096`,
      pingMs: Math.floor(Math.random() * 20) + 10,
      department: 'Tactical Engineering',
    };
    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    setCurrentUserId(newUser.id);
    setIsAuthenticated(true);
    setIsLocked(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const lockTerminal = () => {
    setIsLocked(true);
  };

  const unlockTerminal = (pin?: string) => {
    // PIN simulation (accepts '0000', empty, or any 4 digits)
    setIsLocked(false);
    return true;
  };

  const updateStatus = (status: UserStatus) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === currentUserId ? { ...u, status } : u))
    );
  };

  const switchUser = (userId: string) => {
    login(userId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        isLocked,
        login,
        createAccount,
        logout,
        lockTerminal,
        unlockTerminal,
        updateStatus,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
