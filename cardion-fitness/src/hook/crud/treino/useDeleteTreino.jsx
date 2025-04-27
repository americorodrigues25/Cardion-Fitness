import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,deleteDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDeleteTreino = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    //FLUXO <PERSONAL>   
    // deletar treino 
  const deletarTreinoAluno = async (idAluno) => {
    setLoading(true);
    setError(null);

    try {
     
      const role = await AsyncStorage.getItem('role')
      const uid = await AsyncStorage.getItem('uid')

      if(role != "personal") return false
     
      const docId = `${idAluno}_${uid}`

      await deleteDoc(doc(db, 'treino',docId));
      
      return true

      return user;
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
