import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';

import { gerarPdfAvaliacao } from '~/utils/gerarPdfAvaliacao';
import HeaderAppBack from '~/components/header/headerAppBack';

export default function DetalhesAvaliacaoFisica() {
  const { params } = useRoute();
  const { avaliacao } = params || {};
  const [loading, setLoading] = useState(false);

  const SectionTitle = ({ title }) => (
    <Text className="text-lg font-bold mt-6 mb-2 text-colorViolet">{title}</Text>
  );

  const InfoText = ({ label, value }) => (
    <Text className="text-base mb-1">
      <Text className="font-bold text-colorLight300">{label}: </Text>
      <Text className="text-colorLight300">{value}</Text>
    </Text>
  );

  const format = (val, suffix = '') => val ? `${val} ${suffix}` : 'Não informado';

  const handleDownload = async () => {
    setLoading(true);
    await gerarPdfAvaliacao(avaliacao);
    setLoading(false);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <HeaderAppBack title="Detalhes da avaliação" />

        <View className="p-8">
          <Text className="text-2xl font-extrabold mb-4 text-center text-colorLight200">
            Detalhes da Avaliação
          </Text>

          {!avaliacao ? (
            <Text className="text-center text-gray-500">
              Nenhuma informação disponível.
            </Text>
          ) : (
            <>
              <SectionTitle title="Identificação" />
              <InfoText label="Nome" value={avaliacao.nome} />
              <InfoText label="Idade" value={avaliacao.idade} />
              <InfoText label="Sexo" value={avaliacao.sexo} />

              <SectionTitle title="Informações da Avaliação" />
              <InfoText label="Foco da Avaliação" value={avaliacao.focoAvaliacao} />
              <InfoText label="Data" value={avaliacao.data} />
              <InfoText label="Próxima Avaliação" value={avaliacao.dataProximaAvaliacao} />
              <InfoText
                label="Método de Cálculo (% Gordura)"
                value={avaliacao.metodoCalculo || 'Não informado'}
              />

              <SectionTitle title="Medidas Corporais" />
              <InfoText label="Cintura" value={format(avaliacao.cintura, 'cm')} />
              <InfoText label="Quadril" value={format(avaliacao.quadril, 'cm')} />
              <InfoText label="Peitoral" value={format(avaliacao.peitoral, 'cm')} />
              <InfoText label="Abdômen" value={format(avaliacao.abdomen, 'cm')} />
              <InfoText label="Braço Relaxado" value={format(avaliacao.bracoRelaxado, 'cm')} />
              <InfoText label="Braço Contraído" value={format(avaliacao.bracoContraido, 'cm')} />
              <InfoText label="Antebraço" value={format(avaliacao.antebraco, 'cm')} />
              <InfoText label="Pescoço" value={format(avaliacao.pescoco, 'cm')} />
              <InfoText label="Coxa" value={format(avaliacao.coxa, 'cm')} />
              <InfoText label="Panturrilha" value={format(avaliacao.panturrilha, 'cm')} />

              <SectionTitle title="Resultados" />
              <InfoText label="Peso" value={format(avaliacao.peso, 'Kg')} />
              <InfoText label="Altura" value={format(avaliacao.altura, 'm')} />
              <InfoText label="IMC" value={avaliacao.imc || 'Não informado'} />
              <InfoText label="Percentual de Gordura" value={format(avaliacao.percentualGordura, '%')} />
              <InfoText label="Massa Magra" value={format(avaliacao.massaMagra, 'Kg')} />
              <InfoText label="Massa Gorda" value={format(avaliacao.massaGorda, 'Kg')} />
            </>
          )}
        </View>

        <View className="px-20 mb-8">
          <TouchableOpacity
            onPress={handleDownload}
            disabled={loading}
            className={`bg-colorViolet py-3 rounded-full ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <ActivityIndicator color="#E4E4E7" />
            ) : (
              <Text className="text-colorLight200 text-center text-lg font-semibold">
                Baixar Avaliação
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
