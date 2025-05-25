import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

import Toast from "react-native-toast-message";

export async function gerarPdfTreinos(treinos,nomeAluno) {
  try {
    
    let htmlContent = ` <h1>Ficha de Treino - ${nomeAluno} </h1>`;

    treinos.forEach((treino) => {
      htmlContent += `
        <h2>${treino.nome}</h2>
        <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th>Exercício</th>
              <th>Séries</th>
              <th>Repetições</th>
              <th>Descanso</th>
            </tr>
          </thead>
          <tbody>
      `;

      treino.exercicios.forEach((ex) => {
        htmlContent += `
          <tr>
            <td>${ex.nome}</td>
            <td>${ex.series}</td>
            <td>${ex.repeticoes}</td>
            <td>${ex.descanso} segundos</td>
          </tr>
        `;
      });

      htmlContent += `
          </tbody>
        </table>
      `;
  });

    const { uri } = await Print.printToFileAsync({
      html: htmlContent, 
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Toast.show({
                      type: 'error',
                      text1: 'compartilhamento não disponivel',                    
                    });
    }
  } catch (error) {
    Toast.show({
                      type: 'error',
                      text1: 'Erro ao gerar pdf',                    
                    });
  }
}
