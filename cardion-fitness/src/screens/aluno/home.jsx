import { View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native'; //esse é evento do botão voltar em Android
import { useEffect, useState, useCallback } from 'react';

import ProgressBar from 'react-native-progress/Bar';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

//### aq referente a biometria e facial
import * as LocalAuthentication from 'expo-local-authentication';

import { useDelete } from '~/hook/crud/useDelete';

import { useGet } from '~/hook/crud/useGet';

import { gerarPdfUsuario } from '~/utils/gerarPdfUsuario';

// ponto para refatorar, deixar mais legivel o trazer nome
// para pegar o nome é so usar a funcao de getById e pegar a propriedade nome

export default function Home({ navigation }) {
    const [nome, setNome] = useState();
    const { getById } = useGet()
    const { deleteAccount } = useDelete()
    const [usuario, setUsuario] = useState()

    //sessões de treinos realizadas
    const totalSessoes = 40;
    const [sessoes, setSessoes] = useState(0);
    const progresso = sessoes / totalSessoes;

    const marcarSessao = () => {
        if (sessoes < totalSessoes) {
            setSessoes(prev => prev + 1);

        }
    };

    const trazerNome = async () => {
        const user = await getById()
        setUsuario(user)
        setNome(user.nome)
        Alert.alert(user.nome)
    }

    useEffect(() => {
        const fetchNome = async () => {
            await trazerNome();
        };
        fetchNome();
    }, [])



    const autenticar = async () => {
        const compatibilidade = await LocalAuthentication.hasHardwareAsync();
        const biometriaCadastrada = await LocalAuthentication.isEnrolledAsync();

        if (!compatibilidade || !biometriaCadastrada) {
            Alert.alert('Biometria não configurada', 'Seu dispositivo não tem biometria ou ela não está ativada.');
            return;
        }

        const resultado = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autentique-se para continuar',
            fallbackLabel: 'Usar senha',
        });

        if (resultado.success) {
            Alert.alert("ai")
            await deleteAccount()
        } else {
            Alert.alert('Falha na autenticação');
        }
    };

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
        <SafeAreaView className='flex-1 w-full h-full bg-colorBackground'>
            <View className=''>
                <View className="pt-5 px-5">
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={28} color="#6943FF" />
                    </TouchableOpacity>
                </View>
                <Text>Seja bem vindo(a) {nome}</Text>
                <Text>Tela home aluno</Text>

                {/* Botão só pra fazer testes */}
                <TouchableOpacity
                    onPress={() => autenticar()}
                    className='mt-5 bg-red-500 px-4 py-2 rounded'
                >
                    <Text className='text-white font-bold'>APAGAR CONTA</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => gerarPdfUsuario(usuario)}>
                    <Text>Gerar PDF</Text>
                </TouchableOpacity>

                {/* sessões de treinos realizadas */}
                <View className='mx-10 p-5 rounded-xl bg-colorDark200 mt-10'>
                    <View className="flex-row items-center mb-10">
                        <View className='flex-row justify-center items-center'>
                            <View className='bg-colorViolet p-3 rounded-full'>
                                < FontAwesome5 name='dumbbell' size={20} color='#E4E4E7' />
                            </View>
                            <View className='ml-5'>
                                <Text className='text-colorLight200 text-2xl'>Sessões realizadas</Text>
                                <Text className="text-colorViolet text-3xl">
                                    {sessoes}
                                    <Text className="text-gray-500 text-xl"> / {totalSessoes}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>

                    <ProgressBar
                        progress={progresso}
                        width={null}
                        height={12}
                        color="#6943FF"
                        unfilledColor="#eee"
                        borderWidth={0}
                        borderRadius={5}
                        animated={true}
                        animationType="spring"
                        animationDuration={500}
                    />

                    <View className='px-10'>
                        <TouchableOpacity className="bg-colorViolet mt-6 py-3 rounded" onPress={marcarSessao}>
                            <Text className="text-center text-white font-semibold">Marcar sessão concluída</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};