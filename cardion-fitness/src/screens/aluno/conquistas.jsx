import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useGet } from '~/hook/crud/useGet';
import { useConquistas } from '~/hook/crud/conquistas/useConquistas';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Progress from 'react-native-progress';

import InfosPersonal from '~/components/modais/infosPersonal';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from "react-native-toast-message";

export default function Conquistas() {
    const { getById, getPersonalDoAluno } = useGet(); 
    const [modalVisible, setModalVisible] = useState(false);
    const [personal, setPersonal] = useState(null);
    const [loading, setLoading] = useState(false);

    const { getAllConquistas, buscarConquistasDoAluno } = useConquistas(); 
    const [conquistas, setConquistas] = useState([]);
    const [conquistasDesbloqueadas, setConquistasDesbloqueadas] = useState([]); 
    const [uid, setUid] = useState(null); 

    useEffect(() => {
        const loadUserDataAndConquistas = async () => {
            setLoading(true);
            try {
                const storedUid = await AsyncStorage.getItem('uid');
                if (storedUid) {
                    setUid(storedUid);

                    const todas = await getAllConquistas();
                    setConquistas(todas);

                    // aq ta buscando conquistas desbloqueadas
                    const desbloqueadas = await buscarConquistasDoAluno(storedUid);
                    // mapeando para ter o id somente das conquistas desbloqueadas
                    const idsDesbloqueados = new Set(desbloqueadas.map(conq => conq.id));
                    setConquistasDesbloqueadas(idsDesbloqueados);
                }
            } catch (error) {
                console.error('Erro ao buscar conquistas ou UID', error);
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Não foi possível carregar as conquistas.',
                });
            } finally {
                setLoading(false);
            }
        };

        loadUserDataAndConquistas();
    }, []);


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

    const openWhatsApp = (telefone) => {
        if (!telefone) {
            Toast.show({
                type: 'info',
                text1: 'Telefone não informado.',
            });
            return;
        }

        const phoneNumber = telefone.replace(/\D/g, '');
        const url = `https://wa.me/${phoneNumber}`;
        Linking.openURL(url).catch(() =>
            Toast.show({
                type: 'error',
                text1: 'Erro ao abrir o WhatsApp',
            })
        );
    };

    const sendEmail = (email) => {
        if (!email) {
            Toast.show({
                type: 'info',
                text1: 'Email não informado.',
            });
            return;
        }
        const url = `mailto:${email}`;
        Linking.openURL(url).catch(() =>
            Toast.show({
                type: 'error',
                text1: 'Erro ao abrir o cliente de email',
            })
        );
    };

    const renderConquistaItem = useCallback(({ item }) => {
        // verifica se a conquista ta desbloqueada... método has para melhor performance
        const isDesbloqueada = conquistasDesbloqueadas.has(item.id);

        return (
            <View
                className={`flex-1 justify-center bg-[#1f1f1f] rounded-2xl p-3 m-[6px] shadow-md ${isDesbloqueada ? 'shadow-yellow-500' : 'shadow-zinc-700'
                    }`}
                style={!isDesbloqueada && { opacity: 0.3 }}
            >
                <View className="items-center mb-1">
                    {isDesbloqueada ? (
                        <MaterialCommunityIcons name="trophy-award" size={32} color="#6943FF" />
                    ) : (
                        <FontAwesome name="lock" size={30} color="#888" />
                    )}
                </View>

                <Text
                    className={`text-center font-bold text-sm mb-1 ${isDesbloqueada ? 'text-colorViolet' : 'text-gray-400'
                        }`}
                >
                    {item.nome}
                </Text>

                <Text
                    className={`text-center text-xs ${isDesbloqueada ? 'text-gray-300' : 'text-gray-500'
                        }`}
                >
                    {isDesbloqueada ? item.descricao : 'Conquista Bloqueada'}
                </Text>

                <Text
                    className={`text-center font-bold text-sm mt-1 ${isDesbloqueada ? 'text-colorViolet' : 'text-gray-400'
                        }`}
                >
                    {item.pontos} pontos
                </Text>
            </View>
        );
    }, [conquistasDesbloqueadas]);

    if (loading) {
        return (
            <SafeAreaView
                edges={['top', 'bottom']}
                className="flex-1 bg-colorBackground justify-center items-center"
            >
                <ActivityIndicator size="large" color="#6943FF" />
                <Text className='text-colorLight300 mt-1'>Carregando conquistas</Text>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className="flex-1 bg-colorBackground px-5 py-2"
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

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <Text className="text-colorLight300 text-center text-lg mt-5">
                        Desbloqueie todas as conquistas e torne-se uma lenda!
                    </Text>

                    <View className="my-4 items-center">
                        <Text className="text-colorLight300 text-sm mb-2">
                            {conquistasDesbloqueadas.size} de {conquistas.length} conquistas desbloqueadas
                        </Text>


                        <Progress.Bar
                            progress={
                                conquistas.length > 0
                                    ? conquistasDesbloqueadas.size / conquistas.length
                                    : 0
                            }
                            width={null} 
                            color="#6943FF"
                            unfilledColor="#2d2d2d"
                            borderWidth={0}
                            height={12}
                            borderRadius={10}
                            style={{ width: '100%' }}
                        />

                        <Text className="text-xs text-gray-400 mt-1">
                            Progresso: {(
                                (conquistasDesbloqueadas.size / conquistas.length) *
                                100
                            ).toFixed(1)}%
                        </Text>
                    </View>
                    <FlatList
                        key={3}
                        data={conquistas}
                        keyExtractor={(item) => item.id}
                        renderItem={renderConquistaItem}
                        numColumns={3}
                        scrollEnabled={false}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <View className="flex-1 justify-center items-center mt-10">
                                <Text className="text-gray-400 text-lg">Nenhuma conquista encontrada.</Text>
                            </View>
                        )}
                    />

                    <InfosPersonal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        personal={personal}
                        openWhatsApp={openWhatsApp}
                        sendEmail={sendEmail}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}