import { doc, updateDoc,increment,getDoc,Timestamp,arrayUnion   } from 'firebase/firestore';
// conexão Firebase
import { db, auth } from '../../../../firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from "react-native-toast-message";

import { useConquistas } from '../../conquistas/useConquistas';

import { enviarMensagem } from '~/utils/enviarNotificacao';

export const useRealizarSessaoTreino = () =>
    {        
        function formatarDataSimples(date) {
        return date.toISOString().split('T')[0]; // "2025-05-10"
        }
        function dataEhj(dataTimestamp){

            if(dataTimestamp == null) return false

            const data = dataTimestamp.toDate ? dataTimestamp.toDate() : new Date(dataTimestamp);
            const hoje = new Date();

            return formatarDataSimples(data) === formatarDataSimples(hoje);
        }
        
        const realizarSessao = async (idTreino) =>{
            const role = await AsyncStorage.getItem("role")
            const uid = await AsyncStorage.getItem('uid')

            if(role != 'aluno') return

           const docRef = doc(db,"treino" , idTreino);
            const docSnap = await getDoc(docRef);
    
            const treino = docSnap.data()

            const usuarioTreinouHj = dataEhj(treino?.sessoesRealizadas?.dataUltimaSessao)

            if(usuarioTreinouHj == true) {
                Toast.show({
                      type: 'error',
                      text1: 'Não foi possivel realizar sessão ❌',
                      text2: 'Você já realizou esse treino hoje',
                    });
                
                return false;
            }

            const {aplicarConquistaPendente,verificarConquistaPendenteSessaoTreino} = useConquistas() 
            
            const docRef2 = doc(db,'aluno' ,uid);
            const docSnap2 = await getDoc(docRef2);
    
            const user = docSnap2.data()

            const hoje = new Date();
            const diaSemana = hoje.getDay(); 
            const ehSegunda = diaSemana === 1;

            if (ehSegunda && !(user?.conquistas || []).includes(15)){

                    const conquistaSnap = await getDoc(doc(db, 'conquistas', String(15)));
                    const conquista = conquistaSnap.data();
                
                    await updateDoc(docRef2, {
                        pontos: increment(conquista.pontos),
                        conquistas: arrayUnion(15),
                    });

                    await enviarMensagem('Conquista desbloqueada', conquista?.descricao);
                
                    Toast.show({
                        type: 'success',
                        text1: 'Conquista Desbloqueada!',
                        text2: conquista?.nome,
                        position: 'top',
                    });
            }

            await ValidarDiasSemTreinar(user,docRef2)

            const diasSeguidos = ValidarDiasSeguidos(docSnap2)
                            
            try{

                  await updateDoc(doc(db, 'treino', idTreino), {
                    'sessoesRealizadas.qtd': increment(1),
                    'sessoesRealizadas.dataUltimaSessao': Timestamp.now()
                });

                await updateDoc(doc(db, role, uid), {
                    pontos:increment(5),
                    'sessoesRealizadas.qtd': increment(1),
                    'sessoesRealizadas.dataUltimaSessao': Timestamp.now(),
                    'sessoesRealizadas.diasSeguidos': diasSeguidos
                    
                });

                if(diasSeguidos >= 7 && !(user?.conquistas || []).includes(14)){

                    const conquistaSnap = await getDoc(doc(db, 'conquistas', String(14)));
                    const conquista = conquistaSnap.data();
                
                    await updateDoc(docRef2, {
                        pontos: increment(conquista.pontos),
                        conquistas: arrayUnion(14),
                    });

                    await enviarMensagem('Conquista desbloqueada', conquista?.descricao);
                
                    Toast.show({
                        type: 'success',
                        text1: 'Conquista Desbloqueada!',
                        text2: conquista?.nome,
                        position: 'top',
                    });
                }
                
                 await aplicarConquistaPendente()

                 await verificarConquistaPendenteSessaoTreino(idTreino,uid)
                return true

            }catch(error){
                
                return false
            }
        }

        async function ValidarDiasSemTreinar(userData,docRef) {
            const ultimaSessao = userData?.sessoesRealizadas?.dataUltimaSessao;

            const agora = Timestamp.now();

            if (ultimaSessao) {
                const diffEmMs = agora.toDate() - ultimaSessao.toDate();
                const diasParado = diffEmMs / (1000 * 60 * 60 * 24);

                if (diasParado >= 7) {
            
                const conquistaSnap = await getDoc(doc(db, 'conquistas', String(16)));
                const conquista = conquistaSnap.data();
                
                await updateDoc(docRef, {
                    pontos: increment(conquista.pontos),
                    conquistas: arrayUnion(16),
                });

                 await enviarMensagem("Conquista desbloqueada",conquista?.descricao)
                
                Toast.show({
                    type: 'success',
                    text1: `Conquista Desbloqueada!`,
                    text2: `${conquista?.nome}`,
                    position: 'top',
                });

                }
            }
        }


        function ValidarDiasSeguidos(userSnap) {
            const userData = userSnap.data();
            const agora = Timestamp.now();
            const hoje = agora.toDate();
            
            const ultimaDataRaw = userData?.sessoesRealizadas?.dataUltimaSessao?.toDate();
            let diasSeguidos = userData?.sessoesRealizadas?.diasSeguidos || 0;

            if (ultimaDataRaw) {
                const diffEmDias = Math.floor(
                (hoje - ultimaDataRaw) / (1000 * 60 * 60 * 24)
                );

                if (diffEmDias === 1) {
                diasSeguidos += 1; // Treinou no dia seguinte
                } else if (diffEmDias === 0) {
                // Mesmo dia, mantém o valor
                } else {
                diasSeguidos = 1; // Quebrou sequência, recomeça
                }
            } else {
                diasSeguidos = 1; // Primeira sessão
            }

            return diasSeguidos;
        }
        return{realizarSessao}
    }