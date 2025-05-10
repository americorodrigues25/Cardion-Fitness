import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,updateDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db } from '~/firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useEditGrupo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const EditarGrupo = async (idGrupo,grupo) => {
    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'grupo',idGrupo),grupo);
      return true;
    } catch (err) {
      setError(err.message);
      return false
    } 
  };

  
  return {
    EditarGrupo,
    loading,
    error
  };
};
