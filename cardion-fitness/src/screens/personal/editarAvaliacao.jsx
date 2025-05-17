import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEditAvalicaoFisica } from '~/hook/crud/avaliacaoFisica/useEditAvaliacaoFisica';

import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';


export default function EditarAvaliacao() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { EditarAvaliacaoFisica, loading } = useEditAvalicaoFisica();
  const { avaliacao } = params;

  const [form, setForm] = useState({
    focoAvaliacao: avaliacao?.focoAvaliacao || '',
    data: avaliacao?.data || '',
    dataProximaAvaliacao: avaliacao?.dataProximaAvaliacao || '',
    nome: avaliacao?.nome || '',
    idade: avaliacao?.idade || '',
    sexo: avaliacao?.sexo || 'default',
    cintura: avaliacao?.cintura || '',
    quadril: avaliacao?.quadril || '',
    peitoral: avaliacao?.peitoral || '',
    abdomen: avaliacao?.abdomen || '',
    bracoRelaxado: avaliacao?.bracoRelaxado || '',
    bracoContraido: avaliacao?.bracoContraido || '',
    antebraco: avaliacao?.antebraco || '',
    pescoco: avaliacao?.pescoco || '',
    coxa: avaliacao?.coxa || '',
    panturrilha: avaliacao?.panturrilha || '',
    metodoCalculo: avaliacao?.metodoCalculo || 'default',
    peso: avaliacao?.peso || '',
    altura: avaliacao?.altura || '',
    imc: avaliacao?.imc || '',
    percentualGordura: avaliacao?.percentualGordura || '',
    massaMagra: avaliacao?.massaMagra || '',
    massaGorda: avaliacao?.massaGorda || '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = async () => {
    try {
      const resultado = await EditarAvaliacaoFisica(avaliacao.id, form);
      if (resultado) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Avaliação atualizada!',
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Não foi possível atualizar.',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    }
  };

  useEffect(() => {
    const pesoNum = parseFloat(form.peso.replace(',', '.'));
    const alturaNum = parseFloat(form.altura.replace(',', '.'));
    const idadeNum = parseInt(form.idade);
    const cinturaNum = parseFloat(form.cintura.replace(',', '.'));
    const quadrilNum = parseFloat(form.quadril.replace(',', '.'));
    const pescocoNum = parseFloat(form.pescoco.replace(',', '.'));

    if (pesoNum > 0 && alturaNum > 0 && idadeNum > 0 && (form.sexo === 'Masculino' || form.sexo === 'Feminino')) {
      const imcCalc = pesoNum / (alturaNum * alturaNum);
      const imc = imcCalc.toFixed(2);

      let percGorduraCalc = 0;
      if (form.metodoCalculo === 'IMC') {
        const sexoNum = form.sexo === 'Masculino' ? 1 : 0;
        percGorduraCalc = 1.2 * imcCalc + 0.23 * idadeNum - 10.8 * sexoNum - 5.4;
      } else if (form.metodoCalculo === 'NAVY') {
        if (form.sexo === 'Masculino' && cinturaNum > 0 && pescocoNum > 0) {
          percGorduraCalc = 86.010 * Math.log10(cinturaNum - pescocoNum) - 70.041 * Math.log10(alturaNum * 100) + 36.76;
        } else if (form.sexo === 'Feminino' && cinturaNum > 0 && pescocoNum > 0 && quadrilNum > 0) {
          percGorduraCalc = 163.205 * Math.log10(cinturaNum + quadrilNum - pescocoNum) - 97.684 * Math.log10(alturaNum * 100) - 78.387;
        }
      }

      const percentualGordura = Math.max(0, percGorduraCalc).toFixed(2);
      const massaGorda = (pesoNum * (percentualGordura / 100)).toFixed(2);
      const massaMagra = (pesoNum - pesoNum * (percentualGordura / 100)).toFixed(2);

      setForm((prev) => ({
        ...prev,
        imc,
        percentualGordura,
        massaGorda,
        massaMagra,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        imc: '',
        percentualGordura: '',
        massaGorda: '',
        massaMagra: '',
      }));
    }
  }, [
    form.peso,
    form.altura,
    form.idade,
    form.sexo,
    form.metodoCalculo,
    form.cintura,
    form.quadril,
    form.pescoco
  ]);

  const formatarData = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned
      .slice(0, 8)
      .replace(/(\d{2})(\d{0,2})(\d{0,4})/, (_, d, m, y) => {
        let resultado = d;
        if (m) resultado += '/' + m;
        if (y) resultado += '/' + y;
        return resultado;
      });

    return formatted;
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="pt-5 px-5">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
              <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
              <Text className="ml-2 text-colorLight200">Editar avaliação</Text>
            </TouchableOpacity>
          </View>

          <View className="px-4 py-5">
            <Text className="text-2xl font-bold mb-6 text-colorLight200 text-center">Editar Avaliação</Text>

            <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
              <Text className="text-lg font-semibold mb-2 text-colorLight200">Detalhes:</Text>
              <View className='mb-2'>
                <Text className='text-gray-400 mb-1'>Foco da avaliação</Text>
                <TextInput
                  value={form.focoAvaliacao}
                  onChangeText={(text) => handleChange('focoAvaliacao', text)}
                  placeholder="Data Avaliação"
                  placeholderTextColor='#9CA3AF'
                  className="flex-1 h-12 px-4 rounded-lg bg-colorLight200"
                />
              </View>

              <View className="flex-row gap-x-3">
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Data Avaliação</Text>
                  <TextInput
                    value={form.data}
                    onChangeText={(text) => handleChange('data', formatarData(text))}
                    placeholder="DD/MM/AAAA"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>


                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Próxima Avaliação</Text>
                  <TextInput
                    value={form.dataProximaAvaliacao}
                    onChangeText={(text) => handleChange('dataProximaAvaliacao', formatarData(text))}
                    placeholder="DD/MM/AAAA"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
              </View>
            </View>

            <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
              <Text className="text-lg font-semibold mb-2 text-colorLight200">Dados Pessoais:</Text>
              <View className="flex-row gap-x-3 mb-2">
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Nome</Text>
                  <TextInput
                    value={form.nome}
                    onChangeText={(text) => handleChange('nome', text)}
                    placeholder="Digite o nome"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Idade</Text>
                  <TextInput
                    value={form.idade}
                    onChangeText={(text) => handleChange('idade', text)}
                    placeholder="Digite a idade"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
              </View>

              <Text className="text-gray-500 mb-1">Sexo</Text>
              <View className="rounded-lg bg-colorLight200">
                <Picker
                  selectedValue={form.sexo}
                  onValueChange={(itemValue) => handleChange('sexo', itemValue)}
                >
                  <Picker.Item label="Escolha um gênero" value="default" color="#9ca3af" enabled={false} />
                  <Picker.Item label="Masculino" value="Masculino" />
                  <Picker.Item label="Feminino" value="Feminino" />
                </Picker>
              </View>
            </View>

            <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
              <Text className="text-lg font-semibold mb-2 text-colorLight200">Perímetros:</Text>
              <View className="flex-row gap-x-3 mb-2">

                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Cintura</Text>
                  <TextInput
                    value={form.cintura}
                    onChangeText={(text) => handleChange('cintura', text)}
                    placeholder="Cintura (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Quadril</Text>
                  <TextInput
                    value={form.quadril}
                    onChangeText={(text) => handleChange('quadril', text)}
                    placeholder="Quadril (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
              </View>

              <View className="flex-row gap-x-3 mb-2">

                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Peitoral</Text>
                  <TextInput
                    value={form.peitoral}
                    onChangeText={(text) => handleChange('peitoral', text)}
                    placeholder="Peitoral (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Abdômen</Text>
                  <TextInput
                    value={form.abdomen}
                    onChangeText={(text) => handleChange('abdomen', text)}
                    placeholder="Abdômen (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
              </View>

              <View className="flex-row gap-x-3 mb-2">
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Braço Relaxado</Text>
                  <TextInput
                    value={form.bracoRelaxado}
                    onChangeText={(text) => handleChange('bracoRelaxado', text)}
                    placeholder="Braço Relaxado (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Braço Contraido</Text>
                  <TextInput
                    value={form.bracoContraido}
                    onChangeText={(text) => handleChange('bracoContraido', text)}
                    placeholder="Braço Contraido (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
              </View>

              <View className="flex-row gap-x-3 mb-2">
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Antebraço</Text>
                  <TextInput
                    value={form.antebraco}
                    onChangeText={(text) => handleChange('antebraco', text)}
                    placeholder="Antebraço (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Pescoço</Text>
                  <TextInput
                    value={form.pescoco}
                    onChangeText={(text) => handleChange('pescoco', text)}
                    placeholder="Pescoço (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
              </View>

              <View className="flex-row gap-x-3 mb-2">
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Coxa</Text>
                  <TextInput
                    value={form.coxa}
                    onChangeText={(text) => handleChange('coxa', text)}
                    placeholder="Coxa (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1">Panturrilha</Text>
                  <TextInput
                    value={form.panturrilha}
                    onChangeText={(text) => handleChange('panturrilha', text)}
                    placeholder="Panturrilha (cm)"
                    className="h-12 px-4 rounded-lg bg-colorLight200"
                  />
                </View>
              </View>
            </View>

            <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
              <Text className="text-lg font-semibold mb-1 text-colorLight200">Método de Cálculo:</Text>
              <View className="rounded-lg bg-colorLight200">
                <Picker
                  selectedValue={form.metodoCalculo}
                  onValueChange={(itemValue) => handleChange('metodoCalculo', itemValue)}
                >
                  <Picker.Item label="Escolha um método de cálculo" value="default" color="#9ca3af" enabled={false} />
                  <Picker.Item label="IMC (Deurenberg)" value="IMC" />
                  <Picker.Item label="Marinha (US Nasy)" value="NAVY" />
                </Picker>
              </View>
            </View>

            <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
              <Text className="text-lg font-semibold mb-2 text-colorLight200">Resultados</Text>
              <Text className="text-gray-500 mb-1">Peso</Text>
              <TextInput
                value={form.peso}
                onChangeText={(text) => handleChange('peso', text)}
                placeholder="Peso (kg)"
                className='flex-1 h-12 px-4 rounded-lg bg-colorLight200 mb-2'
              />

              <Text className="text-gray-500 mb-1">Altura</Text>
              <TextInput
                value={form.altura}
                onChangeText={(text) => handleChange('altura', text)}
                placeholder="Altura (kg)"
                className='flex-1 h-12 px-4 rounded-lg bg-colorLight200 mb-2'
              />

              <Text className="text-gray-500 mb-1">IMC</Text>
              <TextInput
                value={form.imc}
                onChangeText={(text) => handleChange('imc', text)}
                placeholder="IMC"
                className='flex-1 h-12 px-4 rounded-lg bg-colorLight200 mb-2'
              />

              <Text className="text-gray-500 mb-1">% Gordura</Text>
              <TextInput
                value={form.percentualGordura}
                onChangeText={(text) => handleChange('percentualGordura', text)}
                placeholder="% Gordura"
                className='flex-1 h-12 px-4 rounded-lg bg-colorLight200 mb-2'
              />

              <Text className="text-gray-500 mb-1">% Massa Gorda</Text>
              <TextInput
                value={form.massaGorda}
                onChangeText={(text) => handleChange('massaGorda', text)}
                placeholder="Massa Gorda"
                className='flex-1 h-12 px-4 rounded-lg bg-colorLight200 mb-2'
              />

              <Text className="text-gray-500 mb-1">% Massa Magra</Text>
              <TextInput
                value={form.massaMagra}
                onChangeText={(text) => handleChange('massaMagra', text)}
                placeholder="Massa Magra (kg)"
                className='flex-1 h-12 px-4 rounded-lg bg-colorLight200 mb-2'
              />
            </View>

            <View className='px-10'>
              <TouchableOpacity
                onPress={handleSalvar}
                className="bg-colorViolet py-3 rounded-full"
              >
                <Text className="text-colorLight200 text-center text-lg font-semibold">{loading ? 'Salvando...' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
