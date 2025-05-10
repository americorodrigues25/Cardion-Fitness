import { doc, collection,addDoc,deleteDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db } from '~/firebase/firebaseConfig';

export const useDeleteGrupo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const deletarGrupo = async (idGrupo) => {
    setLoading(true);
    setError(null);

    try {
        await deleteDoc(doc(db, 'grupo',idGrupo));
        return true
     }catch{
        return false
     }
  };
  
  return {
    deletarGrupo,
    loading,
    error
  };
};
