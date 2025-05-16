import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

<<<<<<< HEAD
export async function gerarPdfAvaliacao(avaliacao) {
  try {
    const htmlContent = `
      <h1>Avaliação Física</h1>
      <h2>Detalhes</h2>
      <p><strong>Foco da avaliação:</strong> ${avaliacao.focoAvaliacao ?? 'Não informado'}</p>
      <p><strong>Data:</strong> ${avaliacao.data ?? 'Não informado'}</p>
      <h2>Dados Pessoais</h2>
      <p><strong>Nome:</strong> ${avaliacao.nome ?? 'Não informado'}</p>
      <p><strong>Idade:</strong> ${avaliacao.idade ?? 'Não informado'}</p>
      <p><strong>Sexo:</strong> ${avaliacao.sexo ?? 'Não informado'}</p>
      <h2>Perímetros</h2>
      <p><strong>Cintura (cm):</strong> ${avaliacao.cintura ?? 'Não informado'}</p>
      <p><strong>Quadril (cm):</strong> ${avaliacao.quadril ?? 'Não informado'}</p>
      <p><strong>Peitoral (cm):</strong> ${avaliacao.peitoral ?? 'Não informado'}</p>
      <p><strong>Abdômen (cm):</strong> ${avaliacao.abdomen ?? 'Não informado'}</p>
      <p><strong>Braço Relaxado (cm):</strong> ${avaliacao.bracoRelaxado ?? 'Não informado'}</p>
      <p><strong>Braço Contraido (cm):</strong> ${avaliacao.bracoContraido ?? 'Não informado'}</p>
      <p><strong>Antebraço (cm):</strong> ${avaliacao.antebraco ?? 'Não informado'}</p>
      <p><strong>Pescoço (cm):</strong> ${avaliacao.pescoco ?? 'Não informado'}</p>
      <p><strong>Coxa (cm):</strong> ${avaliacao.coxa ?? 'Não informado'}</p>
      <p><strong>Panturrilha (cm):</strong> ${avaliacao.panturilha ?? 'Não informado'}</p>
      <h2>Resultados</h2>
      <p><strong>Peso (kg):</strong> ${avaliacao.peso ?? 'Não informado'}</p>
      <p><strong>Altura (m):</strong> ${avaliacao.altura ?? 'Não informado'}</p>
      <p><strong>IMC:</strong> ${avaliacao.imc ?? 'Não informado'}</p>
      <p><strong>% Gordura:</strong> ${avaliacao.percentualGordura ?? 'Não informado'}</p>
      <p><strong>Massa Gorda (kg):</strong> ${avaliacao.massaGorda ?? 'Não informado'}</p>
      <p><strong>Massa Magra (kg):</strong> ${avaliacao.massaMagra ?? 'Não informado'}</p>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent, 
=======
export async function GerarPdfAvaliacao() {
  try {
    const htmlContent = `
      <h1>Avaliação</h1>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Peso:</strong> ${peso ?? 'Não informado'}</p>
      <p><strong>Altura:</strong> ${altura ?? 'Não informado'}</p>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
>>>>>>> 96d11e2 (t)
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Compartilhamento não disponível');
    }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    Alert.alert('Erro', 'Falha ao gerar PDF');
  }
}
