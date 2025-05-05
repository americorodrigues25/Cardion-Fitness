import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export async function gerarPdfUsuario(usuario) {
  try {
    const htmlContent = `
      <h1>Informações do Usuário</h1>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Nome:</strong> ${usuario.nome}</p>
      <p><strong>Telefone:</strong> ${usuario.telefone ?? 'Não informado'}</p>
      <p><strong>Data de Nascimento:</strong> ${usuario.dataNasc ?? 'Não informado'}</p>
      <p><strong>Sexo:</strong> ${usuario.sexo ?? 'Não informado'}</p>
      <p><strong>Peso:</strong> ${usuario.peso ?? 'Não informado'}</p>
      <p><strong>Altura:</strong> ${usuario.altura ?? 'Não informado'}</p>
      <p><strong>Objetivo:</strong> ${usuario.objetivo ?? 'Não informado'}</p>
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
