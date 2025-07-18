import {
    View,
    Text,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Linking,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '~/firebase/firebaseConfig';
import { useGet } from '~/hook/crud/useGet';

import InfosPersonal from '~/components/modais/infosPersonal';
import HeaderApp from '~/components/header/headerApp';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

export default function Desafios() {
    const navigation = useNavigation();
    const { getById, getPersonalDoAluno } = useGet();

    const [pontosDesafios, setPontosDesafios] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [personal, setPersonal] = useState(null);
    const [loading, setLoading] = useState(false);

    const showToast = (type, title, message) => {
        Toast.show({ type, text1: title, text2: message });
    };

    useFocusEffect(
        useCallback(() => {
            const fetchPontos = async () => {
                try {
                    const alunoId = await AsyncStorage.getItem('uid');
                    if (!alunoId) return;

                    const alunoDoc = await getDoc(doc(db, 'aluno', alunoId));
                    const pontos = alunoDoc.data()?.pontosDesafios ?? 0;

                    setPontosDesafios(typeof pontos === 'number' ? pontos : 0);
                } catch (error) {
                    showToast('error', 'Erro ao buscar pontos', '');
                    setPontosDesafios(0);
                }
            };

            fetchPontos();
        }, [])
    );

    const abrirModalPersonal = async () => {
        setLoading(true);
        try {
            const dados = await getPersonalDoAluno();

            if (dados?.nome) {
                setPersonal(dados);
                setModalVisible(true);
            } else {
                showToast('info', 'Sem Personal', 'Você ainda não está vinculado a nenhum personal.');
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Erro', 'Não foi possível carregar os dados do personal.');
        } finally {
            setLoading(false);
        }
    };

    const openWhatsApp = (telefone) => {
        if (!telefone) return showToast('info', 'Telefone não informado');
        const phone = telefone.replace(/\D/g, '');
        Linking.openURL(`https://wa.me/${phone}`).catch(() =>
            showToast('error', 'Erro ao abrir o WhatsApp', '')
        );
    };

    const sendEmail = (email) => {
        if (!email) return showToast('info', 'Email não informado');
        Linking.openURL(`mailto:${email}`).catch(() =>
            showToast('error', 'Erro ao abrir o cliente de email', '')
        );
    };

    const categorias = [
        { tipo: 'Alimentação', descricao: 'Nutrição que impulsiona', icone: 'apple-alt' },
        { tipo: 'Cardio', descricao: 'Acelere seu ritmo', icone: 'heartbeat' },
        { tipo: 'Performance', descricao: 'Supere seus limites', icone: 'dumbbell' },
        { tipo: 'Diversos', descricao: 'Bem-estar completo', icone: 'puzzle-piece' },
    ];

    return (
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-colorBackground px-5 py-2">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >

                <HeaderApp onPressIcon={abrirModalPersonal} loading={loading} />

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <View className="px-4 pt-5">
                        <Text className="text-2xl font-bold text-colorLight300 text-center">
                            Desafie-se e Transforme
                        </Text>
                    </View>

                    {/* Card de Brindes */}
                    <View className="bg-colorInputs rounded-2xl px-4 py-4 mx-2 my-4 flex-row items-center border-[0.2px] border-gray-600">
                        <Text className="mr-3 text-[40px]">🏆</Text>
                        <View className="flex-1">
                            <Text className="text-colorLight300 font-bold text-xl">Acumule Pontos!</Text>
                            <Text className="text-gray-500 text-base">
                                Fique entre os 3 melhores do ranking e ganhe brindes todo mês de nossos parceiros!{' '}
                                <Text className="text-colorViolet">(em breve)</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Saldo de Pontos */}
                    <View className="bg-colorInputs rounded-2xl px-4 py-4 mx-2 border-[0.2px] border-gray-600">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-colorLight300 font-bold text-lg">
                                    Saldo de Pontos | Desafios
                                </Text>
                                <Text className="text-gray-500 text-base">Seus pontos acumulados</Text>
                            </View>
                            <View className="items-center gap-y-1">
                                <View className="bg-colorViolet px-2 py-1 rounded-full min-w-[60px] items-center">
                                    <Text
                                        className="text-colorLight300 font-bold text-base text-center"
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {pontosDesafios.toLocaleString('pt-BR')}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('RankingPontosDesafios')}
                                    className="py-[2px]"
                                >
                                    <View className="flex-row items-center gap-x-1">
                                        <Text className="text-gray-500 text-xs font-bold">Veja o ranking</Text>
                                        <MaterialCommunityIcons name="medal" size={20} color="#6943FF" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Categorias */}
                    <Text className="text-lg text-gray-400 text-center my-4">
                        Escolha uma categoria de desafios para realizar!
                    </Text>

                    <View className="flex-row flex-wrap justify-between px-2">
                        {categorias.map(({ tipo, descricao, icone }) => (
                            <TouchableOpacity
                                key={tipo}
                                onPress={() => navigation.navigate('ListaDesafios', { tipo })}
                                className="bg-colorInputs rounded-2xl w-[48%] mb-4 px-3 py-5 border-[0.2px] border-gray-600"
                            >
                                <View className="items-center">
                                    <FontAwesome5 name={icone} size={40} color="#4B5563" />
                                    <Text className="text-lg font-bold mt-2 text-center text-colorLight300">
                                        {tipo}
                                    </Text>
                                    <Text className="text-sm text-center text-gray-600">{descricao}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Modal Personal */}
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
    );
}
