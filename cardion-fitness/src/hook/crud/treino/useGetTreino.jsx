import {
    getAuth,
    } from 'firebase/auth';
    
    import { doc, getDoc,getDocs ,collection, query, where,orderBy } from 'firebase/firestore';
    import { useState } from 'react';
    
    // conexão Firebase
import { db, auth } from '../../../firebase/firebaseConfig';
    
    import AsyncStorage from '@react-native-async-storage/async-storage';
    
    export const useGetTreino = () =>
    {
       
        // pegar um
        const getTreino = async (idAluno,idPersonal) =>{
    
            const docId = `${idAluno}_${idPersonal}`

            const docRef = doc(db,"treino" , docId);
            const docSnap = await getDoc(docRef);
    
            const treino = docSnap.data()
    
            return treino
        }
    
        // pegar todos
        const getAllTreinosByIdAluno = async (idAluno) =>{

            const treinosRef = collection(db, 'treino');
            const q = query(treinosRef, where('idAluno', '==', idAluno),  orderBy('criadoEm', 'asc') );
            const querySnapshot = await getDocs(q);
        
            const treinos = [];
            querySnapshot.forEach((doc) => {
              treinos.push({
                id: doc.id,        
                ...doc.data()       
              });
            });
        
            return treinos;
        }

        const getAllTreinosByIdPersonal = async (idPersonal) =>{

            const treinosRef = collection(db, 'treino');
            const q = query(treinosRef, where('idPersonal', '==', idPersonal));
            const querySnapshot = await getDocs(q);
        
            const treinos = [];
            querySnapshot.forEach((doc) => {
              treinos.push({
                id: doc.id,        
                ...doc.data()      
              });
            });
        
            return treinos;
        }
    
        return{getTreino,getAllTreinosByIdAluno,getAllTreinosByIdPersonal}
    }