import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

import { doc, setDoc, query, limit, where, getDocs, collection } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();

  // criar conta 
  const signUp = async (name, email, password, sobrenome, remember = false) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, sobrenome);
      const user = userCredential.user;

      if (remember) {
        await AsyncStorage.setItem('userLoggedIn', 'true');
      }

      const role = await AsyncStorage.getItem('role')

      if (role == 'aluno') {

        await setDoc(doc(db, 'aluno', user.uid), {
          uid: user.uid,
          email: user.email,
          nome: name,
          sobrenome: sobrenome,
          telefone: null,
          dataNasc: null,
          sexo: null,
          peso: null,
          altura: null,
          objetivo: null,
          xp: null,
          nivel: null,
          createdAt: new Date(),
          updatedAt: null
        });

      }

      else if (role == 'personal') {

        await setDoc(doc(db, 'personal', user.uid), {
          uid: user.uid,
          email: user.email,
          nome: name,
          sobrenome: sobrenome,
          telefone: null,
          dataNasc: null,
          sexo: null,
          createdAt: new Date(),
          updatedAt: null
        });

      }

      await AsyncStorage.setItem('uid', user.uid)

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, remember = false) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (remember) {
        await AsyncStorage.setItem('userLoggedIn', 'true');
      }

      await AsyncStorage.setItem('uid', userCredential.user.uid)

      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userLoggedIn');

      await AsyncStorage.removeItem('uid')

      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      auth.languageCode = 'pt';
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePasswordInterno = async (senhaAtual, novaSenha) => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error('Usuário não autenticado.');
      }

      const credential = EmailAuthProvider.credential(user.email, senhaAtual);

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, novaSenha); 

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const accountExists = async (email) => {
    const role = await AsyncStorage.getItem('role')

    if (role == 'aluno') {
      const consulta = query(
        collection(db, 'aluno'),
        where('email', "==", `${email}`),
        limit(1)
      )

      const resultado = await getDocs(consulta)

      if (resultado.empty) {
        return false
      }

      return true
    }

    else if (role == 'personal') {
      const consulta = query(
        collection(db, 'personal'),
        where('email', "==", `${email}`),
        limit(1)
      )

      const resultado = await getDocs(consulta)

      if (resultado.empty) {
        return false
      }
      return true
    }
  }
  return {
    signUp,
    login,
    logout,
    resetPassword,
    accountExists,
    updatePasswordInterno,
    loading,
    error
  };
};
