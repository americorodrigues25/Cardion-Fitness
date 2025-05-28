import { doc, setDoc,query,limit,where,getDocs,getDoc, collection,addDoc,updateDoc,increment,arrayUnion } from 'firebase/firestore';
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
      
      

      await addDoc(collection(db, 'treino'),treino);

      const docRef2 = doc(db,'aluno' ,treino.idAluno);
      const docSnap2 = await getDoc(docRef2);

      const user = docSnap2.data()

      if(!(user?.conquistas || []).includes(9)){
        const conquistaSnap = await getDoc(doc(db, 'conquistas', String(9)));
        const conquista = conquistaSnap.data();
    
        await updateDoc(docRef2, {
            pontos: increment(conquista.pontos),
            conquistas: arrayUnion(9),
        });

      }
      
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
