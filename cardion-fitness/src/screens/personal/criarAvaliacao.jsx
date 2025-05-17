import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCreateAvaliacaoFisica } from '~/hook/crud/avaliacaoFisica/useCreateAvaliacaoFisica';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

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
        />
    </View>
);

export default function CriarAvaliacao() {
    const route = useRoute();
    const { idAluno } = route.params || {};
    console.log('idAluno:', idAluno);

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
            console.log(err);
        }
    };

    useEffect(() => {
        const pesoNum = parseFloat(avaliacao.peso.replace(',', '.'));
        const alturaNum = parseFloat(avaliacao.altura.replace(',', '.'));
        const idadeNum = parseInt(avaliacao.idade);
        const cinturaNum = parseFloat(avaliacao.cintura.replace(',', '.'));
        const quadrilNum = parseFloat(avaliacao.quadril.replace(',', '.'));
        const pescocoNum = parseFloat(avaliacao.pescoco.replace(',', '.'));

        if (pesoNum > 0 && alturaNum > 0 && idadeNum > 0 && (avaliacao.sexo === 'Masculino' || avaliacao.sexo === 'Feminino')) {
            const imcCalc = pesoNum / (alturaNum * alturaNum);
            const imc = imcCalc.toFixed(2);

            let percGorduraCalc = 0;
            if (avaliacao.metodoCalculo === 'IMC') {
                const sexoNum = avaliacao.sexo === 'Masculino' ? 1 : 0;
                percGorduraCalc = 1.2 * imcCalc + 0.23 * idadeNum - 10.8 * sexoNum - 5.4;
            } else if (avaliacao.metodoCalculo === 'NAVY') {
                if (avaliacao.sexo === 'Masculino' && cinturaNum > 0 && pescocoNum > 0) {
                    percGorduraCalc = 86.010 * Math.log10(cinturaNum - pescocoNum) - 70.041 * Math.log10(alturaNum * 100) + 36.76;
                } else if (avaliacao.sexo === 'Feminino' && cinturaNum > 0 && pescocoNum > 0 && quadrilNum > 0) {
                    percGorduraCalc = 163.205 * Math.log10(cinturaNum + quadrilNum - pescocoNum) - 97.684 * Math.log10(alturaNum * 100) - 78.387;
                }
            }

            const percentualGordura = Math.max(0, percGorduraCalc).toFixed(2);
            const massaGorda = (pesoNum * (percentualGordura / 100)).toFixed(2);
            const massaMagra = (pesoNum - pesoNum * (percentualGordura / 100)).toFixed(2);

            setAvaliacao((prev) => ({
                ...prev,
                imc,
                percentualGordura,
                massaGorda,
                massaMagra,
            }));
        } else {
            setAvaliacao((prev) => ({
                ...prev,
                imc: '',
                percentualGordura: '',
                massaGorda: '',
                massaMagra: '',
            }));
        }
    }, [avaliacao.peso, avaliacao.altura, avaliacao.idade, avaliacao.sexo, avaliacao.metodoCalculo, avaliacao.cintura, avaliacao.quadril, avaliacao.pescoco]);

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
        <SafeAreaView edges={["top"]} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View className="pt-5 px-5">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Criar avaliação</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='px-4 py-5'>
                        <Text className="text-2xl font-bold mb-6 text-colorLight200 text-center">Avaliação Física</Text>

                        <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
                            <Text className="text-lg font-semibold mb-2 text-colorLight200">Detalhes</Text>
                            <View className="flex-row justify-between gap-x-3">
                                <Input className='flex-1' label="Objetivo da Avaliação" value={avaliacao.focoAvaliacao} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, focoAvaliacao: text }))} />
                            </View>
                            <View className="flex-row justify-between gap-x-3">
                                <Input
                                    className="flex-1"
                                    label="Data Avaliação"
                                    keyboardType="numeric"
                                    value={avaliacao.data}
                                    onChangeText={(text) => {
                                        const dataFormatada = formatarData(text);
                                        setAvaliacao((prev) => ({ ...prev, data: dataFormatada }));
                                    }}
                                />
                                <Input
                                    className="flex-1"
                                    label="Proxima Avaliação"
                                    keyboardType="numeric"
                                    value={avaliacao.dataProximaAvaliacao}
                                    onChangeText={(text) => {
                                        const dataFormatada = formatarData(text);
                                        setAvaliacao((prev) => ({ ...prev, dataProximaAvaliacao: dataFormatada }));
                                    }}
                                />

                            </View>

                        </View>

                        <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
                            <Text className="text-lg font-semibold mb-2 text-colorLight200">Dados Pessoais</Text>
                            <View className="flex-row justify-between gap-x-3">
                                <Input className='flex-1' label="Nome" value={avaliacao.nome} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, nome: text }))} />
                                <Input className='flex-1' label="Idade" keyboardType="numeric" value={avaliacao.idade} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, idade: text }))} />
                            </View>


                            <View className="mb-3">
                                <Text className="text-base text-gray-400 mb-1">Sexo</Text>
                                <View className="rounded-lg bg-colorLight200">
                                    <Picker
                                        selectedValue={avaliacao.sexo}
                                        onValueChange={(itemValue) => setAvaliacao((prev) => ({ ...prev, sexo: itemValue }))}
                                    >
                                        <Picker.Item label="Escolha um gênero" value="default" color="#9ca3af" enabled={false} />
                                        <Picker.Item label="Masculino" value="Masculino" />
                                        <Picker.Item label="Feminino" value="Feminino" />
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
                            <Text className="text-lg font-semibold mb-2 text-colorLight200">Perímetros</Text>
                            <View className="flex-row justify-between gap-x-3">
                                <Input className='flex-1' label="Cintura (cm)" keyboardType="numeric" value={avaliacao.cintura} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, cintura: text }))} />
                                <Input className='flex-1' label="Quadril (cm)" keyboardType="numeric" value={avaliacao.quadril} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, quadril: text }))} />
                            </View>

                            <View className="flex-row justify-between gap-x-3">
                                <Input className='flex-1' label="Peitoral (cm)" keyboardType="numeric" value={avaliacao.peitoral} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, peitoral: text }))} />
                                <Input className='flex-1' label="Abdômen (cm)" keyboardType="numeric" value={avaliacao.abdomen} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, abdomen: text }))} />
                            </View>

                            <View className="flex-row justify-between gap-x-3">
                                <Input className='flex-1' label="Braço Relaxado (cm)" keyboardType="numeric" value={avaliacao.bracoRelaxado} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, bracoRelaxado: text }))} />
                                <Input className='flex-1' label="Braço Contraído (cm)" keyboardType="numeric" value={avaliacao.bracoContraido} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, bracoContraido: text }))} />
                            </View>

                            <View className="flex-row justify-between gap-x-3">
                                <Input className='flex-1' label="Antebraço (cm)" keyboardType="numeric" value={avaliacao.antebraco} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, antebraco: text }))} />
                                <Input className='flex-1' label="Pescoço (cm)" keyboardType="numeric" value={avaliacao.pescoco} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, pescoco: text }))} />
                            </View>

                            <View className="flex-row justify-between gap-x-3">
                                <Input className='flex-1' label="Coxa (cm)" keyboardType="numeric" value={avaliacao.coxa} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, coxa: text }))} />
                                <Input className='flex-1' label="Panturrilha (cm)" keyboardType="numeric" value={avaliacao.panturrilha} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, panturrilha: text }))} />
                            </View>
                        </View>

                        <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
                            <View className="flex-row justify-between">
                                <Text className="text-lg font-semibold mb-2 text-colorLight200">Método de Cálculo</Text>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Icon name="info-outline" size={20} color="#E4E4E7" />
                                </TouchableOpacity>
                            </View>
                            <View className="rounded-lg bg-colorLight200">
                                <Picker
                                    selectedValue={avaliacao.metodoCalculo}
                                    onValueChange={(itemValue) => setAvaliacao((prev) => ({ ...prev, metodoCalculo: itemValue }))}
                                >
                                    <Picker.Item label="Escolha o método de calculo" value="default" color="#9ca3af" enabled={false} />
                                    <Picker.Item label="IMC (Deurenberg)" value="IMC" />
                                    <Picker.Item label="Marinha (US Navy)" value="NAVY" />
                                </Picker>
                            </View>
                        </View>

                        <View className="bg-colorInputs px-3 py-4 mb-4 rounded-xl border border-colorDark100">
                            <Text className="text-lg font-semibold mb-2 text-colorLight200">Resultados</Text>

                            <Input className='flex-1' label="Peso (kg)" keyboardType="numeric" value={avaliacao.peso} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, peso: text }))} />
                            <Input className='flex-1' label="Altura (m)" keyboardType="numeric" value={avaliacao.altura} onChangeText={(text) => setAvaliacao((prev) => ({ ...prev, altura: text }))} />
                            <Input className='flex-1' label="IMC" keyboardType="numeric" editable={false} value={avaliacao.imc} />
                            <Input className='flex-1' label="% Gordura" keyboardType="numeric" editable={false} value={avaliacao.percentualGordura} />
                            <Input className='flex-1' label="Massa Gorda (kg)" keyboardType="numeric" editable={false} value={avaliacao.massaGorda} />
                            <Input className='flex-1' label="Massa Magra (kg)" keyboardType="numeric" editable={false} value={avaliacao.massaMagra} />
                        </View>

                        <View className='px-10 py-5'>
                            <TouchableOpacity onPress={salvarAvaliacao} disabled={loading} className="bg-colorViolet py-3 rounded-full">
                                <Text className="text-colorLight200 text-center text-lg font-semibold">
                                    {loading ? 'Salvando...' : 'Salvar Avaliação'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Modal
                        animationType="fade"
                        transparent
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/80 px-4">
                            <View className="bg-colorDark100 rounded-2xl p-6 w-full max-w-lg shadow-lg">
                                <Text className="text-xl font-bold text-colorViolet mb-4">
                                    Métodos de Cálculo
                                </Text>

                                <ScrollView className="max-h-[360px] mb-4" showsVerticalScrollIndicator={false}>
                                    <Text className="text-lg font-bold text-colorLight300 mb-1">
                                        1. IMC - Fórmula de Deurenberg
                                    </Text>
                                    <Text className="text-base text-colorLight200 mb-4">
                                        Estima o percentual de gordura corporal usando IMC, idade e sexo.
                                        Simples e prático, mas menos preciso para pessoas com alta massa muscular.
                                    </Text>

                                    <Text className="font-bold text-colorLight200">Fórmula:</Text>
                                    <Text className='text-base text-colorLight200 mb-4'>Gordura corporal (%) = (1,20 × IMC) + (0,23 × idade) − (10,8 × sexo) − 5,4{'\n'}
                                        (sexo: 1 para homem, 0 para mulher)
                                    </Text>

                                    <Text className="text-base text-colorLight200 mb-2">
                                        <Text className="font-bold">Percentual de erro estimado:</Text> ±3% a ±5%
                                    </Text>
                                    <Text className="text-sm text-gray-400 mb-4">
                                        Fonte: Deurenberg et al., 1991 – British Journal of Nutrition
                                    </Text>


                                    <Text className="text-lg font-bold text-colorLight300 mb-1">
                                        2. Método da Marinha dos EUA (U.S. Navy)
                                    </Text>
                                    <Text className="text-base text-colorLight200 mb-2">
                                        Utiliza medidas corporais (pescoço, cintura, quadril e altura) para estimar o percentual de gordura. Mais preciso que o método IMC.
                                    </Text>
                                    <Text className="text-base text-colorLight200 mb-2">
                                        <Text className="font-bold">Fórmulas:</Text>{'\n'}
                                        <Text className="font-bold">Homens:</Text>{' '}
                                        495 / [1,0324 − 0,19077 × log₁₀(cintura − pescoço) + 0,15456 × log₁₀(altura)] − 450{'\n\n'}
                                        <Text className="font-bold">Mulheres:</Text>{' '}
                                        495 / [1,29579 − 0,35004 × log₁₀(cintura + quadril − pescoço) + 0,22100 × log₁₀(altura)] − 450
                                    </Text>
                                    <Text className="text-base text-colorLight200 mb-2">
                                        Todas as medidas devem estar em centímetros.
                                    </Text>
                                    <Text className="text-base text-colorLight200 mb-2">
                                        <Text className="font-semibold">Percentual de erro estimado:</Text> ±3% a ±4%
                                    </Text>
                                    <Text className="text-sm text-gray-400 mb-4">
                                        Fonte: U.S. Navy – Body Composition Assessment Guide (BCA)
                                    </Text>
                                </ScrollView>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    className="bg-colorViolet py-3 rounded-xl items-center mt-4"
                                >
                                    <Text className="text-colorLight200 font-bold text-base">Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
