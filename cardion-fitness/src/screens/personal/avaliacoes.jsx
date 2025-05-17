import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import React from 'react';

import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather';

import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import { useGetAvaliacaoFisica } from '~/hook/crud/avaliacaoFisica/useGetAvaliacao';
import { useDeleteAvaliacaoFisica } from '~/hook/crud/avaliacaoFisica/useDeleteAvalicaoFisica';

import { GerarPdfAvaliacao } from '~/utils/gerarPdfAvaliacao';

export default function AvaliacaoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { idAluno } = route.params || {};

    const [avaliacoes, setAvaliacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);

    const { getAllAvaliacoesByIdAluno } = useGetAvaliacaoFisica();
    const { deletarAvalicaoFisica } = useDeleteAvaliacaoFisica();

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const fetchAvaliacoes = async () => {
                if (!idAluno) return;

                setLoading(true);
                try {
                    const data = await getAllAvaliacoesByIdAluno(idAluno);
                    if (isActive) {
                        setAvaliacoes(data);
                    }
                } catch (error) {
                    console.error('Erro ao buscar avaliações:', error);
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            fetchAvaliacoes();

            return () => {
                isActive = false;
            };
        }, [idAluno])
    );


    const handleAvaliacao = (avaliacao) => {
        navigation.navigate('DetalhesAvaliacao', { avaliacao });
    };

    const confirmarDelete = (avaliacaoId) => {
        setAvaliacaoSelecionada(avaliacaoId);
        setModalVisible(true);
    };

    const handleDeleteConfirmado = async () => {
        try {
            await deletarAvalicaoFisica(avaliacaoSelecionada);
            setAvaliacoes((prev) => prev.filter((a) => a.id !== avaliacaoSelecionada));
        } catch (err) {
            console.error('Erro ao deletar avaliação:', err.message);
        } finally {
            setModalVisible(false);
            setAvaliacaoSelecionada(null);
        }
    };


    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="pt-5 px-5 pb-5">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Avaliação</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='px-5 py-5'>
                        <View className='px-5 py-5'>
                            {loading ? (
                                <ActivityIndicator size="large" color="#6943FF" className="mt-10" />
                            ) : avaliacoes.length === 0 ? (
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
                                            <View className='flex-row justify-between items-center gap-x-3'>
                                                <TouchableOpacity onPress={() => navigation.navigate('EditarAvaliacao', { avaliacao })}>
                                                    <Feather name="refresh-ccw" size={20} color="#6943FF" />
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => confirmarDelete(avaliacao.id)}>
                                                    <Feather name="trash-2" size={20} color="#6943FF" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text className="text-gray-600">Nome: {avaliacao.nome || 'Nome'}</Text>
                                        <Text className="text-gray-600">Data: {avaliacao.data || 'DD/MM/AAAA'}</Text>
                                        <Text className="text-gray-600">Proxima Avaliação: {avaliacao.dataProximaAvaliacao || 'DD/MM/AAAA'}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                            <View className='mt-5'>
                                <TouchableOpacity
                                    className="flex-row items-center bg-colorViolet py-3 rounded-full justify-center"
                                    onPress={() => navigation.navigate('CriarAvaliacao', { idAluno })}
                                >
                                    <View className="flex-row items-center gap-x-1">
                                        <Entypo name="plus" size={20} color="#E4E4E7" />
                                        <Text className="text-colorLight200 text-center text-lg font-semibold">Criar nova avaliação</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Modal
                        transparent={true}
                        visible={modalVisible}
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/80 px-6">
                            <View className="bg-colorDark100 rounded-2xl w-full p-6">
                                <Text className='text-colorLight200 text-lg font-bold mb-3'>
                                    Tem certeza que deseja apagar está avaliação?
                                </Text>
                                <Text className="text-gray-400 mb-8">
                                    Isso não poderá ser revertido.
                                </Text>
                                <View className="flex-row justify-end gap-x-10">
                                    <TouchableOpacity
                                        className="text-colorViolet text-lg font-semibold"
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text className="text-colorViolet text-lg font-semibold">Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleDeleteConfirmado}
                                    >
                                        <Text className="text-red-600 font-semibold text-lg">Apagar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}
