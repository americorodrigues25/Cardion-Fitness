import { doc, setDoc,query,limit,where,getDocs, collection,addDoc,updateDoc , addDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db } from '~/firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCreateGrupo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //Personal criar grupo
    // Exemplo de grupo
    // {
    // idPersonal:
    // idsAlunos: []
    // Nome: Grupo
    // Descricao
    // }
    const criarGrupo = async  (data) =>{
        try{
            await addDoc(collection(db, 'grupo'), data);
            return true
        }catch{
            return false
        }
    }
    
    return {
        criarGrupo,
        loading,
        error
    };
};
