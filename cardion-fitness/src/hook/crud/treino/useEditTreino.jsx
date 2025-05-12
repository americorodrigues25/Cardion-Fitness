import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,updateDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useEditTreino = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    //FLUXO <PERSONAL>   
  const EditarTreinoAluno = async (idTreino,treino) => {
    setLoading(true);
    setError(null);

    // o objeto do treino deve vir completo, com tudo, porque caso alguma propriedade esteja faltando, ira ser nula no banco
    try {
      
      const role = await AsyncStorage.getItem('role')

      if(role != "personal") return false
      

      await updateDoc(doc(db, 'treino',idTreino),treino);
      

      return treino;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  
  return {
    EditarTreinoAluno,
    loading,
    error
  };
};
