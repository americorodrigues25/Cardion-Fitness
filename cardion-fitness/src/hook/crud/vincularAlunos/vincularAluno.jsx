import { collection, addDoc } from 'firebase/firestore';
import { db } from '~/firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useVinculo = () => {

  const vincularAluno = async (idAluno) => {
    const idPersonal = await AsyncStorage.getItem('uid');

    if (!idPersonal || !idAluno) {
      throw new Error('ID do aluno ou do personal não encontrado.');
    }

    await addDoc(collection(db, 'vinculos'), {
      idPersonal,
      idAluno,
      dataVinculacao: new Date(),
    });
  };

  return { vincularAluno };
};
