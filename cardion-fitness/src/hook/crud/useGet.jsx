import {
  getAuth,
} from 'firebase/auth';

import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { useState } from 'react';

// conexão Firebase
import { db, auth } from '../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGet = () => {
  const auth = getAuth();

  // pegar um
  const getById = async () => {

    const role = await AsyncStorage.getItem("role")
    const uid = await AsyncStorage.getItem('uid')

    const docRef = doc(db, role, uid);
    const docSnap = await getDoc(docRef);

    const user = docSnap.data()

    return user
  }

  // pegar todos
  const getAll = async () => {
    const role = await AsyncStorage.getItem("role")
    const dados = await getDocs(collection(db, role));

    return dados.data()
  }


  // trazer todos alunos de um personal

  const getAllAlunosByPersonal = async () => {
    console.log("Iniciando busca de alunos vinculados...");

    const role = await AsyncStorage.getItem("role")
    const uid = await AsyncStorage.getItem("uid") 

    console.log("role:", role, "uid:", uid);

    if (role !== 'personal') {
      console.log("Role não é personal. Encerrando.");
      return null;
    }

    const vinculosRef = collection(db, 'vinculos');
    const q = query(vinculosRef, where('idPersonal', '==', uid));
    const vinculosSnap = await getDocs(q);

    if (vinculosSnap.empty) {
      console.log("Nenhum vínculo encontrado.");
      return [];
    }

    const alunoIds = vinculosSnap.docs.map(doc => doc.data().idAluno);
    console.log("IDs dos alunos vinculados:", alunoIds);


    //até 10 por vez
    const alunos = [];
    const alunoRef = collection(db, 'aluno');
    const batchSize = 10;

    for (let i = 0; i < alunoIds.length; i += batchSize) {
      const batch = alunoIds.slice(i, i + batchSize);
      console.log("Batch atual:", batch);
      const alunosQuery = query(alunoRef, where('uid', 'in', batch));
      const alunosSnap = await getDocs(alunosQuery);

      alunosSnap.forEach(doc => {
        alunos.push({ id: doc.id, ...doc.data() });
      });
    }

    return alunos;
  }

  const getAlunoByEmail = async (email) => {

    const AlunosRef = collection(db, 'aluno');
    const q = query(AlunosRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    const alunos = [];
    querySnapshot.forEach((doc) => {
      alunos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log("Lista final de alunos:", alunos);
    return alunos;
  }

  return { getById, getAll, getAllAlunosByPersonal, getAlunoByEmail }
}