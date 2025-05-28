import { doc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDeleteTreino = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletarTreinoAluno = async (idTreino) => {
    setLoading(true);
    setError(null);

    try {
      // const role = await AsyncStorage.getItem('role');

      // if (role !== 'personal') {
      //   setError('Acesso negado: Você não tem permissão para excluir este treino.');
      //   return false;
      // }

      await deleteDoc(doc(db, 'treino', idTreino));
      
      return true; 
    } catch (err) {
      setError(err.message); 
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deletarTreinoAluno,
    loading,
    error,
  };
};
