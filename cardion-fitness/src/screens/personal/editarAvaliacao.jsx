import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEditAvalicaoFisica } from '~/hook/crud/avaliacaoFisica/useEditAvaliacaoFisica';
import Toast from 'react-native-toast-message';

// Reusable Input component
const Input = ({ label, keyboardType = 'default', className = '', value, onChangeText, editable = true }) => (
  <View className={`mb-3 ${className}`}>
    <Text className="text-base text-gray-400 mb-1">{label}</Text>
    <TextInput
      className={`w-full h-12 px-4 py-3 rounded-lg border ${editable ? 'bg-colorLight200' : 'bg-gray-200'}`}
      placeholder={label}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      placeholderTextColor="gray"
    />
  </View>
);

export default function EditarAvaliacao() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { EditarAvaliacaoFisica, loading } = useEditAvalicaoFisica();
  const { avaliacao } = params;

  const [modalVisible, setModalVisible] = useState(false);

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
    // Campos para Pollock 3 dobras (HOMEM: Peitoral, Abdominal, Coxa / MULHER: Tríceps, Supra-ilíaca, Coxa)
    dobraPollock3_1: avaliacao?.dobraPollock3_1 || '', // Será Peitoral (H) ou Tríceps (M)
    dobraPollock3_2: avaliacao?.dobraPollock3_2 || '', // Será Abdominal (H) ou Supra-ilíaca (M)
    dobraPollock3_3: avaliacao?.dobraPollock3_3 || '', // Será Coxa (H/M)

    // Campos para Pollock 7 dobras
    dobraPeitoral7: avaliacao?.dobraPeitoral7 || '',
    dobraAbdominal7: avaliacao?.dobraAbdominal7 || '',
    dobraTriceps7: avaliacao?.dobraTriceps7 || '',
    dobraSubescapular7: avaliacao?.dobraSubescapular7 || '',
    dobraAxilar7: avaliacao?.dobraAxilar7 || '',
    dobraSuprailiaca7: avaliacao?.dobraSuprailiaca7 || '',
    dobraSuprailiaca7: avaliacao?.dobraSuprailiaca7 || '',
    dobraCoxa7: avaliacao?.dobraCoxa7 || '',
  });

  const validarCampos = () => {
    if (!form.focoAvaliacao.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha o objetivo da avaliação.' });
      return false;
    }
    if (!form.data.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha a data da avaliação.' });
      return false;
    }
    if (!form.dataProximaAvaliacao.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha a próxima avaliação.' });
      return false;
    }
    if (!form.nome.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha o nome.' });
      return false;
    }
    if (!form.idade.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha a idade.' });
      return false;
    }
    if (form.sexo === 'default') {
      Toast.show({ type: 'error', text1: 'Selecione o sexo.' });
      return false;
    }
    if (form.metodoCalculo === 'default') {
      Toast.show({ type: 'error', text1: 'Selecione o método de cálculo.' });
      return false;
    }
    if (!form.peso.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha o peso.' });
      return false;
    }
    if (!form.altura.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha a altura.' });
      return false;
    }

    // Validação dos inputs para Pollock 3 dobras
    if (form.metodoCalculo === 'Pollock3') {
      if (!form.dobraPollock3_1 || !form.dobraPollock3_2 || !form.dobraPollock3_3) {
        Toast.show({ type: 'error', text1: 'Preencha todas as dobras para Pollock 3 Dobras.' });
        return false;
      }
    }
    // Validação dos inputs para Pollock 7 dobras
    if (form.metodoCalculo === 'Pollock7') {
      if (!form.dobraPeitoral7 || !form.dobraAbdominal7 || !form.dobraTriceps7 || !form.dobraSubescapular7 ||
        !form.dobraAxilar7 || !form.dobraSuprailiaca7 || !form.dobraCoxa7) {
        Toast.show({ type: 'error', text1: 'Preencha todas as dobras para Pollock 7 Dobras.' });
        return false;
      }
    }

    return true;
  };

  const salvarAvaliacao = async () => {
    if (!validarCampos()) return;

    const avaliacaoData = {
      ...form,
      atualizadoEm: new Date(),
    };

    try {
      await EditarAvaliacaoFisica(avaliacao.id, avaliacaoData);
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Avaliação atualizada ✅',
      });
      navigation.goBack();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar avaliação',
        text2: err.message,
      });
      console.log(err);
    }
  };

  useEffect(() => {
    const pesoNum = parseFloat(form.peso.replace(',', '.'));
    const alturaNum = parseFloat(form.altura.replace(',', '.'));
    const idadeNum = parseInt(form.idade);
    const sexo = form.sexo;

    // Função auxiliar para somar dobras e converter string para float com fallback 0
    const toFloat = (v) => {
      const n = parseFloat(v.replace(',', '.'));
      return isNaN(n) ? 0 : n;
    };

    let percentualGorduraCalc = null;
    let imcCalc = null;
    let massaGordaCalc = null;
    let massaMagraCalc = null;

    // Cálculo do IMC
    if (pesoNum > 0 && alturaNum > 0) {
      imcCalc = pesoNum / (alturaNum * alturaNum);
    }

    // Cálculos de Percentual de Gordura, Massa Gorda e Massa Magra
    if (pesoNum > 0 && alturaNum > 0 && idadeNum > 0 && (sexo === 'Masculino' || sexo === 'Feminino')) {
      if (form.metodoCalculo === 'Pollock3') {
        const dobra1 = toFloat(form.dobraPollock3_1);
        const dobra2 = toFloat(form.dobraPollock3_2);
        const dobra3 = toFloat(form.dobraPollock3_3);

        if (dobra1 > 0 && dobra2 > 0 && dobra3 > 0) {
          const somaDobras = dobra1 + dobra2 + dobra3;

          let densidadeCorporal = 0;
          if (sexo === 'Masculino') {
            // Pollock 3 Dobras - Homens (Peitoral, Abdominal, Coxa)
            densidadeCorporal = 1.10938 - 0.0008267 * somaDobras + 0.0000016 * somaDobras * somaDobras - 0.0002574 * idadeNum;
          } else { // Feminino
            // Pollock 3 Dobras - Mulheres (Tríceps, Supra-ilíaca, Coxa)
            densidadeCorporal = 1.0994921 - 0.0009929 * somaDobras + 0.0000023 * somaDobras * somaDobras - 0.0001392 * idadeNum;
          }

          if (densidadeCorporal > 0) {
            percentualGorduraCalc = (495 / densidadeCorporal) - 450;
          }
        }
      } else if (form.metodoCalculo === 'Pollock7') {
        const dobraPeitoral7Num = toFloat(form.dobraPeitoral7);
        const dobraAbdominal7Num = toFloat(form.dobraAbdominal7);
        const dobraTriceps7Num = toFloat(form.dobraTriceps7);
        const dobraSubescapular7Num = toFloat(form.dobraSubescapular7);
        const dobraAxilar7Num = toFloat(form.dobraAxilar7);
        const dobraSuprailiaca7Num = toFloat(form.dobraSuprailiaca7);
        const dobraCoxa7Num = toFloat(form.dobraCoxa7);

        // As 7 dobras devem ser preenchidas para o cálculo
        if (dobraPeitoral7Num > 0 && dobraAbdominal7Num > 0 && dobraTriceps7Num > 0 &&
          dobraSubescapular7Num > 0 && dobraAxilar7Num > 0 && dobraSuprailiaca7Num > 0 && dobraCoxa7Num > 0) {

          const somaDobras = dobraPeitoral7Num + dobraAbdominal7Num + dobraTriceps7Num
            + dobraSubescapular7Num + dobraAxilar7Num + dobraSuprailiaca7Num + dobraCoxa7Num;

          let densidadeCorporal = 0;
          if (sexo === 'Masculino') {
            // Pollock 7 Dobras - Homens
            densidadeCorporal = 1.112 - (0.00043499 * somaDobras) + (0.00000055 * somaDobras * somaDobras) - (0.00028826 * idadeNum);
          } else { // Feminino
            // Pollock 7 Dobras - Mulheres
            densidadeCorporal = 1.097 - (0.00046971 * somaDobras) + (0.00000056 * somaDobras * somaDobras) - (0.00012828 * idadeNum);
          }

          if (densidadeCorporal > 0) {
            percentualGorduraCalc = (495 / densidadeCorporal) - 450;
          }
        }
      }

      if (percentualGorduraCalc !== null && pesoNum > 0 && !isNaN(percentualGorduraCalc)) {
        massaGordaCalc = (percentualGorduraCalc / 100) * pesoNum;
        massaMagraCalc = pesoNum - massaGordaCalc;
      }
    }

    setForm(prev => ({
      ...prev,
      imc: imcCalc !== null && !isNaN(imcCalc) ? imcCalc.toFixed(2).replace('.', ',') : '',
      percentualGordura: percentualGorduraCalc !== null && !isNaN(percentualGorduraCalc) ? percentualGorduraCalc.toFixed(2).replace('.', ',') : '',
      massaGorda: massaGordaCalc !== null && !isNaN(massaGordaCalc) ? massaGordaCalc.toFixed(2).replace('.', ',') : '',
      massaMagra: massaMagraCalc !== null && !isNaN(massaMagraCalc) ? massaMagraCalc.toFixed(2).replace('.', ',') : '',
    }));
  }, [
    form.peso,
    form.altura,
    form.idade,
    form.sexo,
    form.metodoCalculo,
    form.dobraPollock3_1,
    form.dobraPollock3_2,
    form.dobraPollock3_3,
    form.dobraPeitoral7,
    form.dobraAbdominal7,
    form.dobraTriceps7,
    form.dobraSubescapular7,
    form.dobraAxilar7,
    form.dobraSuprailiaca7,
    form.dobraCoxa7,
  ]);

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className='flex-1 bg-colorBackground px-5 py-2'
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-5 pb-5">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
              <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
              <Text className="ml-2 text-colorLight200">Editar Avaliação</Text>
            </TouchableOpacity>
          </View>

          <View className='border border-gray-500 p-3 rounded-xl mb-3'>
            <Text className='text-colorLight300 font-bold text-lg mb-2'>Detalhes Avaliação:</Text>
            <Input label="Foco da Avaliação" value={form.focoAvaliacao} onChangeText={text => setForm(prev => ({ ...prev, focoAvaliacao: text }))} />
            <Input label="Data da Avaliação (dd/mm/aaaa)" value={form.data} onChangeText={text => setForm(prev => ({ ...prev, data: text }))} />
            <Input label="Próxima Avaliação (dd/mm/aaaa)" value={form.dataProximaAvaliacao} onChangeText={text => setForm(prev => ({ ...prev, dataProximaAvaliacao: text }))} />
          </View>

          <View className='border border-gray-500 p-3 rounded-xl mb-3'>
            <Text className='text-colorLight300 font-bold text-lg mb-2'>Dados Pessoais:</Text>
            <Input label="Nome" value={form.nome} onChangeText={text => setForm(prev => ({ ...prev, nome: text }))} />
            <Input label="Idade" keyboardType="numeric" value={form.idade} onChangeText={text => setForm(prev => ({ ...prev, idade: text.replace(/[^0-9]/g, '') }))} />

            <View className="mb-4">
              <Text className="text-base text-gray-400 mb-1">Sexo</Text>
              <View className="border border-colorLight200 bg-colorLight300 rounded-lg overflow-hidden">
                <Picker
                  selectedValue={form.sexo}
                  onValueChange={(itemValue) => setForm(prev => ({ ...prev, sexo: itemValue }))}
                >
                  <Picker.Item label="Selecione o sexo" value="default" color="gray" />
                  <Picker.Item label="Masculino" value="Masculino" />
                  <Picker.Item label="Feminino" value="Feminino" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Medidas de Circunferência - Mantidas iguais para ambos os sexos */}
          <View className='border border-gray-500 p-3 rounded-xl mb-3'>
            <Text className='text-colorLight300 font-bold text-lg mb-2'>Perímetros Corporais:</Text>
            <View className='flex-row gap-x-2'>
              <Input label="Peso (kg)" keyboardType="numeric" value={form.peso} onChangeText={text => setForm(prev => ({ ...prev, peso: text.replace(',', '.').replace(/[^0-9.]/g, '') }))} className='flex-1' />
              <Input label="Altura (m)" keyboardType="numeric" value={form.altura} onChangeText={text => setForm(prev => ({ ...prev, altura: text.replace(',', '.').replace(/[^0-9.]/g, '') }))} className='flex-1' />
            </View>
            <View className='flex-row gap-x-2'>
              <Input label="Cintura (cm)" keyboardType="numeric" value={form.cintura} onChangeText={text => setForm(prev => ({ ...prev, cintura: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
              <Input label="Quadril (cm)" keyboardType="numeric" value={form.quadril} onChangeText={text => setForm(prev => ({ ...prev, quadril: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
            </View>

            <View className='flex-row gap-x-2'>
              <Input label="Peitoral (cm)" keyboardType="numeric" value={form.peitoral} onChangeText={text => setForm(prev => ({ ...prev, peitoral: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
              <Input label="Abdômen (cm)" keyboardType="numeric" value={form.abdomen} onChangeText={text => setForm(prev => ({ ...prev, abdomen: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
            </View>

            <View className='flex-row gap-x-2'>
              <Input label="Braço Relaxado (cm)" keyboardType="numeric" value={form.bracoRelaxado} onChangeText={text => setForm(prev => ({ ...prev, bracoRelaxado: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
              <Input label="Braço Contraído (cm)" keyboardType="numeric" value={form.bracoContraido} onChangeText={text => setForm(prev => ({ ...prev, bracoContraido: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
            </View>

            <View className='flex-row gap-x-2'>
              <Input label="Antebraço (cm)" keyboardType="numeric" value={form.antebraco} onChangeText={text => setForm(prev => ({ ...prev, antebraco: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
              <Input label="Pescoço (cm)" keyboardType="numeric" value={form.pescoco} onChangeText={text => setForm(prev => ({ ...prev, pescoco: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
            </View>

            <View className='flex-row gap-x-2'>
              <Input label="Coxa (cm)" keyboardType="numeric" value={form.coxa} onChangeText={text => setForm(prev => ({ ...prev, coxa: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
              <Input label="Panturrilha (cm)" keyboardType="numeric" value={form.panturrilha} onChangeText={text => setForm(prev => ({ ...prev, panturrilha: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
            </View>
          </View>


          <View className='border border-gray-500 p-3 rounded-xl mb-3'>
            <Text className="text-base text-gray-400 mb-1">Método de Cálculo</Text>
            <View className="bg-colorLight200 rounded-lg overflow-hidden">
              <Picker
                selectedValue={form.metodoCalculo}
                onValueChange={(itemValue) => setForm(prev => ({ ...prev, metodoCalculo: itemValue }))}
              >
                <Picker.Item label="Selecione um método" value="default" color="gray" />
                <Picker.Item label="Pollock 3 Dobras" value="Pollock3" />
                <Picker.Item label="Pollock 7 Dobras" value="Pollock7" />
              </Picker>
            </View>

            {/* Inputs para Pollock 3 Dobras - Condicional pelo Sexo */}
            {form.metodoCalculo === 'Pollock3' && (
              <>
                <Text className="text-white font-semibold my-2">Insira as dobras cutâneas (mm) - Pollock 3 Dobras</Text>
                {form.sexo === 'Masculino' ? (
                  <>
                    <Input label="Dobra Peitoral" keyboardType="numeric" value={form.dobraPollock3_1} onChangeText={text => setForm(prev => ({ ...prev, dobraPollock3_1: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Abdominal" keyboardType="numeric" value={form.dobraPollock3_2} onChangeText={text => setForm(prev => ({ ...prev, dobraPollock3_2: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Coxa" keyboardType="numeric" value={form.dobraPollock3_3} onChangeText={text => setForm(prev => ({ ...prev, dobraPollock3_3: text.replace(/[^0-9.]/g, '') }))} />
                  </>
                ) : form.sexo === 'Feminino' ? (
                  <>
                    <Input label="Dobra Tríceps" keyboardType="numeric" value={form.dobraPollock3_1} onChangeText={text => setForm(prev => ({ ...prev, dobraPollock3_1: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Supra-ilíaca" keyboardType="numeric" value={form.dobraPollock3_2} onChangeText={text => setForm(prev => ({ ...prev, dobraPollock3_2: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Coxa" keyboardType="numeric" value={form.dobraPollock3_3} onChangeText={text => setForm(prev => ({ ...prev, dobraPollock3_3: text.replace(/[^0-9.]/g, '') }))} />
                  </>
                ) : (
                  <Text className="text-gray-400 mb-2">Selecione o sexo para ver as dobras de Pollock 3.</Text>
                )}
              </>
            )}

            {/* Inputs para Pollock 7 Dobras - Condicional pelo Sexo */}
            {form.metodoCalculo === 'Pollock7' && (
              <>
                <Text className="text-white font-semibold mb-2">Insira as dobras cutâneas (mm) - Pollock 7 Dobras</Text>
                {form.sexo === 'Masculino' || form.sexo === 'Feminino' ? ( // Ambos os sexos usam os mesmos labels, mas fórmulas diferentes
                  <>
                    <Input label="Dobra Peitoral" keyboardType="numeric" value={form.dobraPeitoral7} onChangeText={text => setForm(prev => ({ ...prev, dobraPeitoral7: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Abdominal" keyboardType="numeric" value={form.dobraAbdominal7} onChangeText={text => setForm(prev => ({ ...prev, dobraAbdominal7: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Tríceps" keyboardType="numeric" value={form.dobraTriceps7} onChangeText={text => setForm(prev => ({ ...prev, dobraTriceps7: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Subescapular" keyboardType="numeric" value={form.dobraSubescapular7} onChangeText={text => setForm(prev => ({ ...prev, dobraSubescapular7: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Axilar Média" keyboardType="numeric" value={form.dobraAxilar7} onChangeText={text => setForm(prev => ({ ...prev, dobraAxilar7: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Supra-ilíaca" keyboardType="numeric" value={form.dobraSuprailiaca7} onChangeText={text => setForm(prev => ({ ...prev, dobraSuprailiaca7: text.replace(/[^0-9.]/g, '') }))} />
                    <Input label="Dobra Coxa" keyboardType="numeric" value={form.dobraCoxa7} onChangeText={text => setForm(prev => ({ ...prev, dobraCoxa7: text.replace(/[^0-9.]/g, '') }))} />
                  </>
                ) : (
                  <Text className="text-gray-400 mb-2">Selecione o sexo para ver as dobras de Pollock 7.</Text>
                )}
              </>
            )}
          </View>


          {/* Bloco de Resultados - Sempre visível */}
          <View className='border border-gray-500 p-3 rounded-xl'>
            <Text className="text-white text-lg font-semibold mb-2">Resultados</Text>
            <Input label="IMC" value={form.imc} editable={false} />
            <Input label="Percentual de Gordura (%)" value={form.percentualGordura} editable={false} />
            <Input label="Massa Gorda (kg)" value={form.massaGorda} editable={false} />
            <Input label="Massa Magra (kg)" value={form.massaMagra} editable={false} />
          </View>

          <TouchableOpacity
            className="bg-colorViolet py-3 rounded-full my-4"
            onPress={salvarAvaliacao}
            disabled={loading}
          >
            <Text className="text-center text-colorLight200 font-bold text-lg">{loading ? 'Salvando...' : 'Salvar Avaliação'}</Text>
          </TouchableOpacity>


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
};