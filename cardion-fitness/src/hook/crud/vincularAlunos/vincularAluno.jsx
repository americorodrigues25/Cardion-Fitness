import { collection, addDoc, getDocs,getDoc,where, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '~/firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from "react-native-toast-message";
import { useConquistas } from '../conquistas/useConquistas';

export const useVinculo = () => {

  const vincularAluno = async (idAluno) => {
    const idPersonal = await AsyncStorage.getItem('uid');

    if (!idPersonal || !idAluno) {
      throw new Error('ID do aluno ou do personal não encontrado.');
    }

    // Verifica se já existe o vínculo
    const vinculosRef = collection(db, 'vinculos');
    const q = query(
      vinculosRef,
      where('idPersonal', '==', idPersonal),
      where('idAluno', '==', idAluno)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      Toast.show({
        type: 'error',
        text1: 'Ocorreu um erro ❌',
        text2: 'Você já está associado a este aluno!',
      });
      return false;
    }

    await addDoc(collection(db, 'vinculos'), {
      idPersonal,
      idAluno,
      dataVinculacao: new Date(),
    });

    Toast.show({
      type: 'success',
      text1: 'Parabéns ✅',
      text2: 'Você tem um novo aluno vinculado! 🎉',
    });

     const docRef = doc(db, "aluno", idAluno);
      const docSnap = await getDoc(docRef);

    const user = docSnap.data()
    const {verificarConquistaVinculo} = useConquistas()
    await verificarConquistaVinculo(user,idAluno)
    return true;
  };

  const desvincularAluno = async (idAluno) => {

    const idPersonal = await AsyncStorage.getItem('uid');

    if (!idPersonal || !idAluno) {
      throw new Error('ID do aluno ou do personal não encontrado.');
    }


    const vinculosRef = collection(db, 'vinculos');
    const q = query(
      vinculosRef,
      where('idPersonal', '==', idPersonal),
      where('idAluno', '==', idAluno)
    );

    const snapshot = await getDocs(q);


    const promises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, 'vinculos', docSnap.id))
    );

    await Promise.all(promises);
  }

  const seDesvincularDePersonal = async (idPersonal) =>{
    const idAluno = await AsyncStorage.getItem('uid');
    try{

    
    if (!idPersonal || !idAluno) {
       Toast.show({
                type: 'error',
                text1: 'Aluno ou Personal não encontrado',
            });
    }

    // vinculo
    const vinculosRef = collection(db, 'vinculos');
    const q = query(
      vinculosRef,
      where('idPersonal', '==', idPersonal),
      where('idAluno', '==', idAluno)
    );

    const snapshot = await getDocs(q);


    const promises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, 'vinculos', docSnap.id))
    );

    await Promise.all(promises);

    // treino
    const treinosRef = collection(db, 'treino');
    const q2= query(
      treinosRef,
      where('idPersonal', '==', idPersonal),
      where('idAluno', '==', idAluno)
    );

    const snapshot2 = await getDocs(q2);


    const promises2 = snapshot2.docs.map((docSnap) =>
      deleteDoc(doc(db, 'treino', docSnap.id))
    );

    await Promise.all(promises2);


    // avaliacao
    const avaliacaoRef = collection(db, 'avaliacaoFisica');
    const q3= query(
      avaliacaoRef,
      where('idPersonal', '==', idPersonal),
      where('idAluno', '==', idAluno)
    );

    const snapshot3 = await getDocs(q3);


    const promises3 = snapshot3.docs.map((docSnap) =>
      deleteDoc(doc(db, 'avaliacaoFisica', docSnap.id))
    );

    await Promise.all(promises3);

     Toast.show({
      type: 'success',
      text1: 'Parabéns ✅',
      text2: 'Personal desvinculado!',
    });

  }catch(e){

     Toast.show({
                type: 'error',
                text1: 'Aluno ou Personal não encontrado',
            });
  }
}

  return { vincularAluno, desvincularAluno,seDesvincularDePersonal };
};
