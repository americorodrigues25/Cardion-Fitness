import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

import HeaderAppBack from '~/components/header/headerAppBack';
import ExcluirAvaliacao from '~/components/modais/excluirAvaliacao';

import { useGetAvaliacaoFisica } from '~/hook/crud/avaliacaoFisica/useGetAvaliacao';
import { useDeleteAvaliacaoFisica } from '~/hook/crud/avaliacaoFisica/useDeleteAvalicaoFisica';

export default function AvaliacaoScreen() {
    const navigation = useNavigation();
    const { idAluno } = useRoute().params || {};

    const [avaliacoes, setAvaliacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);

    const { getAllAvaliacoesByIdAluno } = useGetAvaliacaoFisica();
    const { deletarAvalicaoFisica } = useDeleteAvaliacaoFisica();

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const fetchData = async () => {
                if (!idAluno) return;
                setLoading(true);
                try {
                    const data = await getAllAvaliacoesByIdAluno(idAluno);
                    if (isActive) setAvaliacoes(data);
                } catch {
                    Toast.show({ type: 'error', text1: 'Erro ao buscar avaliações' });
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            fetchData();
            return () => {
                isActive = false;
            };
        }, [idAluno])
    );

    const handleDelete = async () => {
        try {
            await deletarAvalicaoFisica(avaliacaoSelecionada);
            setAvaliacoes(prev => prev.filter(a => a.id !== avaliacaoSelecionada));
        } catch {
            Toast.show({ type: 'error', text1: 'Erro ao deletar avaliação' });
        } finally {
            setModalVisible(false);
            setAvaliacaoSelecionada(null);
        }
    };

    const abrirModal = (id) => {
        setAvaliacaoSelecionada(id);
        setModalVisible(true);
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
                    <HeaderAppBack title="Avaliação" />

                    <View className="px-5 py-5">
                        {loading ? (
                            <ActivityIndicator size="large" color="#6943FF" className="mt-10" />
                        ) : avaliacoes.length === 0 ? (
                            <Text className="text-center text-colorLight200">Nenhuma avaliação registrada.</Text>
                        ) : (
                            avaliacoes.map((avaliacao) => (
                                <TouchableOpacity
                                    key={avaliacao.id}
                                    onPress={() => navigation.navigate('DetalhesAvaliacao', { avaliacao })}
                                    className="bg-colorLight200 p-4 rounded-xl mb-3"
                                >
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="font-bold text-colorDark100">Avaliação</Text>
                                        <View className="flex-row gap-x-3">
                                            <TouchableOpacity onPress={() => navigation.navigate('EditarAvaliacao', { avaliacao })}>
                                                <Feather name="refresh-ccw" size={20} color="#6943FF" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => abrirModal(avaliacao.id)}>
                                                <Feather name="trash-2" size={20} color="#6943FF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text className="text-gray-600">Nome: {avaliacao.nome || 'Nome'}</Text>
                                    <Text className="text-gray-600">Data: {avaliacao.data || 'DD/MM/AAAA'}</Text>
                                    <Text className="text-gray-600">Próxima Avaliação: {avaliacao.dataProximaAvaliacao || 'DD/MM/AAAA'}</Text>
                                </TouchableOpacity>
                            ))
                        )}

                        <TouchableOpacity
                            className="flex-row items-center bg-colorViolet py-3 rounded-full justify-center mt-5"
                            onPress={() => navigation.navigate('CriarAvaliacao', { idAluno })}
                        >
                            <Entypo name="plus" size={20} color="#E4E4E7" />
                            <Text className="text-colorLight200 text-center text-lg font-semibold ml-2">
                                Criar nova avaliação
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <ExcluirAvaliacao
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onConfirm={handleDelete}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
