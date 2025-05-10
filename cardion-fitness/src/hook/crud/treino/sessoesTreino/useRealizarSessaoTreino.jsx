import { doc, updateDoc,increment,getDoc,Timestamp   } from 'firebase/firestore';
// conexão Firebase
import { db, auth } from '../../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from "react-native-toast-message";

import { useConquistas } from '../../conquistas/useConquistas';

export const useRealizarSessaoTreino = () =>
    {        
        function formatarDataSimples(date) {
        return date.toISOString().split('T')[0]; // "2025-05-10"
        }
        function dataEhj(dataTimestamp){

            const data = dataTimestamp.toDate ? dataTimestamp.toDate() : new Date(dataTimestamp);
            const hoje = new Date();

            return formatarDataSimples(data) === formatarDataSimples(hoje);
        }
        
        const realizarSessao = async () =>{
            const role = await AsyncStorage.getItem("role")
            const uid = await AsyncStorage.getItem('uid')

            if(role != 'aluno') return

            const docRef = doc(db, role, uid);
            const docSnap = await getDoc(docRef);

            const user = docSnap.data()

            const usuarioTreinouHj = dataEhj(user?.sessoesRealizadas?.dataUltimaSessao)

            if(usuarioTreinouHj == true) {
                Toast.show({
                      type: 'error',
                      text1: 'Não foi possivel realizar sessão ❌',
                      text2: 'Você já realizou esse treino hoje',
                    });
                
                return false;
            }

            const {aplicarConquistaPendente} = useConquistas()        
                
            try{
                await updateDoc(doc(db, role, uid), {
                    pontos:5,
                    'sessoesRealizadas.qtd': increment(1),
                    'sessoesRealizadas.dataUltimaSessao': Timestamp.now()
                    
                });
                
                 await aplicarConquistaPendente()
                return true

            }catch(error){
                console.log(error)
                return false
            }
        }

        return{realizarSessao}
    }