import {
getAuth,
} from 'firebase/auth';

import { doc, getDoc,getDocs ,collection } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGet = () =>
{
    const auth = getAuth();

    // pegar um
    const getById = async () =>{

        const role = await AsyncStorage.getItem("role")
        const uid = await AsyncStorage.getItem('uid')

        const docRef = doc(db, role, uid);
        const docSnap = await getDoc(docRef);

        const user = docSnap.data()

        return user
    }

    // pegar todos
    const getAll = async () =>{
        const role = await AsyncStorage.getItem("role")
        const dados = await getDocs(collection(db, role));

        return dados.data()
    }

    return{getById,getAll}
}