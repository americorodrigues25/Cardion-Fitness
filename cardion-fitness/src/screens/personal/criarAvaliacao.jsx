import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const Input = ({ label, keyboardType = 'default', className = '', value, onChangeText, editable = true }) => (
    <View className={`mb-3 ${className}`}>
        <Text className="text-base text-gray-700 mb-1">{label}</Text>
        <TextInput
            className={`bg-${editable ? 'white' : 'gray-200'} border border-gray-300 rounded-lg px-4 py-2 w-full`}
            placeholder={label}
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
        />
    </View>
);

export default function CriarAvaliacao() {
    const navigation = useNavigation();

    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [idade, setIdade] = useState('');
    const [sexo, setSexo] = useState('default');
    const [metodoCalculo, setMetodoCalculo] = useState('imc');

    const [cintura, setCintura] = useState('');
    const [quadril, setQuadril] = useState('');
    const [pescoco, setPescoco] = useState('');

    const [imc, setImc] = useState('');
    const [percentualGordura, setPercentualGordura] = useState('');
    const [massaMagra, setMassaMagra] = useState('');
    const [massaGorda, setMassaGorda] = useState('');

    const [modalVisible, setModalVisible] = useState(false);

    const handleSalvar = () => {
        Toast.show({
            type: 'success',
            text1: 'Sucesso!',
            text2: 'Avaliação adicionada. ✅'
        });
        navigation.goBack();
    };

    useEffect(() => {
        const pesoNum = parseFloat(peso.replace(',', '.'));
        const alturaNum = parseFloat(altura.replace(',', '.'));
        const idadeNum = parseInt(idade);
        const cinturaNum = parseFloat(cintura.replace(',', '.'));
        const quadrilNum = parseFloat(quadril.replace(',', '.'));
        const pescocoNum = parseFloat(pescoco.replace(',', '.'));

        if (pesoNum > 0 && alturaNum > 0 && idadeNum > 0 && (sexo === 'masculino' || sexo === 'feminino')) {
            const imcCalc = pesoNum / (alturaNum * alturaNum);
            setImc(imcCalc.toFixed(2));

            let percGorduraCalc = 0;

            if (metodoCalculo === 'imc') {
                const sexoNum = sexo === 'masculino' ? 1 : 0;
                percGorduraCalc = 1.2 * imcCalc + 0.23 * idadeNum - 10.8 * sexoNum - 5.4;
            }

            if (metodoCalculo === 'navy') {
                if (sexo === 'masculino' && cinturaNum > 0 && pescocoNum > 0) {
                    percGorduraCalc = 86.010 * Math.log10(cinturaNum - pescocoNum) - 70.041 * Math.log10(alturaNum * 100) + 36.76;
                }
                if (sexo === 'feminino' && cinturaNum > 0 && pescocoNum > 0 && quadrilNum > 0) {
                    percGorduraCalc = 163.205 * Math.log10(cinturaNum + quadrilNum - pescocoNum) - 97.684 * Math.log10(alturaNum * 100) - 78.387;
                }
            }

            const percGorduraFinal = Math.max(0, percGorduraCalc);
            setPercentualGordura(percGorduraFinal.toFixed(2));

            const massaGordaCalc = pesoNum * (percGorduraFinal / 100);
            const massaMagraCalc = pesoNum - massaGordaCalc;

            setMassaGorda(massaGordaCalc.toFixed(2));
            setMassaMagra(massaMagraCalc.toFixed(2));
        } else {
            setImc('');
            setPercentualGordura('');
            setMassaGorda('');
            setMassaMagra('');
        }
    }, [peso, altura, sexo, idade, metodoCalculo, cintura, quadril, pescoco]);

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
                        <Text className="text-3xl font-bold mb-6 text-colorLight200 text-center">Avaliação Física</Text>

                        <View className="bg-gray-100 px-3 py-4 mb-4 rounded-xl border border-gray-200 shadow-sm">
                            <Text className="text-lg font-semibold mb-2">Dados pessoais</Text>
                            <View className="flex-row justify-between gap-x-3">
                                <Input label="Nome" className="flex-1" />
                                <Input label="Idade" keyboardType="numeric" className="flex-1" value={idade} onChangeText={setIdade} />
                            </View>

                            <View className="mb-3">
                                <Text className="text-base text-gray-700 mb-1">Sexo</Text>
                                <View className="border border-gray-300 rounded-lg bg-white">
                                    <Picker
                                        selectedValue={sexo}
                                        onValueChange={(itemValue) => setSexo(itemValue)}
                                    >
                                        <Picker.Item label="Escolha um gênero" value="default" color="#9ca3af" enabled={false} />
                                        <Picker.Item label="Masculino" value="masculino" />
                                        <Picker.Item label="Feminino" value="feminino" />
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <View className="bg-gray-100 px-3 py-4 mb-4 rounded-xl border border-gray-200 shadow-sm">
                            <Text className="text-lg font-semibold mb-2">Perímetros</Text>
                            <View className="flex-row justify-between gap-x-3">
                                <Input label="Cintura (cm)" keyboardType="numeric" className="flex-1" value={cintura} onChangeText={setCintura} />
                                <Input label="Quadril (cm)" keyboardType="numeric" className="flex-1" value={quadril} onChangeText={setQuadril} />
                            </View>

                            <View className="flex-row justify-between gap-x-3">
                                <Input label="Peitoral (cm)" keyboardType="numeric" className="flex-1" />
                                <Input label="Abdômen (cm)" keyboardType="numeric" className="flex-1" />
                            </View>

                            <View className="flex-row justify-between gap-x-3">
                                <Input label="Braço Relaxado (cm)" keyboardType="numeric" className="flex-1" />
                                <Input label="Braço Contraido (cm)" keyboardType="numeric" className="flex-1" />
                            </View>

                            <View className="flex-row justify-between gap-x-3">
                                <Input label="Antebraço (cm)" keyboardType="numeric" className="flex-1" />
                                <Input label="Pescoço (cm)" keyboardType="numeric" className="flex-1" value={pescoco} onChangeText={setPescoco} />
                            </View>

                            <View className="flex-row justify-between gap-x-3">
                                <Input label="Coxa (cm)" keyboardType="numeric" className="flex-1" />
                                <Input label="Panturrilha (cm)" keyboardType="numeric" className="flex-1" />
                            </View>
                        </View>

                        <View className="bg-gray-100 px-3 py-4 mb-4 rounded-xl border border-gray-200 shadow-sm">
                            <View className="flex-row justify-between">
                                <Text className="text-lg font-semibold mb-2">Método de Cálculo</Text>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Icon name="info-outline" size={20} color="#6943FF" />
                                </TouchableOpacity>
                            </View>
                            <View className="border border-gray-300 rounded-lg bg-white">
                                <Picker
                                    selectedValue={metodoCalculo}
                                    onValueChange={(itemValue) => setMetodoCalculo(itemValue)}
                                >
                                    <Picker.Item label="IMC (Deurenberg)" value="imc" />
                                    <Picker.Item label="Marinha dos EUA" value="navy" />
                                </Picker>
                            </View>
                        </View>

                        <View className="bg-gray-100 px-3 py-4 mb-6 rounded-xl border border-gray-200 shadow-sm">
                            <Text className="text-lg font-semibold mb-2">Resultados</Text>

                            <Input label="Peso (kg)" keyboardType="numeric" value={peso} onChangeText={setPeso} />
                            <Input label="Altura (m)" keyboardType="numeric" value={altura} onChangeText={setAltura} />
                            <Input label="IMC" value={imc} keyboardType="numeric" editable={false} />
                            <Input label="Percentual de gordura (%)" value={percentualGordura} keyboardType="numeric" editable={false} />
                            <Input label="Massa magra (kg)" value={massaMagra} keyboardType="numeric" editable={false} />
                            <Input label="Massa gorda (kg)" value={massaGorda} keyboardType="numeric" editable={false} />
                        </View>

                        <TouchableOpacity onPress={handleSalvar} className="bg-colorViolet rounded-full py-3">
                            <Text className="text-white text-center text-lg font-bold">Salvar</Text>
                        </TouchableOpacity>
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
                                    {/* Método 1 - IMC */}
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
