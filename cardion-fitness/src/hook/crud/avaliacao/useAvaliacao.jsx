import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

import { doc, setDoc,query,limit,where,getDocs, collection } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();

  // criar avalicao, recebendo o nome do usuario, avalicao sendo um numero de 1 a 5, e um comentario opcional
  const avaliar = async (name,avaliacao,comentario) => {
    setLoading(true);
    setError(null);

    try {

      const uid = await AsyncStorage.getItem('uid')
      
        await setDoc(doc(db, 'avaliacao', uid), {
          uid: user.uid,
          name:name,
          avalicao:avaliacao,
          comentario: comentario,
          createdAt: new Date(),
          updatedAt: null
        });

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  return {
    avaliar,
    loading,
    error
  };
};
