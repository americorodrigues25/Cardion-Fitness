import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,updateDoc,arrayUnion,arrayRemove  } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';


export const useVincularDesafio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const vincularAlunoAoDesafio = async (idAluno,idDesafio) => {
    setLoading(true);
    setError(null);

    try {
      
       await updateDoc(doc(db, 'aluno', idAluno), {
              desafios:arrayUnion(idDesafio),
              });
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const desvincularDesafio = async (idAluno,idDesafio) => {
    setLoading(true);
    setError(null);

    try {
      
       await updateDoc(doc(db, 'aluno', idAluno), {
              desafios:arrayRemove(idDesafio),
              });
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    vincularAlunoAoDesafio,
    desvincularDesafio,
    loading,
    error
  };
};
