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
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import Toast from 'react-native-toast-message';

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import { useCreateTreino } from '~/hook/crud/treino/useCreateTreino';

export default function NovoTreino() {
    const navigation = useNavigation();
    const route = useRoute();
    const idAluno = route.params?.idAluno;
    const [modalVisible, setModalVisible] = useState(false);

    const [novoTreino, setNovoTreino] = useState({
        nome: '',
        tipo: '',
        dia: 'Segunda-feira',
        sessoes: '',
    });

    const { criarTreinoAluno, loading, error } = useCreateTreino();

    const salvarTreino = async () => {
        console.log("idAluno:", idAluno);

        if (!idAluno) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao salvar treino',
                text2: 'ID do aluno não encontrado.',
            });
            return;
        }

        const treinoData = {
            idAluno: idAluno,
            nome: novoTreino.nome,
            tipo: novoTreino.tipo,
            dia: novoTreino.dia,
            sessoes: novoTreino.sessoes,
            exercicios: [],
        };

        try {
            const success = await criarTreinoAluno(idAluno, treinoData);

            if (success) {
                if (route.params?.onSalvar) {
                    route.params.onSalvar(treinoData);
                }

                navigation.goBack();
            }
        } catch (err) {
            console.log("Erro ao salvar treino:", err);
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
        series: '',
        repeticoes: '',
        descanso: '',
    });

    const adicionarExercicio = () => {
        const { nome, series, repeticoes, descanso } = novoExercicio;

        if (!nome || !series || !repeticoes || !descanso) {
            Alert.alert('Erro', 'Preencha todos os campos!')
            return;
        }

        setExercicios([...exercicios, novoExercicio]);
        setNovoExercicio({ nome: '', series: '', repeticoes: '', descanso: '' });
        setModalVisible(false);

        Toast.show({
            type: 'success',
            text1: 'Exercício adicionado 🎉',
            text2: `${nome} foi adicionado ao treino.`,
        });
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

                    <View className="flex-1 bg-colorBackground p-6">
                        <Text className="text-lg font-bold text-colorLight200 mb-4">Novo Treino</Text>

                        <View className="gap-y-5">

                            <View>
                                <Text className="text-colorLight200 text-lg mb-1">Nome do treino</Text>
                                <TextInput
                                    placeholder="Ex: Treino A"
                                    placeholderTextColor="#D4D4D8"
                                    className="border border-colorLight200 px-3 py-5 rounded-lg text-colorLight200"
                                    value={novoTreino.nome}
                                    onChangeText={(text) => setNovoTreino({ ...novoTreino, nome: text })}
                                />
                            </View>


                            <View>
                                <Text className="text-colorLight200 text-lg mb-1">Tipo de treino</Text>
                                <TextInput
                                    placeholder="Ex: Hipertrofia"
                                    placeholderTextColor="#D4D4D8"
                                    className="border border-colorLight200 px-3 py-5 rounded-lg text-colorLight200"
                                    value={novoTreino.tipo}
                                    onChangeText={(text) => setNovoTreino({ ...novoTreino, tipo: text })}
                                />
                            </View>

                            {/* aqui é pro personal informar qual dia da semana o aluno precisa fazer aquele treino */}
                            <View>
                                <Text className="text-colorLight200 text-lg mb-1">Dia da semana</Text>
                                <View className="border border-colorLight200 rounded-lg px-3 py-0.5">
                                    <Picker
                                        selectedValue={novoTreino.dia}
                                        onValueChange={(value) => setNovoTreino({ ...novoTreino, dia: value })}
                                        style={{ color: '#D4D4D8' }}
                                        dropdownIconColor="#E4E4E7"
                                    >
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

                            {/* aqui vai aparece os exercicios que o personal criar */}
                            {exercicios.map((ex, index) => (
                                <View key={index} className="border border-colorDark100 rounded-xl">


                                    <View className="flex-row justify-between items-center px-5 pt-5">
                                        <Text className="text-colorLight200 text-lg font-bold">{ex.nome}</Text>

                                        <View className="flex-row gap-5">
                                            <TouchableOpacity>
                                                <Feather name="refresh-ccw" size={20} color="#E4E4E7" />
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Feather name="trash-2" size={20} color="#E4E4E7" />
                                            </TouchableOpacity>
                                        </View>

                                    </View>


                                    <View className="flex-row justify-between p-5">
                                        <View>
                                            <Text className="text-gray-500">Séries</Text>
                                            <Text className="text-colorLight200">{ex.series}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500">Descanso</Text>
                                            <Text className="text-colorLight200">{ex.descanso} s</Text>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500">Repetições</Text>
                                            <Text className="text-colorLight200">{ex.repeticoes}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}

                            { /*botao pra abrir o modal de adicionar exercicio */}
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                className="bg-colorViolet py-4 rounded-lg mb-3 flex-row items-center justify-center"
                            >
                                <Entypo name="plus" size={15} color="#E4E4E7" />
                                <Text className="text-center text-colorLight200 font-bold text-lg pl-1">Adicionar exercício</Text>
                            </TouchableOpacity>
                        </View>


                        { /*salva o treino no banco, teoricamente precisa ir para a tela anterior essa informações */}
                        <TouchableOpacity onPress={salvarTreino} className="py-4 rounded-lg">
                            <Text className="text-center text-colorViolet font-bold text-lg">Salvar treino</Text>
                        </TouchableOpacity>
                    </View>

                    {/* modal que aparece quando o personal clica em adicionar exercicio, aqui para por os exercicios e vai aparecer na tela quando fechar o modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 bg-black/80 justify-center items-center px-4">
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                className="w-full"
                            >
                                <ScrollView
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <View className="w-full bg-colorBackground p-6 rounded-xl mt-10">
                                        <Text className="text-2xl font-bold text-white mb-6 text-center">Adicionar Exercício</Text>

                                        <View className="gap-y-4">
                                            {[
                                                { label: 'Nome do exercício', key: 'nome' },
                                                { label: 'Séries', key: 'series' },
                                                { label: 'Repetições', key: 'repeticoes' },
                                                { label: 'Descanso (segundos)', key: 'descanso' },
                                            ].map(({ label, key }) => (
                                                <View key={key}>
                                                    <Text className="text-colorLight200 mb-1">{label}</Text>
                                                    <TextInput
                                                        className="border border-colorDark100 px-3 py-5 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                                        placeholderTextColor="#D4D4D8"
                                                        keyboardType={['series', 'repeticoes', 'descanso'].includes(key) ? 'numeric' : 'default'}
                                                        value={novoExercicio[key]}
                                                        onChangeText={(text) => setNovoExercicio({ ...novoExercicio, [key]: text })}
                                                    />
                                                </View>
                                            ))}
                                        </View>

                                        { /* esse botao cria o exercicio e vai para aquela lista */}
                                        <TouchableOpacity onPress={adicionarExercicio} className="bg-colorViolet py-4 rounded-lg mt-6">
                                            <Text className="text-center text-white font-bold text-lg">Adicionar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-colorGray py-4 rounded-lg mt-3">
                                            <Text className="text-center text-colorLight200 font-bold text-lg">Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </View>
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
