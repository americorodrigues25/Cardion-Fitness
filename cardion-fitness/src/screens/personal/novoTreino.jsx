import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import Toast from 'react-native-toast-message';

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import { useCreateTreino } from '~/hook/crud/treino/useCreateTreino';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NovoTreino() {
    const navigation = useNavigation();
    const route = useRoute();
    const [formError, setFormError] = useState('');
    const idAluno = route.params?.idAluno;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
    const [exercicioIndexParaExcluir, setExercicioIndexParaExcluir] = useState(null);

    const [novoTreino, setNovoTreino] = useState({
        nome: '',
        tipo: '',
        dia: '',
        sessoes: '',
    });

    const { criarTreinoAluno, loading, error } = useCreateTreino();

    const salvarTreino = async () => {

        if (exercicios.length === 0) {
            setFormError('Adicione pelo menos um exercicio ao treino. ❌');
            return;
        }

        if (!idAluno) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar treino',
                text2: 'ID do aluno não encontrado.',
            });
            return;
        }

        const idPersonal = await AsyncStorage.getItem("uid")

        const treinoData = {
            idPersonal: idPersonal,
            idAluno: idAluno,
            nome: novoTreino.nome,
            tipo: novoTreino.tipo,
            dia: novoTreino.dia,
            sessoes: novoTreino.sessoes,
            exercicios: exercicios,
            criadoEm: new Date()
        };

        try {
            const success = await criarTreinoAluno(idAluno, treinoData);

            if (success) {
                if (route.params?.onSalvar) {
                    route.params.onSalvar(treinoData);
                }

                Toast.show({
                    type: 'success',
                    text1: 'Sucesso !',
                    text2: 'Treino adicionado. ✅'
                });

                navigation.goBack();
            }
        } catch (err) {
            
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar treino',
                text2: err.message,
            });
        }
    };


    const [exercicios, setExercicios] = useState([]);
    const [novoExercicio, setNovoExercicio] = useState({
        nome: '',
        carga: '',
        series: '',
        repeticoes: '',
        descanso: '',
        observacao: '',
    });

    const adicionarExercicio = () => {
        const { nome, carga, series, repeticoes, descanso, observacao } = novoExercicio;

        if (
            nome.trim() === '' ||
            carga.trim() === '' ||
            series.trim() === '' ||
            repeticoes.trim() === '' ||
            descanso.trim() === ''
        ) {
            setFormError('Preencha todos os campos para adicionar um exercício.');
            return;
        }
        setFormError('');
        setExercicios([...exercicios, novoExercicio]);
        setNovoExercicio({ nome: '', carga: '', series: '', repeticoes: '', descanso: '', observacao: '' });
        setModalVisible(false);

        Toast.show({
            type: 'success',
            text1: 'Exercício adicionado 🎉',
            text2: `${nome} foi adicionado ao treino.`,
        });
    };

    const deletarExercicio = (index) => {
        setExercicioIndexParaExcluir(index);
        setModalDeleteVisible(true);
    };

    const confirmarRemocao = () => {
        const novosExercicios = [...exercicios];
        novosExercicios.splice(exercicioIndexParaExcluir, 1);
        setExercicios(novosExercicios);

        Toast.show({
            type: 'success',
            text1: 'Exercício removido',
            text2: 'O exercício foi removido do treino.',
        });

        setModalVisible(false);
        setExercicioIndexParaExcluir(null);
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="pt-5 px-5">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Criar novo treino</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 bg-colorBackground py-10 px-10">
                        <Text className="text-lg font-bold text-colorLight200 mb-4">Novo Treino</Text>

                        <View className="gap-y-5">

                            <View className=''>
                                <Text className="text-colorLight200 text-lg mb-1">Nome do treino</Text>
                                <View className="border border-gray-500 rounded-lg px-3">
                                    <Picker
                                        selectedValue={novoTreino.nome}
                                        onValueChange={(value) => setNovoTreino({ ...novoTreino, nome: value })}
                                        style={{ color: '#9ca3af' }}
                                        dropdownIconColor="#9ca3af"
                                    >
                                        <Picker.Item label="Selecione o nome do treino" value="default" enabled={false} color="#9ca3af" />
                                        {[
                                            'Treino A',
                                            'Treino B',
                                            'Treino C',
                                            'Treino D',
                                            'Treino E',
                                            'Treino F',
                                            'Treino G',
                                        ].map((nome) => (
                                            <Picker.Item key={nome} label={nome} value={nome} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>


                            <View>
                                <Text className="text-colorLight200 text-lg mb-1">Grupo muscular</Text>
                                <TextInput
                                    placeholder="Ex: Peito"
                                    placeholderTextColor="#9CA3AF"
                                    className="border border-gray-500 px-3 py-5 rounded-lg text-colorLight200"
                                    value={novoTreino.tipo}
                                    onChangeText={(text) => setNovoTreino({ ...novoTreino, tipo: text })}
                                />
                            </View>

                            <View>
                                <Text className="text-colorLight200 text-lg mb-1">Dia da semana</Text>
                                <View className="border border-gray-500 rounded-lg px-3">
                                    <Picker
                                        selectedValue={novoTreino.dia}
                                        onValueChange={(value) => setNovoTreino({ ...novoTreino, dia: value })}
                                        style={{ color: '#9ca3af' }}
                                        dropdownIconColor="#9ca3af"
                                    >
                                        <Picker.Item label="Selecione o dia da semana" value="default" enabled={false} />
                                        {[
                                            'Segunda-feira',
                                            'Terça-feira',
                                            'Quarta-feira',
                                            'Quinta-feira',
                                            'Sexta-feira',
                                            'Sábado',
                                            'Domingo',
                                        ].map((dia) => (
                                            <Picker.Item key={dia} label={dia} value={dia} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View>
                                <Text className="text-colorLight200 text-lg mb-1">Quantidade de sessões</Text>
                                <TextInput
                                    placeholder="Ex: 20"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType='numeric'
                                    className="border border-gray-500 px-3 py-5 rounded-lg text-colorLight200"
                                    value={novoTreino.sessoes}
                                    onChangeText={(text) => setNovoTreino({ ...novoTreino, sessoes: text })}
                                />
                            </View>

                            {/* aq vai aparece os exercicios que o personal criar */}
                            {exercicios.map((ex, index) => (
                                <View key={index} className="border border-gray-700 rounded-xl">


                                    <View className="flex-row justify-between items-center px-5 pt-5">
                                        <Text className="text-colorLight200 text-lg font-bold">{ex.nome}</Text>

                                        <View className="flex-row gap-5">
                                            <TouchableOpacity onPress={() => deletarExercicio(index)}>
                                                <Feather name="trash-2" size={20} color="#E4E4E7" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                    <View className="flex-row justify-between p-5">
                                        <View>
                                            <Text className="text-gray-500">Carga</Text>
                                            <Text className="text-colorLight200">{ex.carga} Kg</Text>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500">Séries</Text>
                                            <Text className="text-colorLight200">{ex.series} X {ex.repeticoes}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500">Descanso</Text>
                                            <Text className="text-colorLight200">{ex.descanso} s</Text>
                                        </View>
                                    </View>
                                    <View className='px-5 pb-5'>
                                        <Text className="text-gray-500">Observações</Text>
                                        <Text className="text-colorLight200">{ex.observacao}</Text>
                                    </View>
                                </View>
                            ))}

                            {formError !== '' && (
                                <Text className="text-red-500 text-sm mt-1 text-center">{formError}</Text>
                            )}


                            <TouchableOpacity
                                onPress={() => {
                                    if (!novoTreino.nome || !novoTreino.tipo || !novoTreino.dia || !novoTreino.sessoes) {
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Campos obrigatórios',
                                            text2: 'Preencha todos os campos para adicionar um exercicio.',
                                        });
                                        return;
                                    }
                                    setModalVisible(true);
                                }}
                                className="flex-row items-center bg-colorViolet rounded-full py-3 justify-center"
                            >
                                <Entypo name="plus" size={20} color="#E4E4E7" />
                                <Text className="text-colorLight200 text-base font-semibold">
                                    Adicionar exercício
                                </Text>
                            </TouchableOpacity>


                        </View>

                        <TouchableOpacity onPress={salvarTreino} className="py-4 rounded-lg">
                            <Text className="text-center text-colorViolet font-bold text-lg">Salvar treino</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(false);
                            setFormError('');
                            setNovoExercicio({ nome: '', carga: '', series: '', repeticoes: '', descanso: '', observacao: '' });
                        }}
                    >
                        <View className="flex-1 bg-colorBackground w-full h-full">
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                className="flex-1"
                            >
                                <ScrollView
                                    contentContainerStyle={{ padding: 24 }}
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Text className="text-3xl font-bold text-white text-center mb-6">
                                        Adicionar Exercício
                                    </Text>

                                    <View className="gap-y-3">
                                        {[
                                            { label: 'Nome do exercício', key: 'nome' },
                                            { label: 'Carga', key: 'carga' },
                                            { label: 'Séries', key: 'series' },
                                            { label: 'Repetições', key: 'repeticoes' },
                                            { label: 'Descanso (segundos)', key: 'descanso' },
                                            { label: 'Observações (Opcional)', key: 'observacao' },
                                        ].map(({ label, key }) => (
                                            <View key={key}>
                                                <Text className="text-colorLight200 mb-1 font-semibold">{label}</Text>
                                                <TextInput
                                                    className="border border-colorDark100 px-5 py-5 rounded-lg text-colorLight200 bg-colorInputs"
                                                    placeholderTextColor="#D4D4D8"
                                                    keyboardType={['carga', 'series', 'repeticoes', 'descanso'].includes(key) ? 'numeric' : 'default'}
                                                    value={novoExercicio[key]}
                                                    onChangeText={(text) => setNovoExercicio({ ...novoExercicio, [key]: text })}
                                                />
                                            </View>
                                        ))}
                                    </View>

                                    {formError !== '' && (
                                        <Text className="text-red-500 text-center text-sm mt-4">{formError}</Text>
                                    )}

                                    <TouchableOpacity
                                        onPress={adicionarExercicio}
                                        className="bg-colorViolet py-4 rounded-full mt-8"
                                    >
                                        <Text className="text-center text-white font-bold text-lg">Adicionar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setFormError('');
                                            setNovoExercicio({ nome: '', carga: '', series: '', repeticoes: '', descanso: '', observacao: '' });
                                            setModalVisible(false);
                                        }}
                                        className="py-3 mt-4"
                                    >
                                        <Text className="text-center text-colorLight200 text-base underline font-bold">Cancelar</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </View>
                    </Modal>


                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalDeleteVisible}
                        onRequestClose={() => setModalDeleteVisible(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/80 px-6">
                            <View className="bg-colorDark100 rounded-2xl w-full p-6">
                                <Text className='text-colorLight200 text-lg font-bold mb-4'>
                                    Tem certeza que deseja remover este exercício?
                                </Text>

                                <View className="flex-row justify-end gap-x-10">
                                    <TouchableOpacity
                                        onPress={() => setModalDeleteVisible(false)}
                                        className="text-colorViolet text-lg font-semibold"
                                    >
                                        <Text className="text-colorViolet text-lg font-semibold">Cancelar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            confirmarRemocao();
                                            setModalDeleteVisible(false);
                                        }}

                                    >
                                        <Text className="text-red-600 font-semibold text-lg">Remover</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}
