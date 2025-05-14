import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,deleteDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDeleteAvaliacaoFisica = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    //FLUXO <PERSONAL>   
    // deletar treino 
  const deletarAvalicaoFisica = async (idAvalicaoFisica) => {
    setLoading(true);
    setError(null);

    try {
     
      const role = await AsyncStorage.getItem('role')
      const uid = await AsyncStorage.getItem('uid')

      if(role != "personal") return false
     

      await deleteDoc(doc(db, 'avaliacaoFisica',idAvalicaoFisica));
      
      return true
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  
  return {
    deletarAvalicaoFisica,
    loading,
    error
  };
};
