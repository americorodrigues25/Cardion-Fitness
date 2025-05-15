import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export async function gerarPdfAvaliacao(avaliacao) {
  try {
    const htmlContent = `
      <h1>Avaliação Física</h1>
      <h2>Valores antropométricos</h2>
      <p><strong>Data da avaliação:</strong> ${avaliacao.data}</p>
      <p><strong>Peso atual:</strong> ${avaliacao.nome}</p>
      <p><strong>Altura:</strong> ${avaliacao.telefone ?? 'Não informado'}</p>
      <p><strong>Per.gordura:</strong> ${avaliacao.dataNasc ?? 'Não informado'}</p>
      <p><strong>Peso gordo:</strong> ${avaliacao.sexo ?? 'Não informado'}</p>
      <p><strong>Peso magro:</strong> ${avaliacao.peso ?? 'Não informado'}</p>
      <p><strong>Peso desejável:</strong> ${avaliacao.altura ?? 'Não informado'}</p>
      <h2>Perímetros</h2>
      <p><strong>Tórax:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Cintura:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Abdomen:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Quadril:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Antebraço D:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Antebraço E:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Braço D:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Braço E:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Coxa D:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Coxa E:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Panturilha D:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Panturilha E:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <h2>IMC</h2>
      <p><strong>IMC:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
      <p><strong>Resultado:</strong> ${avaliacao.objetivo ?? 'Não informado'}</p>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent, 
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
