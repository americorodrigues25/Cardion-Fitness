// import * as Notifications from 'expo-notifications';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // const mensagens = [
// //   "Mensagem teste 1",
// //   "Mensagem teste 2",
// //   "Mensagem teste 3",
// //   "Mensagem teste 4",
// //   "Mensagem teste 5",
// // ];

// // //aqui é pra embaralhar o array de mensagens pra não seguir uma ordem
// // function embaralharMensagens(array) {
// //   const novoArray = [...array];
// //   for (let i = novoArray.length - 1; i > 0; i--) {
// //     const a = Math.floor(Math.random() * (i + 1));
// //     [novoArray[i], novoArray[a]] = [novoArray[a], novoArray[i]];
// //   }
// //   return novoArray;
// // }

// export async function configurarNotificacoes() {
//   const { status } = await Notifications.getPermissionsAsync();
//   if (status !== 'granted') {
//     const { status: newStatus } = await Notifications.requestPermissionsAsync();
//     if (newStatus !== 'granted') {
//       console.log('Permissão negada');
//       return;
//     }
//   }

//   await Notifications.cancelAllScheduledNotificationsAsync();

//   // try {
//   //   let listaMensagens = await AsyncStorage.getItem('listaMensagens');
//   //   let indiceAtual = await AsyncStorage.getItem('indiceAtual');

//   //   if (!listaMensagens || !indiceAtual) {
//   //     //cria nova lista
//   //     const listaNova = embaralharMensagens(mensagens);
//   //     await AsyncStorage.setItem('listaMensagens', JSON.stringify(listaNova));
//   //     await AsyncStorage.setItem('indiceAtual', '0');

//   //     listaMensagens = JSON.stringify(listaNova);
//   //     indiceAtual = '0';
//   //   }

//   //   const mensagensArray = JSON.parse(listaMensagens);
//   //   let indice = parseInt(indiceAtual, 10);

//   //   //msg atual
//   //   const mensagemDoDia = mensagensArray[indice];

//   //   //msg do proximo dia
//   //   indice += 1;

//   //   //quando acaba as mensagens da lista, embaralha de novo
//   //   if (indice >= mensagensArray.length) {
//   //     const novaLista = embaralharMensagens(mensagens);
//   //     await AsyncStorage.setItem('listaMensagens', JSON.stringify(novaLista));
//   //     indice = 0;
//   //   }

//   //   await AsyncStorage.setItem('indiceAtual', indice.toString());

//   //   //aqui agenda notificação
//   //   await Notifications.scheduleNotificationAsync({
//   //     content: {
//   //       title: 'Mensagem do dia',
//   //       body: mensagemDoDia,
//   //       sound: true,
//   //       priority: Notifications.AndroidNotificationPriority.HIGH,
//   //       color: '#6943FF',
//   //     },
//   //     //aqui coloquei pra chegar notificação 30 seg depois de agendar, pra ficar testando
//   //     trigger: {
//   //       seconds: 30,
//   //     },
//   //   });

//   //   console.log('Agendada ok');
//   // } catch (error) {
//   //   console.error('Erro ao configurar notificações:', error);
//   // }
// }
