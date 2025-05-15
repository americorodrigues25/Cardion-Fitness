import { doc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDeleteTreino = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

<<<<<<< HEAD
    //FLUXO <PERSONAL>   
    // deletar treino 
=======
>>>>>>> 2345cb8 (feat: Corrige problema para deletar treino, incrementa idTreino para buscar o treino)
  const deletarTreinoAluno = async (idTreino) => {
    setLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
     
      const role = await AsyncStorage.getItem('role')

      if(role != "personal") return false
     
      await deleteDoc(doc(db, 'treino',idTreino));
      
      return true

=======
      const role = await AsyncStorage.getItem('role');
      const uid = await AsyncStorage.getItem('uid');

      if (role !== 'personal' || !uid) {
        setError('Acesso negado: Você não tem permissão para excluir este treino.');
        return false;
      }

      await deleteDoc(doc(db, 'treino', idTreino));
      
      return true; 
>>>>>>> 2345cb8 (feat: Corrige problema para deletar treino, incrementa idTreino para buscar o treino)
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
