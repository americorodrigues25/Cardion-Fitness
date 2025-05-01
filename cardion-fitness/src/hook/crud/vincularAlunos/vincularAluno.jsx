import { collection, addDoc,getDocs,where ,query,deleteDoc,doc } from 'firebase/firestore';
import { db } from '~/firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      console.log('Aluno já está vinculado a este personal.');
      return; // Evita criar vínculo duplicado
    }

    await addDoc(collection(db, 'vinculos'), {
      idPersonal,
      idAluno,
      dataVinculacao: new Date(),
    });
  };

  const desvincularAluno = async (idAluno) =>{

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

  return { vincularAluno,desvincularAluno };
};
