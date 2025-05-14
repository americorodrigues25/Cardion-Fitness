import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,updateDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCreateAvaliacaoFisica = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const criarAvaliacaoFisica = async (avaliacao) => {
    setLoading(true);
    setError(null);
    try {
      
    // Importante O objeto de avalicao, alem de conter as informacoes da avaliacao, tem que conter
    // idAluno
    // idPersonal
    const role = await AsyncStorage.getItem('role')
    const uid = await AsyncStorage.getItem('uid')

    if(role != "personal") return false

    await addDoc(collection(db, 'avaliacaoFisica'),avaliacao);
    
    return true;
} catch (err) {
    setError(err.message);
    throw err;
} finally {
    setLoading(false);
}
  };


  
  return {
    criarAvaliacaoFisica,
    loading,
    error
  };
};
