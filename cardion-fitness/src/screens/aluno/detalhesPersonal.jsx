import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Image, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGet } from '~/hook/crud/useGet';
import { useVinculo } from '~/hook/crud/vincularAlunos/vincularAluno';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { SERVER_URL } from '~/apiConfig/config';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
}

export default function InfosPersonal() {
    const navigation = useNavigation();
    const { getPersonalDoAluno } = useGet();
    const [personal, setPersonal] = useState(null);
    const [imageUrl, setImageUrl] = useState();
    const { seDesvincularDePersonal } = useVinculo();
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [showModal, setShowModal] = useState(false)

    const fetchPersonalData = async () => {
        try {
            setLoadingData(true);
            const data = await getPersonalDoAluno();
            if (data) {
                setPersonal(data);
                fetchImage(data.uid);
            } else {
                setPersonal(null);
                setImageUrl(null);
            }
        } catch (error) {
            console.log('Erro ao buscar personal do aluno:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchImage = async (uid) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const token = await user.getIdToken();
            const res = await axios.get(`${SERVER_URL}/image/${uid}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setImageUrl(`${res.data.url}?${Date.now()}`);
        } catch (err) {
            console.log('Erro ao carregar imagem:', err);
        }
    };

    const handleExcluirPersonal = async () => {
        try {
            setLoadingDelete(true);
            setShowModal(false);
            await seDesvincularDePersonal(personal.uid);
            Toast.show({
                type: 'success',
                text1: 'Personal excluído com sucesso!',
            });
            await fetchPersonalData();
        } catch (error) {
            console.log('Erro ao excluir personal:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao excluir personal',
            });
        } finally {
            setLoadingDelete(false);
        }
    };

    useEffect(() => {
        fetchPersonalData();
    }, []);

    const openWhatsApp = (telefone) => {
        if (!telefone) return;
        const phoneNumber = telefone.replace(/\D/g, '');
        const url = `https://wa.me/${phoneNumber}`;
        Linking.openURL(url).catch(err => console.log('Erro ao abrir WhatsApp:', err));
    };

    const sendEmail = (email) => {
        if (!email) return;
        const url = `mailto:${email}`;
        Linking.openURL(url).catch(err => console.log('Erro ao abrir email:', err));
    };

    if (loadingData) {
        return (
            <View className=" bg-colorBackground flex-1 justify-center items-center p-4 ">
                <ActivityIndicator size="large" color="#6943FF" />
                <Text className='text-colorLight300 mt-1'>Carregando informações...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
            <ScrollView
                bounces={false}
                overScrollMode='never'
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="pt-5 px-5">
                    <TouchableOpacity onPress={() => navigation.openDrawer()} className="flex-row">
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                        <Text className="ml-2 text-colorLight200">Meu personal</Text>
                    </TouchableOpacity>
                </View>

                <View className="p-6">
                    {personal ? (
                        <>
                            <View className="flex-row items-center justify-center">
                                <Image
                                    key={imageUrl}
                                    source={imageUrl ? { uri: imageUrl } : require('~/assets/img/imgProfileDefault.png')}
                                    resizeMode="cover"
                                    className="w-28 h-28 rounded-full"
                                />
                            </View>

                            <Text className="text-xl font-bold mt-4 text-center text-colorLight200">Informações do Personal</Text>

                            <View className="gap-y-2 my-6">
                                <View className="flex-row items-center gap-x-3">
                                    <Ionicons name="person" size={22} color="#6943FF" />
                                    <Text className="text-colorLight300">Nome: {personal?.nome || "Não informado"}</Text>
                                </View>

                                <View className="flex-row items-center gap-x-3">
                                    <FontAwesome name="envelope" size={22} color="#6943FF" />
                                    <Text className="text-colorLight300">Email: {personal?.email || "Não informado"}</Text>
                                </View>

                                <View className="flex-row items-center gap-x-3">
                                    <FontAwesome name="phone" size={22} color="#6943FF" />
                                    <Text className="text-colorLight300">Telefone: {personal?.telefone || "Não informado"}</Text>
                                </View>

                                <View className="flex-row items-center gap-x-3">
                                    <Ionicons name="calendar-number" size={22} color="#6943FF" />
                                    <Text className="text-colorLight300">Data de nascimento: {personal.dataNasc || ''}</Text>
                                </View>

                                <View className="flex-row items-center gap-x-3">
                                    <FontAwesome name="user-plus" size={22} color="#6943FF" />
                                    <Text className="text-colorLight300">Data de vinculação: {formatTimestamp(personal.dataVinculacao)}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => setShowModal(true)}
                                disabled={loadingDelete}
                                className="items-center"
                            >
                                {loadingDelete ? (
                                    <ActivityIndicator size="small" color="#EF4444" />
                                ) : (
                                    <Text className="text-red-500 font-semibold text-lg text-center">
                                        Excluir Personal
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={showModal}
                                onRequestClose={() => setShowModal(false)}
                            >
                                <View className="flex-1 justify-center items-center bg-black/80 px-6">
                                    <View className="bg-colorDark100 rounded-2xl w-full p-6">
                                        <Text className="text-lg font-bold text-start mb-4 text-colorLight200">Tem certeza que deseja excluir?</Text>
                                        <Text className="text-colorLight200 text-base mb-5">
                                            Você perderá todos os dados vinculados a este personal como treinos, avaliações físicas e outros.
                                        </Text>

                                        <View className="flex-row justify-end gap-x-6">
                                            <TouchableOpacity
                                                onPress={() => setShowModal(false)}

                                            >
                                                <Text className="text-colorViolet font-bold">Cancelar</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={handleExcluirPersonal}
                                                className="flex-row items-center bg-colorViolet rounded-full py-3 justify-center w-40"
                                            >
                                                <Text className="text-red-500 font-bold">Confirmar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                        </>
                    ) : (
                        <View className="items-center justify-center py-10">
                            <Text className="text-colorLight300 text-center">
                                Nenhum personal vinculado no momento.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}