import {getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth'


import {useState,useEffect} from 'react'

//conexao
import { db ,app,auth} from '../firebase/firebaseConfig'


export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const signUp = async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          role: role,
          createdAt: new Date()
        });

        return user;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const login = async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const logout = async () => {
      try {
        await signOut(auth);
      } catch (err) {
        setError(err.message);
      }
    };
    

    const resetPassword = async (email) => {
      setLoading(true);
      setError(null);
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    };

    return {
      signUp,
      login,
      logout,
      resetPassword,
      loading,
      error
    };
  };