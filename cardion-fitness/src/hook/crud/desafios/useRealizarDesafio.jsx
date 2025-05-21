import { doc, setDoc,query,limit,where,getDocs, getDoc,collection,addDoc,updateDoc,arrayUnion,arrayRemove,increment ,Timestamp } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { enviarMensagem } from '~/utils/enviarNotificacao';

export const useRealizarDesafio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function verificarConquistaPendente (uid){
              const docRef = doc(db, 'aluno', uid);
              const docSnap = await getDoc(docRef);
  
              const user = docSnap.data()
              
              if(user.desafiosRealizados == null) return
              
              let idConquista = 0;
  
              switch(user.desafiosRealizados.qtd){
                  case 1:
                      idConquista = 4;
                      break;
              }
  
              if(idConquista == 0) return
  
              const docRef2 = doc(db,"conquistas" , String(idConquista));
              const docSnap2 = await getDoc(docRef2);
      
              const conquista = docSnap2.data()
  
              await updateDoc(doc(db, 'aluno', uid), {
                          pontos: increment(conquista.pontos),
                          conquistas: arrayUnion(idConquista)
                      });
              
             
              await enviarMensagem("Conquista desbloqueada",conquista?.descricao)
  
              Toast.show({
                  type: 'success',
                  text1: `Conquista Desbloqueada!`,
                  text2: `${conquista?.nome}`,
                  position: 'top',
              });
             
          }

  const realizarDesafio = async (idAluno,idDesafio) => {
    setLoading(true);
    setError(null);

    try {
        
        const docRef = doc(db,"desafios" , idDesafio);
        const docSnap = await getDoc(docRef);

        const desafio = docSnap.data()

        await updateDoc(doc(db, 'aluno', idAluno), {
              "desafiosRealizados.qtd": increment(1),
              "desafiosRealizados.dataUltimaSessao": Timestamp.now(),
              pontos: increment(desafio.pontos),
              pontosDesafios: increment(desafio.pontos)
              });
        
        await verificarConquistaPendente(idAluno)
        
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  return {
    realizarDesafio,
    loading,
    error
  };
};
