import { doc, updateDoc,increment,getDoc ,arrayUnion  } from 'firebase/firestore';
// conexão Firebase
import { db } from '~/firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from "react-native-toast-message";

import { enviarMensagem } from '~/utils/enviarNotificacao';

export const useConquistas = () =>
    {
        async function verificarConquistaPendente (uid){
            const docRef = doc(db, 'aluno', uid);
            const docSnap = await getDoc(docRef);

            const user = docSnap.data()
            
            if(user.sessoesRealizadas == null) return
            
            let idConquista = 0;

            switch(user.sessoesRealizadas.qtd){
                case 1:
                    idConquista = 1;
                    break;
                case 5:
                    idConquista = 2;
                    break;
                case 10:
                    idConquista = 3;
                    break;
                
            }

            if(idConquista == 0) return

            const docRef2 = doc(db,"conquistas" , String(idConquista));
            const docSnap2 = await getDoc(docRef2);
    
            const conquista = docSnap2.data()

            console.log("conquista",conquista)
            console.log(conquista.pontos)

            await updateDoc(doc(db, 'aluno', uid), {
                        pontos: increment(conquista.pontos),
                        conquistas: arrayUnion(idConquista)
                    });
            
           
            await enviarMensagem("Conquista desbloqueada",conquista?.descricao)

            Toast.show({
                type: 'success',
                text1: `Conquista Desbloqueada!`,
                text2: `${conquista?.nome}`,
                position: 'top',
            });
           
        }
        
        const aplicarConquistaPendente = async () =>{
            const role = await AsyncStorage.getItem("role")
            const uid = await AsyncStorage.getItem('uid')

            if(role != 'aluno') return   

            await verificarConquistaPendente(uid)   
            return true
           
        }

        return{aplicarConquistaPendente}
    }