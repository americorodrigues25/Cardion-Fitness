import { doc, setDoc,query,limit,where,getDocs, collection,updateDoc , addDoc } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db } from '~/firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from "react-native-toast-message";

export const useCreateAnotacoes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const criarAnotacoes = async  (idAluno,data) =>{
        try{
            await updateDoc(doc(db, 'aluno',idAluno),{
                anotacao:data
            });

            Toast.show({
                            type: 'success',
                            text1: `Anotação criada`,
                        });

            return true
        }catch{
             Toast.show({
                                  type: 'error',
                                  text1: 'Erro ao criar anotacao',
                                });
            return false
        }
    }
    
    return {
        criarAnotacoes,
        loading,
        error
    };
};
