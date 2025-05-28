import { doc, getDoc, updateDoc, arrayUnion, increment, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../../firebase/firebaseConfig';
import { enviarMensagem } from '~/utils/enviarNotificacao';
import Toast from 'react-native-toast-message';

export const useRealizarDesafio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function verificarConquistaPendente(uid) {
    const docRef = doc(db, 'aluno', uid);
    const docSnap = await getDoc(docRef);
    const user = docSnap.data();

    if (!user?.desafiosRealizados?.qtd) return;

    let idConquista = 0;
    switch (user.desafiosRealizados.qtd) {
      case 1:
        idConquista = 4;
        break;
      case 20:
        idConquista = 12
        break;
    }

    if(user.conquistas.includes(idConquista)) return 

    if (idConquista === 0) return;

    const conquistaSnap = await getDoc(doc(db, 'conquistas', String(idConquista)));
    const conquista = conquistaSnap.data();

    await updateDoc(docRef, {
      pontos: increment(conquista.pontos),
      conquistas: arrayUnion(idConquista),
    });

    await enviarMensagem('Conquista desbloqueada', conquista?.descricao);

    Toast.show({
      type: 'success',
      text1: 'Conquista Desbloqueada!',
      text2: conquista?.nome,
      position: 'top',
    });
  }

  const realizarDesafio = async (idAluno, idDesafio) => {
    setLoading(true);
    setError(null);

    try {
      const alunoRef = doc(db, 'aluno', idAluno);
      const alunoSnap = await getDoc(alunoRef);
      const aluno = alunoSnap.data();

      const historico = aluno?.desafiosRealizados?.historico || {};
      const hoje = new Date().toISOString().split('T')[0];

      if (historico[idDesafio] === hoje) {
        throw new Error('Você já realizou este desafio hoje.');
      }

      const desafioSnap = await getDoc(doc(db, 'desafios', idDesafio));
      const desafio = desafioSnap.data();

      const novoHistorico = {
        ...historico,
        [idDesafio]: hoje,
      };

      await updateDoc(alunoRef, {
        'desafiosRealizados.qtd': increment(1),
        'desafiosRealizados.historico': novoHistorico,
        pontos: increment(desafio.pontos),
        pontosDesafios: increment(desafio.pontos),
      });

      await verificarConquistaPendente(idAluno);
      return true;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    realizarDesafio,
    loading,
    error,
  };
};
