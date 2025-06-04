import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, ImageBackground, Modal, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native'; //esse é evento do botão voltar em Android
import { useEffect, useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import React from 'react';

import InfosPersonal from '~/components/modais/infosPersonal';
import AdCarousel from '~/components/anuncios/anuncioParceiros';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDelete } from '~/hook/crud/useDelete';
import { useGet } from '~/hook/crud/useGet';
import { useRealizarSessaoTreino } from '~/hook/crud/treino/sessoesTreino/useRealizarSessaoTreino';

export default function Home({ navigation }) {
    const [nome, setNome] = useState();
    const [anotacao, setAnotacao] = useState();
    const { getById } = useGet();
    const { deleteAccount } = useDelete();
    const [usuario, setUsuario] = useState();
    const { realizarSessao } = useRealizarSessaoTreino();

    const [modalVisible, setModalVisible] = useState(false);
    const [personal, setPersonal] = useState(null);
    const { getPersonalDoAluno } = useGet();
    const [loading, setLoading] = useState(false);

    const totalSessoes = 40;
    const [sessoes, setSessoes] = useState(0);
    const progresso = sessoes / totalSessoes;

    const [showAd, setShowAd] = useState(false);

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
        setAnotacao(user.anotacao)
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

    const abrirModalPersonal = async () => {
        setLoading(true);
        try {
            const dados = await getPersonalDoAluno();

            if (dados && dados.nome) {
                setPersonal(dados);
                setModalVisible(true);
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Sem Personal',
                    text2: 'Você ainda não está vinculado a nenhum personal.'
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar os dados do personal.'
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setShowAd(true); 
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

                        <TouchableOpacity onPress={abrirModalPersonal} disabled={loading} className="p-2">
                            {loading ? (
                                <ActivityIndicator size="small" color="#6943FF" />
                            ) : (
                                <MaterialCommunityIcons name="message-reply-text-outline" size={20} color="#e4e4e7" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <AdCarousel visible={showAd} onClose={() => setShowAd(false)} />
                </View>

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <View className='py-5'>
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
                                        <Text className="text-colorLight200 text-3xl font-bold"> Ver{"\n"} Treinos</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <View className=''>
                            <Text className='text-lg font-semibold text-gray-400 pt-5 pb-2 px-3'>Suas avaliações</Text>
                        </View>

                        <View className="flex-1 justify-center items-center px-3">
                            <TouchableOpacity onPress={() => navigation.navigate('AvaliacaoFisica')}
                                className="w-full aspect-[4/3.7]">
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/homemAcademia.jpg')}
                                    className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-colorLight200 text-3xl font-bold"> Ver{"\n"} Avaliações</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <View className=''>
                            <Text className='text-lg font-semibold text-gray-400 pt-5 pb-2 px-3'>Seu ranking</Text>
                        </View>

                        <View className="flex-1 justify-center items-center px-3">
                            <TouchableOpacity onPress={() => navigation.navigate('RankingPontosGeral')}
                                className="w-full aspect-[4/3.7]">
                                <ImageBackground
                                    source={require('~/assets/img/button-cards/mulherAcademia.jpg')}
                                    className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                >
                                    <View className="bg-black/30 p-5">
                                        <Text className="text-colorLight200 text-3xl font-bold"> Ver{"\n"} Ranking</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mt-5 px-3 pb-5">
                        <Text className="text-colorLight300 text-center text-base font-semibold mb-3">
                            Veja alguns de nossos produtos
                        </Text>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Produtos')}
                            className="bg-colorViolet rounded-full py-[10px] mb-6 mx-10 items-center"
                        >
                            <Text className="text-colorLight200 font-bold text-lg">Conferir Produtos</Text>
                        </TouchableOpacity>

                        <Text className="text-colorLight300 text-center text-base font-semibold mb-3">
                            Siga-nos nas redes sociais
                        </Text>

                        <View className="flex-row justify-center gap-x-4">
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/medux_technology/?igsh=MTVrMmlsaG5rdHNlbQ%3D%3D#')}>
                                <FontAwesome name="instagram" size={33} color="#6943FF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/people/Medux-Technology/61577055530284/?mibextid=kFxxJD')}>
                                <FontAwesome name="facebook-square" size={32} color="#6943FF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <InfosPersonal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        personal={personal}
                        anotacao={anotacao}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};