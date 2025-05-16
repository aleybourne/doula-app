
import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseConfig } from '@/config/firebase';
import { loadClientsForCurrentUser } from '@/components/clients/store/clientStore';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => void;
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
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('push_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Load clients for this user
      loadClientsForCurrentUser();
    }
    setIsLoading(false);
  }, []);

  // Email/Password login - Mock implementation
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Since Firebase API is not working, we'll simulate a login
      // In a real app, this would validate with Firebase
      const mockUser: User = {
        id: 'mock-user-id-' + Date.now(),
        firstName: 'Test',
        lastName: 'User',
        email,
        profileComplete: false
      };
      
      localStorage.setItem('push_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Load clients for this user after login
      loadClientsForCurrentUser();
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email/password - Mock implementation
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      // Since Firebase API is not working, we'll simulate a signup
      // In a real app, this would register with Firebase
      const mockUser: User = {
        id: 'mock-user-id-' + Date.now(),
        firstName,
        lastName,
        email,
        profileComplete: false
      };
      
      localStorage.setItem('push_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Load clients for this user after signup
      loadClientsForCurrentUser();
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed. Please try again with different credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Log out
  const logout = async () => {
    try {
      localStorage.removeItem('push_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...userData,
    };
    
    localStorage.setItem('push_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
