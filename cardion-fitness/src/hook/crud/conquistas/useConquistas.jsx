import { doc, updateDoc, increment, getDoc, arrayUnion, getDocs, where, query, collection, documentId } from 'firebase/firestore'; // Importe 'documentId'
// conexão Firebase
import { db } from '~/firebase/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from "react-native-toast-message";

import { enviarMensagem } from '~/utils/enviarNotificacao';

export const useConquistas = () => {
    async function verificarConquistaPendente(uid) {
        const docRef = doc(db, 'aluno', uid);
        const docSnap = await getDoc(docRef);

        const user = docSnap.data();

        if (user.sessoesRealizadas == null) return;

        let idConquista = 0;

        switch (user.sessoesRealizadas.qtd) {
            case 1:
                idConquista = 1;
                break;
            case 5:
                idConquista = 2;
                break;
            case 10:
                idConquista = 3;
                break;
            case 20:
                idConquista = 5;
                break;
            case 30:
                idConquista = 6;
                break;
            case 50:
                idConquista = 8;
                break;
        }

        if (idConquista === 0) return;

        const docRef2 = doc(db, "conquistas", String(idConquista));
        const docSnap2 = await getDoc(docRef2);

        const conquista = docSnap2.data();

        await updateDoc(doc(db, 'aluno', uid), {
            pontos: increment(conquista.pontos),
            // garantindo que o ID seja string
            conquistas: arrayUnion(String(idConquista))
        });


        await enviarMensagem("Conquista desbloqueada", conquista?.descricao);

        Toast.show({
            type: 'success',
            text1: `Conquista Desbloqueada!`,
            text2: `${conquista?.nome}`,
            position: 'top',
        });
    }

    const verificarConquistaPendenteAvaliacao = async (uid) => {
        const role = await AsyncStorage.getItem("role");
        if (role !== 'aluno') return;

        const avaliacaoRef = collection(db, 'avaliacao');
        const q = query(avaliacaoRef, where('uid', '==', uid), where('role', '==', role));
        const querySnapshot = await getDocs(q);

        const avaliacoes = [];
        querySnapshot.forEach((doc) => {
            avaliacoes.push({
                id: doc.id,
                ...doc.data()
            });
        });


        if (avaliacoes.length === 0) {
            // garantindo que o ID seja string
            const docRef2 = doc(db, "conquistas", String(17));
            const docSnap2 = await getDoc(docRef2);

            const conquista = docSnap2.data();

            await updateDoc(doc(db, 'aluno', uid), {
                pontos: increment(conquista.pontos),
                // garantindo que o ID seja string
                conquistas: arrayUnion(String(17))
            });

            Toast.show({
                type: 'success',
                text1: `Conquista Desbloqueada!`,
                text2: `${conquista?.nome}`,
                position: 'top',
            });
        }
    };

    const aplicarConquistaPendente = async () => {
        const role = await AsyncStorage.getItem("role");
        const uid = await AsyncStorage.getItem('uid');

        if (role !== 'aluno') return;

        await verificarConquistaPendente(uid);
        return true;
    };

    const buscarConquistasDoAluno = async (idAluno) => {
        const alunoRef = doc(db, 'aluno', idAluno);
        const alunoSnap = await getDoc(alunoRef);

        if (!alunoSnap.exists()) {
            Toast.show({
                type: 'error',
                text1: 'Aluno não encontrado',
            });
            return [];
        }

        const { conquistas: idsConquistasRaw } = alunoSnap.data();

        if (!idsConquistasRaw || idsConquistasRaw.length === 0) {
            return [];
        }

        // garantindo que o ID seja string
        const idsConquistas = idsConquistasRaw.map(id => String(id));

        const conquistasRef = collection(db, 'conquistas');
        const q = query(conquistasRef, where(documentId(), 'in', idsConquistas));
        const querySnap = await getDocs(q);

        const conquistas = querySnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return conquistas;
    };

    const buscarConquistasNaoDesbloqueadas = async (uid) => {
        const alunoRef = doc(db, 'aluno', uid);
        const alunoSnap = await getDoc(alunoRef);

        if (!alunoSnap.exists()) {
            Toast.show({
                type: 'error',
                text1: 'Aluno não encontrado',
            });
            return [];
        }

        const alunoConquistasRaw = alunoSnap.data().conquistas || [];
        // garantindo que o ID seja string
        const alunoConquistas = alunoConquistasRaw.map(id => String(id));


        const conquistasRef = collection(db, 'conquistas');
        const conquistasSnap = await getDocs(conquistasRef);


        const conquistasNaoAdquiridas = conquistasSnap.docs
            .filter(doc => !alunoConquistas.includes(doc.id))
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

        return conquistasNaoAdquiridas;
    };

    const verificarConquistaPendenteSessaoTreino = async (idTreino, uid) => {
        const docRef = doc(db, 'treino', idTreino);
        const docSnap = await getDoc(docRef);

        const treino = docSnap.data();

        if (treino.sessoesRealizadas == null) return;

        if (treino.sessoes === treino.sessoesRealizadas.qtd) {
            // garantindo que o ID seja string
            const docRef2 = doc(db, "conquistas", String(7));
            const docSnap2 = await getDoc(docRef2);

            const conquista = docSnap2.data();

            await updateDoc(doc(db, 'aluno', uid), {
                pontos: increment(conquista.pontos),
                // garantindo que o ID seja string
                conquistas: arrayUnion(String(7))
            });


            await enviarMensagem("Conquista desbloqueada", conquista?.descricao);

            Toast.show({
                type: 'success',
                text1: `Conquista Desbloqueada!`,
                text2: `${conquista?.nome}`,
                position: 'top',
            });
        }
    };

    const verificarConquistaPerfil = async (uid) => {
        const docRef = doc(db, 'aluno', uid);
        const docSnap = await getDoc(docRef);

        const user = docSnap.data();

        if (!verificarProps(user)) return null;

        // garantindo que o ID seja string
        if (user.conquistas && user.conquistas.includes(String(13))) return null;

        // garantindo que o ID seja string
        const docRef2 = doc(db, "conquistas", String(13));
        const docSnap2 = await getDoc(docRef2);

        const conquista = docSnap2.data();

        await updateDoc(doc(db, 'aluno', uid), {
            pontos: increment(conquista.pontos),
            // garantindo que o ID seja string
            conquistas: arrayUnion(String(13))
        });

        await enviarMensagem("Conquista desbloqueada", conquista?.descricao);

        Toast.show({
            type: 'success',
            text1: `Conquista Desbloqueada!`,
            text2: `${conquista?.nome}`,
            position: 'top',
        });
    };

    function verificarProps(user) {
        if (user.nome == null ||
            user.sobrenome == null ||
            user.email == null ||
            user.telefone == null ||
            user.dataNasc == null ||
            user.sexo == null
        ) {
            return false;
        }
        return true;
    }

    const verificarConquistaVinculo = async (user, uid) => {
        // garantindo que o ID seja string
        if (user.conquistas && user.conquistas.includes(String(11))) return null;

        // garantindo que o ID seja string
        const docRef2 = doc(db, "conquistas", String(11));
        const docSnap2 = await getDoc(docRef2);

        const conquista = docSnap2.data();

        await updateDoc(doc(db, 'aluno', uid), {
            pontos: increment(conquista.pontos),
            // garantindo que o ID seja string
            conquistas: arrayUnion(String(11))
        });
    };

    const getAllConquistas = async () => {
        const conquistasRef = collection(db, 'conquistas');
        const snapshot = await getDocs(conquistasRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    };

    return { aplicarConquistaPendente, buscarConquistasDoAluno, buscarConquistasNaoDesbloqueadas, verificarConquistaPendenteAvaliacao, verificarConquistaPendenteSessaoTreino, verificarConquistaPerfil, verificarConquistaVinculo, getAllConquistas };
};