import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

const format = (valor, sufixo = '') => {
  return valor !== undefined && valor !== null && valor !== ''
    ? `${valor}${sufixo}`
    : 'Não informado';
};

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
