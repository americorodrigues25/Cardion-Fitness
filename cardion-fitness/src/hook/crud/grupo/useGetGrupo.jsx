import {
    getAuth,
    } from 'firebase/auth';
    
    import { doc, getDoc,getDocs ,collection, query, where } from 'firebase/firestore';
    import { useState } from 'react';
    
    // conexão Firebase
   import { db } from '~/firebase/firebaseConfig';
    
    
    export const useGetGrupo = () =>
    {
       
        // pegar um grupo
        const getGrupo = async (idGrupo) =>{

            const docRef = doc(db,"grupo" , idGrupo);
            const docSnap = await getDoc(docRef);
    
            const grupo = docSnap.data()
    
            return grupo
        }
    
        // pegar todos
        const getAllGruposByPersonal = async (idPersonal) =>{

            const gruposRef = collection(db, 'grupo');
            const q = query(gruposRef, where('idPersonal', '==', idPersonal));
            const querySnapshot = await getDocs(q);
        
            const grupos = [];
            querySnapshot.forEach((doc) => {
                grupos.push({
                id: doc.id,        
                ...doc.data()       
              });
            });
        
            return grupos;
        }

       
    
        return{getGrupo,getAllGruposByPersonal}
    }