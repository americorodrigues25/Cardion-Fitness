import {
    View,
    Text,
    ScrollView,
    Image,
    Alert,
    Platform,
    BackHandler,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useGet } from '~/hook/crud/useGet';
import NumerosAlunos from '~/components/modais/numeroAlunos';

export default function Home() {
    const navigation = useNavigation();
    const { getById, getAllAlunosByPersonal } = useGet();

    const [nome, setNome] = useState('');
    const [alunos, setAlunos] = useState([]);
    const [busca, setBusca] = useState('');
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);

    const isFocused = useIsFocused();

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (isFocused) fetchAlunos();
        }, [isFocused])
    );

    useEffect(() => {
        const termo = busca.toLowerCase();
        const filtrados = alunos.filter((aluno) =>
            aluno.nome?.toLowerCase().includes(termo) ||
            aluno.email?.toLowerCase().includes(termo)
        );
        setAlunosFiltrados(filtrados);
    }, [busca, alunos]);

    useEffect(() => {
        const fetchNome = async () => {
            const user = await getById();
            setNome(user.nome || '');
        };
        fetchNome();
    }, []);

    const fetchAlunos = async () => {
        const data = await getAllAlunosByPersonal();
        setAlunos(data || []);
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-colorBackground px-5 py-2">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >

                <View className="flex-row items-center justify-between mb-2">
                    <Image
                        source={require('~/assets/img/logo/Logo1.png')}
                        className="w-20 h-10"
                        resizeMode="contain"
                    />
                    <TouchableOpacity onPress={() => setShowMessageModal(true)}>
                        <MaterialCommunityIcons name="message-reply-text-outline" size={20} color="#e4e4e7" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="py-5">

                        <View>
                            <Text className="text-colorLight200 text-2xl font-semibold">Olá {nome}!</Text>
                            <Text className="text-lg font-semibold text-gray-400 pt-5 pb-2 px-3">Seus alunos</Text>
                        </View>

                        <View className="items-center px-3 mb-5">
                            <TouchableOpacity
                                onPress={() => navigation.navigate('VincularAluno')}
                                className="w-full h-80"
                            >
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/mulherAcademia.png')}
                                    className="h-full rounded-2xl overflow-hidden justify-end"
                                    resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-white text-3xl font-bold">Adicionar{"\n"}Aluno</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-lg font-semibold text-gray-400 pt-5 pb-2 px-3">Criar treinos</Text>
                        </View>

                        <View className="items-center px-3">
                            <TouchableOpacity
                                onPress={() => navigation.navigate('CriarTreinoAluno')}
                                className="w-full h-80"
                            >
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/homemAcademia.jpg')}
                                    className="h-full rounded-2xl overflow-hidden justify-end"
                                    resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-white text-3xl font-bold">Criar{"\n"}Treinos</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <NumerosAlunos
                        showMessageModal={showMessageModal}
                        setShowMessageModal={setShowMessageModal}
                        alunos={alunos}
                        busca={busca}
                        setBusca={setBusca}
                        selectedAluno={selectedAluno}
                        setSelectedAluno={setSelectedAluno}
                        alunosFiltrados={alunosFiltrados}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}