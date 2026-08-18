"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'CEO' | 'WAREHOUSE_ADMIN' | 'BRAND_MANAGER';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('CEO');

  // Lưu role vào localStorage để giữ trạng thái khi reload trang (demo purposes)
  useEffect(() => {
    const savedRole = localStorage.getItem('mock_role') as UserRole;
    if (savedRole) setRole(savedRole);
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('mock_role', newRole);
  };

  const isAdmin = role === 'WAREHOUSE_ADMIN' || role === 'CEO';

  return (
    <AuthContext.Provider value={{
      role,
      setRole: handleSetRole,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
