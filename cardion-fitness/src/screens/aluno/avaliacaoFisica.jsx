import { useEffect, useState } from 'react';
import { useGetAvaliacaoFisica } from '~/hook/crud/avaliacaoFisica/useGetAvaliacao';
import { getAuth } from 'firebase/auth';
import {
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from "react-native-toast-message";
import HeaderAppBack from '~/components/header/headerAppBack';

export default function AvaliacaoFisica() {
    const { getAllAvaliacoesByIdAluno } = useGetAvaliacaoFisica();
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvaliacoes = async () => {
            try {
                const auth = getAuth();
                const idAluno = auth.currentUser?.uid || await AsyncStorage.getItem('uid');

                if (!idAluno) {
                    Toast.show({
                        type: 'error',
                        text1: 'Usuário não encontrado',
                    });
                    return;
                }

                const data = await getAllAvaliacoesByIdAluno(idAluno);
                setAvaliacoes(data);
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao buscar avaliações',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAvaliacoes();
    }, []);

    const handleAvaliacao = (avaliacao) => {
        navigation.navigate('DetalhesAvaliacaoFisica', { avaliacao });
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-colorBackground justify-center items-center">
                <ActivityIndicator size="large" color="#6943FF" />
                <Text className="mt-4 text-base text-colorLight200">Carregando avaliações...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <HeaderAppBack title="Avaliação" /> 

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className='px-5 py-5'>
                        {avaliacoes.length === 0 ? (
                            <Text className="text-center text-gray-500">Nenhuma avaliação registrada.</Text>
                        ) : (
                            avaliacoes.map((avaliacao) => (
                                <TouchableOpacity
                                    key={avaliacao.id}
                                    onPress={() => handleAvaliacao(avaliacao)}
                                    className="bg-colorLight200 p-4 rounded-xl mb-3"
                                >
                                    <View className='flex-row justify-between items-center mb-1'>
                                        <Text className="font-bold text-colorDark100">Avaliação</Text>
                                    </View>
                                    <Text className="text-gray-600">Nome: {avaliacao.nome || 'Nome'}</Text>
                                    <Text className="text-gray-600">Data: {avaliacao.data || 'DD/MM/AAAA'}</Text>
                                    <Text className="text-gray-600">Proxima Avaliação: {avaliacao.dataProximaAvaliacao || 'DD/MM/AAAA'}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
