import {
  getAuth,
} from 'firebase/auth';

import { doc, getDoc, getDocs, collection, query, where,orderBy } from 'firebase/firestore';
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


  
  // Trazer dados do aluno pelo id dele, nesse caso chamado de detalhe do aluno
  const getAlunoById = async (idAluno) => {

    const docRef = doc(db, 'aluno', idAluno);
    const docSnap = await getDoc(docRef);

    const user = docSnap.data()

    return user
  }


    // Trazer dados do aluno pelo id dele, nesse caso chamado de detalhe do aluno
  const getPersonalById = async (idPersonal) => {

    const docRef = doc(db, 'personal', idPersonal);
    const docSnap = await getDoc(docRef);

    const personal = docSnap.data()

    return personal
  }


  // Trazer o personal do aluno, na tela do aluno nesse caso
  const getPersonalDoAluno = async () => {

    const idAluno = await AsyncStorage.getItem('uid')

    const vinculoRef = collection(db, 'vinculos');
    const q = query(vinculoRef, where('idAluno', '==', idAluno));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return

    const docVinculo = querySnapshot.docs[0];
    const data = docVinculo.data();

    const docRef = doc(db, 'personal', data.idPersonal);
    const docSnap = await getDoc(docRef);

    const personal = docSnap.data()

    return personal
  }


  const buscarAlunosOrdenadosPorPontos = async () => {
  const q = query(collection(db, 'aluno'), orderBy('pontos', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    nome: doc.data().nome,
    pontos: doc.data().pontos
  }));
  };
  return { getById, getAll, getAllAlunosByPersonal, getAlunoByEmail,getAlunoById, getPersonalById,getPersonalDoAluno,buscarAlunosOrdenadosPorPontos}
}