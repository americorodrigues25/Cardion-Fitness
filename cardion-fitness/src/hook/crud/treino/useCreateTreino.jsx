import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,updateDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCreateTreino = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    //FLUXO <PERSONAL>   
    // criar treino 
  const criarTreinoAluno = async (idAluno,treino) => {
    setLoading(true);
    setError(null);


    // treino devera ter o seguinte conteudo:
    //  treino :{
    //  idPersonal,
    // idAluno,
    // nome,
    // descricao
    // nivelDificuldade
    // dataInicio
    // previsaoTermino
    // exercicios: [{}]
    // }
    try {
      
      const role = await AsyncStorage.getItem('role')
      const uid = await AsyncStorage.getItem('uid')

      if(role != "personal") return false
      
      const docId = `${idAluno}_${uid}`

      await setDoc(doc(db, 'treino',docId),treino);
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  
  return {
    criarTreinoAluno,
    loading,
    error
  };
};
