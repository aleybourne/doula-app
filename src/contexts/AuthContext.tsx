
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { firebaseConfig } from '@/config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

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
  loginWithGoogle: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount and listen for auth state changes
  useEffect(() => {
    // First check localStorage for compatibility with the existing implementation
    const storedUser = localStorage.getItem('push_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Then setup Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to our User format
        const userData: User = {
          id: firebaseUser.uid,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ')[1] || '',
          email: firebaseUser.email || '',
          profileComplete: false // Set initial value, update as needed
        };
        
        localStorage.setItem('push_user', JSON.stringify(userData));
        setUser(userData);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Email/Password login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state listener will update the user state
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Extract user data from Google auth result
      const userData: User = {
        id: firebaseUser.uid,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'Google',
        lastName: firebaseUser.displayName?.split(' ')[1] || 'User',
        email: firebaseUser.email || 'google.user@example.com',
        profileComplete: false
      };
      
      localStorage.setItem('push_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email/password
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userData: User = {
        id: firebaseUser.uid,
        firstName,
        lastName,
        email,
        profileComplete: false
      };
      
      localStorage.setItem('push_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Log out
  const logout = async () => {
    try {
      await signOut(auth);
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
        loginWithGoogle,
        signup,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
