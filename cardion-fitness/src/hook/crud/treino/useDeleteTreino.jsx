import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,deleteDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDeleteTreino = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    //FLUXO <PERSONAL>   
    // deletar treino 
  const deletarTreinoAluno = async (idTreino) => {
    setLoading(true);
    setError(null);

    try {
     
      const role = await AsyncStorage.getItem('role')

      if(role != "personal") return false
     
      await deleteDoc(doc(db, 'treino',idTreino));
      
      return true

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  
  return {
    deletarTreinoAluno,
    loading,
    error
  };
};
