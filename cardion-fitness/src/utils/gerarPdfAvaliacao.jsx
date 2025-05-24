import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

import Toast from "react-native-toast-message";

<<<<<<< HEAD
<<<<<<< HEAD
=======
const format = (valor, sufixo = '') => {
  return valor !== undefined && valor !== null && valor !== ''
    ? `${valor}${sufixo}`
    : 'Não informado';
};

>>>>>>> 9d5b3e6 (fix: Corrige bug de formatação na hora de exportar PDF)
export async function gerarPdfAvaliacao(avaliacao) {
  try {
    const htmlContent = `
      <h1>Avaliação Física</h1>
      <h2>Detalhes</h2>
      <p><strong>Foco da avaliação:</strong> ${format(avaliacao.focoAvaliacao)}</p>
      <p><strong>Data:</strong> ${format(avaliacao.data)}</p>
      <p><strong>Data próxima avaliação:</strong> ${format(avaliacao.dataProximaAvaliacao)}</p>
      
      <h2>Dados Pessoais</h2>
      <p><strong>Nome:</strong> ${format(avaliacao.nome)}</p>
      <p><strong>Idade:</strong> ${format(avaliacao.idade)}</p>
      <p><strong>Sexo:</strong> ${format(avaliacao.sexo)}</p>
      
      <h2>Perímetros</h2>
      <p><strong>Cintura (cm):</strong> ${format(avaliacao.cintura, ' cm')}</p>
      <p><strong>Quadril (cm):</strong> ${format(avaliacao.quadril, ' cm')}</p>
      <p><strong>Peitoral (cm):</strong> ${format(avaliacao.peitoral, ' cm')}</p>
      <p><strong>Abdômen (cm):</strong> ${format(avaliacao.abdomen, ' cm')}</p>
      <p><strong>Braço Relaxado (cm):</strong> ${format(avaliacao.bracoRelaxado, ' cm')}</p>
      <p><strong>Braço Contraído (cm):</strong> ${format(avaliacao.bracoContraido, ' cm')}</p>
      <p><strong>Antebraço (cm):</strong> ${format(avaliacao.antebraco, ' cm')}</p>
      <p><strong>Pescoço (cm):</strong> ${format(avaliacao.pescoco, ' cm')}</p>
      <p><strong>Coxa (cm):</strong> ${format(avaliacao.coxa, ' cm')}</p>
      <p><strong>Panturrilha (cm):</strong> ${format(avaliacao.panturrilha, ' cm')}</p>
      
      <h2>Resultados</h2>
      <p><strong>Método de Cálculo (% de Gordura):</strong> ${format(avaliacao.metodoCalculo)}</p>
      <p><strong>Peso (kg):</strong> ${format(avaliacao.peso, ' kg')}</p>
      <p><strong>Altura (m):</strong> ${format(avaliacao.altura, ' m')}</p>
      <p><strong>IMC:</strong> ${format(avaliacao.imc)}</p>
      <p><strong>% Gordura:</strong> ${format(avaliacao.percentualGordura, ' %')}</p>
      <p><strong>Massa Gorda (kg):</strong> ${format(avaliacao.massaGorda, ' kg')}</p>
      <p><strong>Massa Magra (kg):</strong> ${format(avaliacao.massaMagra, ' kg')}</p>
    `;

    const { uri } = await Print.printToFileAsync({
<<<<<<< HEAD
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
=======
      html: htmlContent,
>>>>>>> 9d5b3e6 (fix: Corrige bug de formatação na hora de exportar PDF)
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
       Toast.show({
                      type: 'error',
                      text1: 'Compartilhamento não disponivel',                    
                    });
    }
  } catch (error) {
     Toast.show({
                      type: 'error',
                      text1: 'Erro ao gerar pdf',                    
                    });
  }
}
