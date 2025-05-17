import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";

import { gerarPdfAvaliacao } from "~/utils/gerarPdfAvaliacao";

export default function DetalhesAvaliacao() {
  const route = useRoute();
  const navigation = useNavigation();
  const { avaliacao } = route.params || {};

  const SectionTitle = ({ title }) => (
    <Text className="text-lg font-bold mt-6 mb-2 text-colorViolet">{title}</Text>
  );

  const InfoText = ({ label, value }) => (
    <Text className="text-base mb-1">
      <Text className="font-bold text-colorLight300">{label}: </Text>
      <Text className="text-colorLight300">{value}</Text>
    </Text>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-colorBackground">
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="pt-5 px-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
            <Text className="ml-2 text-colorLight200">Detalhes da avaliação</Text>
          </TouchableOpacity>
        </View>
        <View className="p-8">
          <Text className="text-2xl font-extrabold mb-4 text-center text-colorLight200">
            Detalhes da Avaliação
          </Text>

          {avaliacao ? (
            <>
              <SectionTitle title="Identificação" />
              <InfoText label="Nome" value={avaliacao.nome} />
              <InfoText label="Idade" value={avaliacao.idade} />
              <InfoText label="Sexo" value={avaliacao.sexo} />

              <SectionTitle title="Informações da Avaliação" />
              <InfoText label="Foco da Avaliação" value={avaliacao.focoAvaliacao} />
              <InfoText label="Data" value={avaliacao.data} />
              <InfoText
                label="Próxima Avaliação"
                value={avaliacao.dataProximaAvaliacao}
              />
              <InfoText label="Método de Cálculo (% Gordura)" value={avaliacao.metodoCalculo || 'Não informado'} />

              <SectionTitle title="Medidas Corporais" />
              <InfoText label="Cintura" value={avaliacao.cintura ? `${avaliacao.cintura} cm` : 'Não informado'} />
              <InfoText label="Quadril" value={avaliacao.quadril ? `${avaliacao.quadril} cm` : 'Não informado'} />
              <InfoText label="Peitoral" value={avaliacao.peitoral ? `${avaliacao.peitoral} cm` : 'Não informado'} />
              <InfoText label="Abdômen" value={avaliacao.abdomen ? `${avaliacao.abdomen} cm` : 'Não informado'} />
              <InfoText label="Braço Relaxado" value={avaliacao.bracoRelaxado ? `${avaliacao.bracoRelaxado} cm` : 'Não informado'} />
              <InfoText label="Braço Contraído" value={avaliacao.bracoContraido ? `${avaliacao.bracoContraido} cm` : 'Não informado'} />
              <InfoText label="Antebraço" value={avaliacao.antebraco ? `${avaliacao.antebraco} cm` : 'Não informado'} />
              <InfoText label="Pescoço" value={avaliacao.pescoco ? `${avaliacao.pescoco} cm` : 'Não informado'} />
              <InfoText label="Coxa" value={avaliacao.coxa ? `${avaliacao.coxa} cm` : 'Não informado'} />
              <InfoText label="Panturrilha" value={avaliacao.panturrilha ? `${avaliacao.panturrilha} cm` : 'Não informado'} />

              <SectionTitle title="Resultados" />
              <InfoText label="Peso" value={avaliacao.peso ? `${avaliacao.peso} Kg` : 'Não informado'} />
              <InfoText label="Altura" value={avaliacao.altura ? `${avaliacao.altura} m` : 'Não informado'} />
              <InfoText label="IMC" value={avaliacao.imc || 'Não informado'} />
              <InfoText label="Percentual de Gordura" value={avaliacao.percentualGordura ? `${avaliacao.percentualGordura} %` : 'Não informado'} />
              <InfoText label="Massa Magra" value={avaliacao.massaMagra ? `${avaliacao.massaMagra} Kg` : 'Não informado'} />
              <InfoText label="Massa Gorda" value={avaliacao.massaGorda ? `${avaliacao.massaGorda} Kg` : 'Não informado'} />
            </>
          ) : (
            <Text className="text-center text-red-500">
              Nenhuma informação disponível.
            </Text>
          )}

        </View>
        <View className="px-20 mb-8">
          <TouchableOpacity
            onPress={() => gerarPdfAvaliacao(avaliacao)}
            className="bg-colorViolet py-3 rounded-full">
            <Text className="text-colorLight200 text-center text-lg font-semibold">Exportar PDF</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
