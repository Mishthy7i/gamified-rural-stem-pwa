import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export type UserRole = "student" | "teacher" | null;

interface UserData {
  role: UserRole;
  name?: string;
  school?: string;
  classLevel?: string;
  joinedClassCode?: string;
  subjectCode?: string;
  points?: number;
  hasCompletedOnboarding?: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: (
    role: UserRole
  ) => Promise<{ isNewUser: boolean; role: UserRole }>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from firestore
        const docRef = doc(db, "users", currentUser.uid);
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
    const docRef = doc(db, "users", result.user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const newUserData: UserData = {
        role: selectedRole,
        hasCompletedOnboarding: false,
        name: result.user.displayName || "",
      };
      await setDoc(docRef, newUserData);
      setUserData(newUserData);
      return { isNewUser: true, role: selectedRole };
    } else {
      const existingData = docSnap.data() as UserData;
      setUserData(existingData);
      return { isNewUser: false, role: existingData.role };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    setUserData((prev) => (prev ? { ...prev, ...data } : (data as UserData)));
    const docRef = doc(db, "users", user.uid);
    // Do not await: offline / flaky write streams can keep retrying and block UI for minutes.
    // Local state is already updated; Firestore queues the write when persistence is enabled.
    void setDoc(docRef, data, { merge: true }).catch((err) => {
      console.error("Firestore user sync failed", err);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signInWithGoogle,
        signOut,
        updateUserData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
