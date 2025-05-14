import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,updateDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useEditAvalicaoFisica = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    //FLUXO <PERSONAL>   
  const EditarAvaliacaoFisica = async (idAvalicao,avaliacao) => {
    setLoading(true);
    setError(null);

    try {
      
      const role = await AsyncStorage.getItem('role')

      if(role != "personal") return false
      

      await updateDoc(doc(db, 'avaliacaoFisica',idAvalicao),avaliacao);
      

      return avaliacao;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  
  return {
    EditarAvaliacaoFisica,
    loading,
    error
  };
};
