import {
  collection,
  addDoc
} from 'firebase/firestore';

import { useState } from 'react';
import { db } from '../../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from "react-native-toast-message";

import { useConquistas } from '../conquistas/useConquistas';

export const useAvaliacao = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {verificarConquistaPendenteAvaliacao}= useConquistas()

  const avaliar = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const uid = await AsyncStorage.getItem('uid');
      const role = await AsyncStorage.getItem("role")

      if (!uid) {
        throw new Error('UID não encontrado no AsyncStorage.');
      }

      await verificarConquistaPendenteAvaliacao(uid)
      
      await addDoc(collection(db, 'avaliacao'), {
        uid,
        role:role,
        name: data.name,
        avaliacao: data.avaliacao,
        comentario: data?.comentario ?? null,
        createdAt: new Date(),
        updatedAt: null
      });

      return true;
    } catch (err) {
      setError(err.message);
       Toast.show({
                  type: 'error',
                  text1: 'Não foi possivel realizar Avaliação',
                });
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
