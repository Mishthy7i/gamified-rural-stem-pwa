import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export type UserRole = 'student' | 'teacher' | null;

interface UserData {
  role: UserRole;
  name?: string;
  school?: string;
  classLevel?: string;
  joinedClassCode?: string;
  subjectCode?: string;
  hasCompletedOnboarding?: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: (role: UserRole) => Promise<{ isNewUser: boolean }>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from firestore
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (selectedRole: UserRole) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user exists, if not, create minimal profile with role
    const docRef = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const newUserData: UserData = {
        role: selectedRole,
        hasCompletedOnboarding: false,
        name: result.user.displayName || ''
      };
      await setDoc(docRef, newUserData);
      setUserData(newUserData);
      return { isNewUser: true };
    } else {
      setUserData(docSnap.data() as UserData);
      return { isNewUser: false };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, data, { merge: true });
    setUserData(prev => prev ? { ...prev, ...data } : data as UserData);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signOut, updateUserData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
