import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Image, ActivityIndicator } from 'react-native'; // Importe ActivityIndicator
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCreateAvaliacaoFisica } from '~/hook/crud/avaliacaoFisica/useCreateAvaliacaoFisica';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

const Input = ({ label, keyboardType = 'default', className = '', value, onChangeText, editable = true }) => (
    <View className={`mb-3 ${className}`}>
        <Text className="text-base text-gray-400 mb-1">{label}</Text>
        <TextInput
            className={`w-full h-12 px-4 py-3 rounded-lg ${editable ? 'bg-colorLight300' : 'bg-gray-300'}`}
            placeholder={label}
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            placeholderTextColor="gray"
        />
    </View>
);

export default function CriarAvaliacao() {
    const route = useRoute();
    const { idAluno } = route.params || {};


    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const [avaliacao, setAvaliacao] = useState({
        idAluno: '',
        idPersonal: '',
        focoAvaliacao: '',
        data: '',
        dataProximaAvaliacao: '',
        nome: '',
        idade: '',
        sexo: 'default',
        cintura: '',
        quadril: '',
        peitoral: '',
        abdomen: '',
        bracoRelaxado: '',
        bracoContraido: '',
        antebraco: '',
        pescoco: '',
        coxa: '',
        panturrilha: '',
        metodoCalculo: 'default',
        peso: '',
        altura: '',
        imc: '',
        percentualGordura: '',
        massaMagra: '',
        massaGorda: '',
        // Campos para Pollock 3 dobras (HOMEM: Peitoral, Abdominal, Coxa / MULHER: Tríceps, Supra-ilíaca, Coxa)
        dobraPollock3_1: '', // Será Peitoral (H) ou Tríceps (M)
        dobraPollock3_2: '', // Será Abdominal (H) ou Supra-ilíaca (M)
        dobraPollock3_3: '', // Será Coxa (H/M)

        // Campos para Pollock 7 dobras
        dobraPeitoral7: '',
        dobraAbdominal7: '',
        dobraTriceps7: '',
        dobraSubescapular7: '',
        dobraAxilar7: '',
        dobraSuprailiaca7: '',
        dobraCoxa7: '',
    });

    const { criarAvaliacaoFisica, loading } = useCreateAvaliacaoFisica();

    const validarCampos = () => {
        if (!avaliacao.focoAvaliacao.trim()) {
            Toast.show({ type: 'error', text1: 'Preencha o objetivo da avaliação.' });
            return false;
        }
        if (!avaliacao.data.trim()) {
            Toast.show({ type: 'error', text1: 'Preencha a data da avaliação.' });
            return false;
        }
        if (!avaliacao.dataProximaAvaliacao.trim()) {
            Toast.show({ type: 'error', text1: 'Preencha a próxima avaliação.' });
            return false;
        }
        if (!avaliacao.nome.trim()) {
            Toast.show({ type: 'error', text1: 'Preencha o nome.' });
            return false;
        }
        if (!avaliacao.idade.trim()) {
            Toast.show({ type: 'error', text1: 'Preencha a idade.' });
            return false;
        }
        if (avaliacao.sexo === 'default') {
            Toast.show({ type: 'error', text1: 'Selecione o sexo.' });
            return false;
        }
        if (avaliacao.metodoCalculo === 'default') {
            Toast.show({ type: 'error', text1: 'Selecione o método de cálculo.' });
            return false;
        }
        if (!avaliacao.peso.trim()) {
            Toast.show({ type: 'error', text1: 'Preencha o peso.' });
            return false;
        }
        if (!avaliacao.altura.trim()) {
            Toast.show({ type: 'error', text1: 'Preencha a altura.' });
            return false;
        }

        // Validação dos inputs para Pollock 3 dobras
        if (avaliacao.metodoCalculo === 'Pollock3') {
            if (!avaliacao.dobraPollock3_1 || !avaliacao.dobraPollock3_2 || !avaliacao.dobraPollock3_3) {
                Toast.show({ type: 'error', text1: 'Preencha todas as dobras para Pollock 3 Dobras.' });
                return false;
            }
        }
        // Validação dos inputs para Pollock 7 dobras
        if (avaliacao.metodoCalculo === 'Pollock7') {
            // Note que Dobra Peitoral é diferente para Homens e Mulheres (mesmo nome, mas campo de estado diferente)
            // Para simplificar, estamos usando os mesmos campos para o estado, e a lógica que decide qual deles exibir
            // e validar será baseada no sexo. A validação final aqui só verifica se os 7 campos estão preenchidos.
            if (!avaliacao.dobraPeitoral7 || !avaliacao.dobraAbdominal7 || !avaliacao.dobraTriceps7 || !avaliacao.dobraSubescapular7 ||
                !avaliacao.dobraAxilar7 || !avaliacao.dobraSuprailiaca7 || !avaliacao.dobraCoxa7) {
                Toast.show({ type: 'error', text1: 'Preencha todas as dobras para Pollock 7 Dobras.' });
                return false;
            }
        }

        return true;
    };

    const salvarAvaliacao = async () => {
        if (!validarCampos()) return;

        const idPersonal = await AsyncStorage.getItem('uid');

        const avaliacaoData = {
            ...avaliacao,
            idAluno,
            idPersonal,
            criadoEm: new Date(),
        };

        try {
            await criarAvaliacaoFisica(avaliacaoData);
            Toast.show({
                type: 'success',
                text1: 'Sucesso!',
                text2: 'Avaliação adicionada ✅',
            });
            navigation.goBack();
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar avaliação',
                text2: err.message,
            });

        }
    };

    useEffect(() => {
        const pesoNum = parseFloat(avaliacao.peso.replace(',', '.'));
        const alturaNum = parseFloat(avaliacao.altura.replace(',', '.'));
        const idadeNum = parseInt(avaliacao.idade);
        const sexo = avaliacao.sexo;

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
            if (avaliacao.metodoCalculo === 'Pollock3') {
                const dobra1 = toFloat(avaliacao.dobraPollock3_1);
                const dobra2 = toFloat(avaliacao.dobraPollock3_2);
                const dobra3 = toFloat(avaliacao.dobraPollock3_3);

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
            } else if (avaliacao.metodoCalculo === 'Pollock7') {
                const dobraPeitoral7Num = toFloat(avaliacao.dobraPeitoral7);
                const dobraAbdominal7Num = toFloat(avaliacao.dobraAbdominal7);
                const dobraTriceps7Num = toFloat(avaliacao.dobraTriceps7);
                const dobraSubescapular7Num = toFloat(avaliacao.dobraSubescapular7);
                const dobraAxilar7Num = toFloat(avaliacao.dobraAxilar7);
                const dobraSuprailiaca7Num = toFloat(avaliacao.dobraSuprailiaca7);
                const dobraCoxa7Num = toFloat(avaliacao.dobraCoxa7);

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

        setAvaliacao(prev => ({
            ...prev,
            imc: imcCalc !== null && !isNaN(imcCalc) ? imcCalc.toFixed(2).replace('.', ',') : '',
            percentualGordura: percentualGorduraCalc !== null && !isNaN(percentualGorduraCalc) ? percentualGorduraCalc.toFixed(2).replace('.', ',') : '',
            massaGorda: massaGordaCalc !== null && !isNaN(massaGordaCalc) ? massaGordaCalc.toFixed(2).replace('.', ',') : '',
            massaMagra: massaMagraCalc !== null && !isNaN(massaMagraCalc) ? massaMagraCalc.toFixed(2).replace('.', ',') : '',
        }));
    }, [
        avaliacao.peso,
        avaliacao.altura,
        avaliacao.idade,
        avaliacao.sexo,
        avaliacao.metodoCalculo,
        avaliacao.dobraPollock3_1,
        avaliacao.dobraPollock3_2,
        avaliacao.dobraPollock3_3,
        avaliacao.dobraPeitoral7,
        avaliacao.dobraAbdominal7,
        avaliacao.dobraTriceps7,
        avaliacao.dobraSubescapular7,
        avaliacao.dobraAxilar7,
        avaliacao.dobraSuprailiaca7,
        avaliacao.dobraCoxa7,
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
                            <Text className="ml-2 text-colorLight200">Nova Avaliação</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-white text-xl font-semibold">Nova Avaliação Física</Text>
                    </View>

                    <View className='border border-gray-500 p-3 rounded-xl mb-3'>
                        <Text className='text-colorLight300 font-bold text-lg mb-2'>Detalhes Avaliação:</Text>
                        <Input label="Foco da Avaliação" value={avaliacao.focoAvaliacao} onChangeText={text => setAvaliacao(prev => ({ ...prev, focoAvaliacao: text }))} />
                        <Input label="Data da Avaliação (dd/mm/aaaa)" value={avaliacao.data} onChangeText={text => setAvaliacao(prev => ({ ...prev, data: text }))} />
                        <Input label="Próxima Avaliação (dd/mm/aaaa)" value={avaliacao.dataProximaAvaliacao} onChangeText={text => setAvaliacao(prev => ({ ...prev, dataProximaAvaliacao: text }))} />
                    </View>

                    <View className='border border-gray-500 p-3 rounded-xl mb-3'>
                        <Text className='text-colorLight300 font-bold text-lg mb-2'>Dados Pessoais:</Text>
                        <Input label="Nome" value={avaliacao.nome} onChangeText={text => setAvaliacao(prev => ({ ...prev, nome: text }))} />
                        <Input label="Idade" keyboardType="numeric" value={avaliacao.idade} onChangeText={text => setAvaliacao(prev => ({ ...prev, idade: text.replace(/[^0-9]/g, '') }))} />

                        <View className="mb-4">
                            <Text className="text-base text-gray-400 mb-1">Sexo</Text>
                            <View className="border border-colorLight200 bg-colorLight300 rounded-lg overflow-hidden">
                                <Picker
                                    selectedValue={avaliacao.sexo}
                                    onValueChange={(itemValue) => setAvaliacao(prev => ({ ...prev, sexo: itemValue }))}
                                >
                                    <Picker.Item label="Selecione o sexo" value="default" color="gray" enabled={false} />
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
                            <Input label="Peso (kg)" keyboardType="numeric" value={avaliacao.peso} onChangeText={text => setAvaliacao(prev => ({ ...prev, peso: text.replace(',', '.').replace(/[^0-9.]/g, '') }))} className='flex-1' />
                            <Input label="Altura (m)" keyboardType="numeric" value={avaliacao.altura} onChangeText={text => setAvaliacao(prev => ({ ...prev, altura: text.replace(',', '.').replace(/[^0-9.]/g, '') }))} className='flex-1' />
                        </View>
                        <View className='flex-row gap-x-2'>
                            <Input label="Cintura (cm)" keyboardType="numeric" value={avaliacao.cintura} onChangeText={text => setAvaliacao(prev => ({ ...prev, cintura: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                            <Input label="Quadril (cm)" keyboardType="numeric" value={avaliacao.quadril} onChangeText={text => setAvaliacao(prev => ({ ...prev, quadril: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                        </View>
                        <View className='flex-row gap-x-2'>
                            <Input label="Peitoral (cm)" keyboardType="numeric" value={avaliacao.peitoral} onChangeText={text => setAvaliacao(prev => ({ ...prev, peitoral: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                            <Input label="Abdômen (cm)" keyboardType="numeric" value={avaliacao.abdomen} onChangeText={text => setAvaliacao(prev => ({ ...prev, abdomen: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                        </View>
                        <View className='flex-row gap-x-2'>
                            <Input label="Braço Relaxado (cm)" keyboardType="numeric" value={avaliacao.bracoRelaxado} onChangeText={text => setAvaliacao(prev => ({ ...prev, bracoRelaxado: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                            <Input label="Braço Contraído (cm)" keyboardType="numeric" value={avaliacao.bracoContraido} onChangeText={text => setAvaliacao(prev => ({ ...prev, bracoContraido: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                        </View>
                        <View className='flex-row gap-x-2'>
                            <Input label="Antebraço (cm)" keyboardType="numeric" value={avaliacao.antebraco} onChangeText={text => setAvaliacao(prev => ({ ...prev, antebraco: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                            <Input label="Pescoço (cm)" keyboardType="numeric" value={avaliacao.pescoco} onChangeText={text => setAvaliacao(prev => ({ ...prev, pescoco: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                        </View>
                        <View className='flex-row gap-x-2'>
                            <Input label="Coxa (cm)" keyboardType="numeric" value={avaliacao.coxa} onChangeText={text => setAvaliacao(prev => ({ ...prev, coxa: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                            <Input label="Panturrilha (cm)" keyboardType="numeric" value={avaliacao.panturrilha} onChangeText={text => setAvaliacao(prev => ({ ...prev, panturrilha: text.replace(/[^0-9.]/g, '') }))} className='flex-1' />
                        </View>
                    </View>

                    <View className='border border-gray-500 p-3 rounded-xl mb-3'>
                        <View className='flex-row justify-between items-center mb-2'>
                            <Text className="text-base text-gray-400 mb-1">Método de Cálculo</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Icon name="info" size={22} color="#6943FF" />
                            </TouchableOpacity>
                        </View>
                        <View className="bg-colorLight200 rounded-lg overflow-hidden">
                            <Picker
                                selectedValue={avaliacao.metodoCalculo}
                                onValueChange={(itemValue) => setAvaliacao(prev => ({ ...prev, metodoCalculo: itemValue }))}
                            >
                                <Picker.Item label="Selecione um método" value="default" color="gray" enabled={false} />
                                <Picker.Item label="Pollock 3 Dobras" value="Pollock3" />
                                <Picker.Item label="Pollock 7 Dobras" value="Pollock7" />
                            </Picker>
                        </View>

                        {/* Inputs para Pollock 3 Dobras - Condicional pelo Sexo */}
                        {avaliacao.metodoCalculo === 'Pollock3' && (
                            <>
                                <Text className="text-colorLight300 font-semibold my-2">Insira as dobras cutâneas (mm) - Pollock 3 Dobras</Text>
                                {avaliacao.sexo === 'Masculino' ? (
                                    <>
                                        <Input label="Dobra Peitoral" keyboardType="numeric" value={avaliacao.dobraPollock3_1} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraPollock3_1: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Abdominal" keyboardType="numeric" value={avaliacao.dobraPollock3_2} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraPollock3_2: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Coxa" keyboardType="numeric" value={avaliacao.dobraPollock3_3} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraPollock3_3: text.replace(/[^0-9.]/g, '') }))} />
                                    </>
                                ) : avaliacao.sexo === 'Feminino' ? (
                                    <>
                                        <Input label="Dobra Tríceps" keyboardType="numeric" value={avaliacao.dobraPollock3_1} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraPollock3_1: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Supra-ilíaca" keyboardType="numeric" value={avaliacao.dobraPollock3_2} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraPollock3_2: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Coxa" keyboardType="numeric" value={avaliacao.dobraPollock3_3} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraPollock3_3: text.replace(/[^0-9.]/g, '') }))} />
                                    </>
                                ) : (
                                    <Text className="text-gray-400 mb-2">Selecione o sexo para ver as dobras de Pollock 3.</Text>
                                )}
                            </>
                        )}

                        {/* Inputs para Pollock 7 Dobras - Condicional pelo Sexo */}
                        {avaliacao.metodoCalculo === 'Pollock7' && (
                            <>
                                <Text className="text-colorLight300 font-semibold my-2">Insira as dobras cutâneas (mm) - Pollock 7 Dobras</Text>
                                {avaliacao.sexo === 'Masculino' ? (
                                    <>
                                        <Input label="Dobra Peitoral" keyboardType="numeric" value={avaliacao.dobraPeitoral7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraPeitoral7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Abdominal" keyboardType="numeric" value={avaliacao.dobraAbdominal7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraAbdominal7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Tríceps" keyboardType="numeric" value={avaliacao.dobraTriceps7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraTriceps7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Subescapular" keyboardType="numeric" value={avaliacao.dobraSubescapular7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraSubescapular7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Axilar Média" keyboardType="numeric" value={avaliacao.dobraAxilar7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraAxilar7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Supra-ilíaca" keyboardType="numeric" value={avaliacao.dobraSuprailiaca7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraSuprailiaca7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Coxa" keyboardType="numeric" value={avaliacao.dobraCoxa7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraCoxa7: text.replace(/[^0-9.]/g, '') }))} />
                                    </>
                                ) : avaliacao.sexo === 'Feminino' ? (
                                    <>
                                        <Input label="Dobra Peitoral" keyboardType="numeric" value={avaliacao.dobraPeitoral7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraPeitoral7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Abdominal" keyboardType="numeric" value={avaliacao.dobraAbdominal7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraAbdominal7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Tríceps" keyboardType="numeric" value={avaliacao.dobraTriceps7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraTriceps7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Subescapular" keyboardType="numeric" value={avaliacao.dobraSubescapular7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraSubescapular7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Axilar Média" keyboardType="numeric" value={avaliacao.dobraAxilar7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraAxilar7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Supra-ilíaca" keyboardType="numeric" value={avaliacao.dobraSuprailiaca7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraSuprailiaca7: text.replace(/[^0-9.]/g, '') }))} />
                                        <Input label="Dobra Coxa" keyboardType="numeric" value={avaliacao.dobraCoxa7} onChangeText={text => setAvaliacao(prev => ({ ...prev, dobraCoxa7: text.replace(/[^0-9.]/g, '') }))} />
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
                        <Input label="IMC" value={avaliacao.imc} editable={false} />
                        <Input label="Percentual de Gordura (%)" value={avaliacao.percentualGordura} editable={false} />
                        <Input label="Massa Gorda (kg)" value={avaliacao.massaGorda} editable={false} />
                        <Input label="Massa Magra (kg)" value={avaliacao.massaMagra} editable={false} />
                    </View>

                    <TouchableOpacity
                        className="bg-colorViolet py-3 rounded-full my-4"
                        onPress={salvarAvaliacao}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#E4E4E7" /> 
                        ) : (
                            <Text className="text-center text-colorLight200 font-bold text-lg">Salvar Avaliação</Text>
                        )}
                    </TouchableOpacity>

                    <Modal visible={modalVisible} animationType="fade" transparent>
                        <View className="flex-1 bg-black/80 justify-center items-center px-6">
                            <View className="bg-colorDark100 rounded-2xl w-full p-6 max-h-[90%]">
                                <Text className="text-colorLight200 text-xl font-bold mb-4">Métodos de Cálculos:</Text>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text className="text-colorLight300 mb-4">
                                        Métodos de cálculo baseados em dobras cutâneas para estimar percentual de gordura corporal.
                                    </Text>

                                    <Text className="text-colorLight200 font-bold mb-1">Pollock 3 Dobras:</Text>
                                    <Text className="text-gray-300 mb-[2px]">✔️ Homens: Peitoral, Abdominal e Coxa.</Text>
                                    <Text className="text-gray-300">✔️ Mulheres: Tríceps, Supra-ilíaca e Coxa.</Text>

                                    <Text className="text-colorLight300 mt-2 mb-1 italic">Fórmulas:</Text>
                                    <Text className="text-gray-300 text-sm mb-1">
                                        Homens: 1.10938 - 0.0008267 × soma das 3 dobras + 0.0000016 × soma² - 0.0002574 × idade
                                    </Text>
                                    <Text className="text-gray-300 text-sm mb-3">
                                        Mulheres: 1.0994921 - 0.0009929 × soma das 3 dobras + 0.0000023 × soma² - 0.0001392 × idade
                                    </Text>

                                    <Text className="text-colorLight200 font-bold mb-1">Pollock 7 Dobras:</Text>
                                    <Text className="text-gray-300 mb-[2px]">
                                        ✔️ Homens: Peitoral, Abdominal, Tríceps, Subescapular, Axilar Média, Supra-ilíaca e Coxa.
                                    </Text>
                                    <Text className="text-gray-300">
                                        ✔️ Mulheres: Peitoral, Abdominal, Tríceps, Subescapular, Axilar Média, Supra-ilíaca e Coxa.
                                    </Text>

                                    <Text className="text-colorLight300 mt-2 mb-1 italic">Fórmulas:</Text>
                                    <Text className="text-gray-300 text-sm mb-1">
                                        Homens: 1.112 - 0.00043499 × soma das 7 dobras + 0.00000055 × soma² - 0.00028826 × idade
                                    </Text>
                                    <Text className="text-gray-300 text-sm mb-3">
                                        Mulheres: 1.097 - 0.00046971 × soma das 7 dobras + 0.00000056 × soma² - 0.00012828 × idade
                                    </Text>

                                    <Text className="text-colorLight200 font-bold mt-2 mb-1">Cálculo do % de Gordura Corporal:</Text>
                                    <Text className="text-gray-300 text-sm mb-3">
                                        % Gordura = (495 ÷ Densidade Corporal) - 450
                                    </Text>

                                    <TouchableOpacity
                                        className="bg-colorViolet py-2 rounded-lg mt-4"
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text className="text-center text-colorLight200 font-bold">Fechar</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};