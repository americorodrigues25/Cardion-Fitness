import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native'; //esse é evento do botão voltar em Android
import { useEffect, useState, useCallback } from 'react';

import ProgressBar from 'react-native-progress/Bar';
import DashboardGraficoAlunos from '~/components/dashboardAlunoPontos';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDelete } from '~/hook/crud/useDelete';
import { useGet } from '~/hook/crud/useGet';
import { gerarPdfUsuario } from '~/utils/gerarPdfUsuario';
import { useRealizarSessaoTreino } from '~/hook/crud/treino/sessoesTreino/useRealizarSessaoTreino';



// ponto para refatorar, deixar mais legivel o trazer nome
// para pegar o nome é so usar a funcao de getById e pegar a propriedade nome

export default function Home({ navigation }) {
    const [nome, setNome] = useState();
    const { getById } = useGet();
    const { deleteAccount } = useDelete();
    const [usuario, setUsuario] = useState();
    const { realizarSessao } = useRealizarSessaoTreino();

    //sessões de treinos realizadas
    const totalSessoes = 40;
    const [sessoes, setSessoes] = useState(0);
    const progresso = sessoes / totalSessoes;

    const marcarSessao = async () => {
        const sessao = await realizarSessao()
        if (!sessao) return

        if (sessoes < totalSessoes) {
            setSessoes(prev => prev + 1);

        }
    };

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
                        <TouchableOpacity >
                            <FontAwesome name="bell-o" size={20} color="#e4e4e7" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={''}>
                            <MaterialCommunityIcons name="message-reply-text-outline" size={20} color="#e4e4e7" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <View className='py-10'>
                        <View className=''>
                            <Text className='text-colorLight200 text-2xl font-semibold'>Olá, {nome}!</Text>
                            <Text className='text-lg font-semibold text-gray-400 pt-5 pb-2 px-3'>Seus treinos</Text>
                        </View>

                        <View className="flex-1 justify-center items-center px-3">
                            <TouchableOpacity onPress={() => navigation.navigate('TreinoAluno')}
                                className="w-full aspect-[4/3.7]">
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/mulherAcademia.png')}
                                    className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-white text-3xl font-bold"> Ver{"\n"} Treinos</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <View className=''>
                            <Text className='text-lg font-semibold text-gray-400 pt-5 pb-2 px-3'>Suas avaliações</Text>
                        </View>

                        <View className="flex-1 justify-center items-center px-3">
                            <TouchableOpacity onPress={() => navigation.navigate('CriarTreinoAluno')}
                                className="w-full aspect-[4/3.7]">
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/homemAcademia.jpg')}
                                    className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-white text-3xl font-bold"> Ver{"\n"} Avaliações</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <View className=''>
                            <Text className='text-lg font-semibold text-gray-400 pt-5 pb-2 px-3'>Seu ranking</Text>
                        </View>

                        <View className="flex-1 justify-center items-center px-3">
                            <TouchableOpacity onPress={() => navigation.navigate('')}
                                className="w-full aspect-[4/3.7]">
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/mulherAcademia.jpg')}
                                    className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-white text-3xl font-bold"> Ver{"\n"} Ranking</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>



                    <View className=''>


                        <TouchableOpacity onPress={() => gerarPdfUsuario(usuario)}>
                            <Text>Gerar PDF</Text>
                        </TouchableOpacity>

                        
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
                        <DashboardGraficoAlunos />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};