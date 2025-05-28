import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native'; //esse é evento do botão voltar em Android
import { useEffect, useState, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';

import { useGet } from '~/hook/crud/useGet';
import NumerosAlunos from '~/components/modais/numeroAlunos';

export default function Home() {
    const navigation = useNavigation();
    const [nome, setNome] = useState();
    const { getById } = useGet();
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const { getAllAlunosByPersonal } = useGet();
    const isFocused = useIsFocused();
    const [busca, setBusca] = useState('');
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);

    useEffect(() => {
        const termo = busca.toLowerCase();

        const filtrados = alunos.filter((aluno) =>
            aluno.nome?.toLowerCase().includes(termo) ||
            aluno.email?.toLowerCase().includes(termo)
        );

        setAlunosFiltrados(filtrados);
    }, [busca, alunos]);

    const fetchAlunos = async () => {
        const data = await getAllAlunosByPersonal();
        setAlunos(data || []);
    };

    useFocusEffect(
        useCallback(() => {
            if (isFocused) {
                fetchAlunos();
            }
        }, [isFocused])
    );


    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // aqui é pra bloquear o botão de voltar no android, pro usuario não 
                // conseguir voltar pro login depois de entrar na home
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const trazerNome = async () => {
        const user = await getById()
        setNome(user.nome)
    }

    useEffect(() => {
        const fetchNome = async () => {
            await trazerNome();
        };

        fetchNome();
    }, [])


    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className='flex-1 bg-colorBackground px-5 py-2'
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >

                <View className='flex-row items-center justify-between mb-2'>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('~/assets/img/logo/Logo1.png')} className="w-20 h-10" resizeMode="contain" />
                    </View>

                    <View className='flex-row items-center gap-3'>
                        <TouchableOpacity onPress={() => setShowMessageModal(true)}>
                            <MaterialCommunityIcons name="message-reply-text-outline" size={20} color="#e4e4e7" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className='py-5'>
                        <View className=''>
                            <Text className='text-colorLight200 text-2xl font-semibold'>Olá {nome}!</Text>
                            <Text className='text-lg font-semibold text-gray-400 pt-5 pb-2 px-3'>Seus alunos</Text>
                        </View>


                        <View className="flex-1 justify-center items-center px-3">
                            <TouchableOpacity onPress={() => navigation.navigate('VincularAluno')}
                                className="w-full h-80">
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/mulherAcademia.png')}
                                    className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-white text-3xl font-bold"> Adicionar{"\n"} Aluno</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <View className=''>
                            <Text className='text-lg font-semibold text-gray-400 pt-5 pb-2 px-3'>Seus treinos</Text>
                        </View>

                        <View className="flex-1 justify-center items-center px-3">
                            <TouchableOpacity onPress={() => navigation.navigate('CriarTreinoAluno')}
                                className="w-full h-80">
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/homemAcademia.jpg')}
                                    className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-white text-3xl font-bold"> Criar{"\n"} Treinos</Text>
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
        </SafeAreaView >
    );
}