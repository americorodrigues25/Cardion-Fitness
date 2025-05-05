import { doc, updateDoc,collection, addDoc,getDoc, query, where, getDocs,deleteDoc } from 'firebase/firestore';
// conexão Firebase
import { db, auth,setDoc } from '../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';


export const useAssociarPersonal = () =>
{
    
    const associarPersonal = async (idAluno) =>{
        const role = await AsyncStorage.getItem("role")
        const uid = await AsyncStorage.getItem('uid')

        if(role != "personal") return false

        // verificar se aluno existe
        const docRef = doc(db, "aluno", idAluno);
        const docSnap = await getDoc(docRef);

        const user = docSnap.data()

        if(user == null) return false

        const docId = `${idAluno}_${uid}`

        await setDoc(doc(db, 'alunoPersonal', docId), {
            idAluno: idAluno,
            idPersonal: uid,
            dataVinculo:new Date()
        });

        return true
    }


    const removerVinculoPersonal = async (idAluno) =>{
        const role = await AsyncStorage.getItem("role")
        const uid = await AsyncStorage.getItem('uid')

        if(role != "personal") return false

        // verificar se aluno existe
        const docRef = doc(db, "aluno", idAluno);
        const docSnap = await getDoc(docRef);

        const user = docSnap.data()

        if(user == null) return false

        const docId = `${idAluno}_${uid}`

        await deleteDoc(doc(db, 'alunoPersonal', docId));
    }
    
    return{associarPersonal,removerVinculoPersonal}
}