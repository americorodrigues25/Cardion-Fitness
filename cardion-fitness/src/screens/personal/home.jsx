import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, ImageBackground, Linking, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native'; //esse é evento do botão voltar em Android
import { useEffect, useState, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';

import { useGet } from '~/hook/crud/useGet';

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


    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className='flex-1 bg-colorBackground pl-5 py-2'
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
                >

                    <View className='flex-row items-center justify-between pr-5'>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
                        </View>

                        <View className='flex-row items-center gap-5'>
                            <TouchableOpacity >
                                <FontAwesome name="bell-o" size={23} color="#e4e4e7" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowMessageModal(true)}>
                                <MaterialCommunityIcons name="message-reply-text-outline" size={23} color="#e4e4e7" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='py-10'>
                        <View className=''>
                            <Text className='text-colorLight200 text-2xl font-semibold'>Bem vindo, {nome}!</Text>
                            <Text className='text-base font-semibold text-colorLight200 px-5 py-5'>Seus alunos</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row gap-5">

                                <TouchableOpacity onPress={() => navigation.navigate('VincularAluno')}
                                    className="min-w-[300px] h-80">
                                    <ImageBackground
                                        source={require('~/assets/img/button-cards/mulherAcademia.png')}
                                        className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                    >
                                        <View className="bg-black/30 p-5">
                                            <Text className="text-white text-3xl font-bold"> Adicionar{"\n"} aluno</Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>

                                <TouchableOpacity className="min-w-[300px] h-80 mr-5">
                                    <ImageBackground
                                        source={require('~/assets/img/button-cards/homemAcademia.jpg')}
                                        className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                    >
                                        <View className="bg-black/30 p-5">
                                            <Text className="text-white text-3xl font-bold">Grupo de{"\n"}alunos</Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                    <Modal transparent visible={showMessageModal} animationType="fade">
                        <View className="flex-1 justify-center items-center bg-black/80 px-6">
                            <View className="bg-colorDark200 rounded-2xl p-6 w-full max-h-[80%]">

                                {!selectedAluno ? (
                                    <>
                                        <Text className="text-xl font-bold text-center mb-4 text-colorLight200">
                                            Deseja conversar com algum aluno?
                                        </Text>

                                        <TextInput
                                            placeholder="Busque o aluno"
                                            placeholderTextColor="#A1A1AA"
                                            className="bg-colorDark100 text-colorLight200 px-4 py-4 rounded-xl mb-4"
                                            value={busca}
                                            onChangeText={setBusca}
                                        />

                                        {alunos.length === 0 ? (
                                            <Text className="text-center text-colorLight300 mb-4">Nenhum aluno cadastrado ainda.</Text>
                                        ) : (
                                            <ScrollView className="mb-4">
                                                {alunosFiltrados.length === 0 ? (
                                                    <Text className="text-center text-colorLight300">Nenhum aluno encontrado.</Text>
                                                ) : (
                                                    alunosFiltrados.map((aluno, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            className="py-3 px-4 border-b border-colorDark100"
                                                            onPress={() => setSelectedAluno(aluno)}
                                                        >
                                                            <Text className="text-lg text-colorLight300">{aluno.nome}</Text>
                                                        </TouchableOpacity>
                                                    ))
                                                )}
                                            </ScrollView>
                                        )}

                                        <TouchableOpacity
                                            className="bg-colorViolet py-3 rounded-full items-center mt-2"
                                            onPress={() => {
                                                setShowMessageModal(false)
                                                setBusca('')
                                                setSelectedAluno(null)
                                            }}
                                        >
                                            <Text className="text-colorLight200 font-bold">Cancelar</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        {selectedAluno.telefone ? (
                                            <>
                                                <Text className='text-xl font-bold text-center mb-10 text-colorLight200'>
                                                    {selectedAluno.telefone}
                                                </Text>
                                                <Text className="text-xl font-bold text-center mb-10 text-colorLight200">
                                                    Deseja ir para o WhatsApp de {selectedAluno.nome}?
                                                </Text>
                                            </>
                                        ) : (
                                            <Text className="text-xl font-bold text-center mb-10 text-colorLight200">
                                                Nenhum número cadastrado para {selectedAluno.nome}.
                                            </Text>
                                        )}

                                        {selectedAluno.telefone ? (
                                            <View className="flex-row justify-between gap-4">
                                                <TouchableOpacity
                                                    className="flex-1 bg-colorViolet py-3 rounded-full items-center"
                                                    onPress={() => {
                                                        const telefone = selectedAluno.telefone?.replace(/\D/g, '');
                                                        const url = `https://wa.me/55${telefone}`;
                                                        Linking.openURL(url);
                                                        setShowMessageModal(false);
                                                        setSelectedAluno(null);
                                                        setBusca('');
                                                    }}
                                                >
                                                    <Text className="text-white font-bold">Sim</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    className="flex-1 bg-gray-300 py-3 rounded-full items-center"
                                                    onPress={() => setSelectedAluno(null)}
                                                >
                                                    <Text className="text-gray-800 font-bold">Não</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                className="bg-gray-300 py-3 rounded-full items-center"
                                                onPress={() => setSelectedAluno(null)}
                                            >
                                                <Text className="text-gray-800 font-bold">Voltar</Text>
                                            </TouchableOpacity>
                                        )}

                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}