import {
    getAuth,
} from 'firebase/auth';

import { doc, getDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGetAvaliacaoFisica = () => {

    // pegar um
    const getAvaliacao = async (idAvalicao) => {

        const docRef = doc(db, "avaliacaoFisica", idAvalicao);
        const docSnap = await getDoc(docRef);

        const avaliacaoFisica = docSnap.data()

        return avaliacaoFisica
    }

    // pegar todos
    const getAllAvaliacoesByIdAluno = async (idAluno) => {

        const treinosRef = collection(db, 'avaliacaoFisica');
        const q = query(treinosRef, where('idAluno', '==', idAluno));
        const querySnapshot = await getDocs(q);

        const avaliacaoFisica = [];
        querySnapshot.forEach((doc) => {
            avaliacaoFisica.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return avaliacaoFisica;
    }

    const getAllAvalicaoesByIdPersonal = async (idPersonal) => {

        const treinosRef = collection(db, 'avaliacaoFisica');
        const q = query(treinosRef, where('idPersonal', '==', idPersonal));
        const querySnapshot = await getDocs(q);

        const avaliacaoFisica = [];
        querySnapshot.forEach((doc) => {
            avaliacaoFisica.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return avaliacaoFisica;
    }

    return { getAvaliacao, getAllAvaliacoesByIdAluno, getAllAvalicaoesByIdPersonal }
}