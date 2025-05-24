import {
    getAuth,
} from 'firebase/auth';

import { doc, getDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from "react-native-toast-message";

export const useGetDesafio = () => {

    // pegar um
    const getDesafio = async (idDesafio) => {

        const docRef = doc(db, "desafios", idDesafio);
        const docSnap = await getDoc(docRef);

        const desafio = docSnap.data()

        return desafio
    }

    // pegar todos
    const getAllDesafiosByIdAluno = async (idAluno) => {

        const alunoRef = doc(db, 'aluno', idAluno);
        const alunoSnap = await getDoc(alunoRef);

        if (!alunoSnap.exists()) {
            Toast.show({
                    type: 'error',
                    text1: 'Aluno não encontrado',
                });
            return [];
        }


        const { desafios: idsDesafios } = alunoSnap.data();

        if (!idsDesafios || idsDesafios.length === 0) {
            return [];
        }

        const desafiosRef = collection(db, 'desafios');
        const q = query(desafiosRef, where('__name__', 'in', idsDesafios));
        const querySnap = await getDocs(q);

        const desafios = querySnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return desafios;
    }

    const getAllDesafiosByTipo = async (tipo) => {

        if (!tipo || typeof tipo !== 'string') {
            
            return [];
        }

        try {
            const desafiosRef = collection(db, 'desafios');
            const q = query(desafiosRef, where('tipo', '==', tipo));
            const querySnap = await getDocs(q);

            const desafios = querySnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return desafios;
        } catch (error) {
            Toast.show({
                    type: 'error',
                    text1: 'Erro ao buscar desafios por tipo',
                });
            throw error;
        }
    };

    const getAll = async () => {
        const dados = await getDocs(collection(db, 'desafios'));

        return dados.data()
    }

    return { getDesafio, getAllDesafiosByIdAluno, getAll, getAllDesafiosByTipo }
}