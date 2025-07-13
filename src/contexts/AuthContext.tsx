
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
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
  const [isLoading, setIsLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log("🔐 User authentication state changed, verifying token...");
        
        try {
          // Ensure we have a valid token before proceeding
          const token = await firebaseUser.getIdToken();
          console.log("✅ Authentication token verified, proceeding with user setup");
          
          // User is signed in, get their profile data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              id: firebaseUser.uid,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: firebaseUser.email || '',
              profileComplete: userData.profileComplete || false,
            };
            setUser(user);
            
            // Only load clients after full authentication is confirmed
            console.log("👤 User profile loaded, now loading clients...");
            loadClientsForCurrentUser();
          } else {
            // User document doesn't exist, create a basic one
            const user: User = {
              id: firebaseUser.uid,
              firstName: '',
              lastName: '',
              email: firebaseUser.email || '',
              profileComplete: false,
            };
            setUser(user);
            
            // Still load clients even if profile is incomplete
            console.log("👤 Basic user profile created, loading clients...");
            loadClientsForCurrentUser();
          }
        } catch (error) {
          console.error("❌ Error during authentication setup:", error);
          // If token verification fails, treat as unauthenticated
          setUser(null);
        }
      } else {
        // User is signed out
        console.log("🚪 User signed out");
        setUser(null);
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
      // User state will be updated by the onAuthStateChanged listener
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email/password
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        firstName,
        lastName,
        email,
        profileComplete: false,
        createdAt: new Date().toISOString(),
      });

      // User state will be updated by the onAuthStateChanged listener
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Log out
  const logout = async () => {
    try {
      await signOut(auth);
      // User state will be updated by the onAuthStateChanged listener
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...userData,
    };
    
    try {
      // Update in Firestore
      await setDoc(doc(db, 'users', user.id), {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profileComplete: updatedUser.profileComplete,
        ...userData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Update local state
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
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
