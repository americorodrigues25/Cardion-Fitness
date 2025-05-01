import {
  collection,
  addDoc
} from 'firebase/firestore';

import { useState } from 'react';
import { db } from '../../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAvaliacao = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const avaliar = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const uid = await AsyncStorage.getItem('uid');

      if (!uid) {
        throw new Error('UID não encontrado no AsyncStorage.');
      }

      await addDoc(collection(db, 'avaliacao'), {
        uid,
        name: data.name,
        avaliacao: data.avaliacao,
        comentario: data.comentario,
        createdAt: new Date(),
        updatedAt: null
      });

      return true;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao enviar avaliação:", err);
      return false;
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
