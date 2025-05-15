import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

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
