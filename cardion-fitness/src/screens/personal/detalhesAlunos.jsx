import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Image, imageUrl, TextInput, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import Toast from "react-native-toast-message";

import { getAuth } from 'firebase/auth';

import { useVinculo } from '~/hook/crud/vincularAlunos/vincularAluno';

import { useCreateAnotacoes } from "~/hook/crud/anotacoes/useCreateAnotacoes";

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

import axios from 'axios';

import { SERVER_URL } from '~/apiConfig/config';

export default function DetalhesAlunos() {
    const navigation = useNavigation();
    const route = useRoute();
    const [showModal, setShowModal] = useState(false);
    const { aluno } = route.params || {};
    const [imageUrl, setImageUrl] = useState()
    const [anotacao, setAnotacao] = useState()
    const [anotacaoOriginal, setAnotacaoOriginal] = useState('');
    const { criarAnotacoes } = useCreateAnotacoes();

    const { desvincularAluno } = useVinculo();

    const handleExcluirAluno = async () => {
        try {
            await desvincularAluno(aluno.id);
            setShowModal(false);

            Toast.show({
                type: 'success',
                text1: 'Aluno desvinculado com sucesso ✅',
            });

            setTimeout(() => {
                navigation.goBack();
            }, 100);

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao desvincular ❌',
                text2: error.message,
            });
        }
    };


    useEffect(() => {
        const fetchNome = async () => {
            await trazerDadosPersonal();
        };

        const fetchImage = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            const token = await user.getIdToken();
            const res = await axios.get(`${SERVER_URL}/image/${aluno.id}`, { headers: { 'Authorization': `Bearer ${token}` } });

            setImageUrl(`${res.data.url}?${Date.now()}`);
        };

        fetchImage();
        fetchNome();
        setAnotacao(aluno.anotacao)
        setAnotacaoOriginal(aluno.anotacao)
    }, []);

    const handleSalvar = async () => {
        await criarAnotacoes(aluno.uid, anotacao)
        setAnotacaoOriginal(anotacao)
    }
    const houveMudanca = anotacao !== anotacaoOriginal;

    if (!aluno) {
        return (
            <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        bounces={false}
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <View className="pt-5 px-5">
                            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                                <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                                <Text className="ml-2 text-colorLight200">Alunos</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-1 items-center justify-center">
                            <Text className="text-colorLight200">Erro: Nenhum aluno encontrado.</Text>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >

                    <View className="pt-5 px-5">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Alunos</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="px-10 py-10">

                        <View className="">
                            <View className="flex-row items-center">
                                <Image
                                    key={imageUrl}
                                    source={imageUrl ? { uri: imageUrl } : require('~/assets/img/imgProfileDefault.png')}
                                    resizeMode="cover"
                                    className="w-20 h-20 rounded-full"
                                />
                                <View>
                                    <Text className="text-colorLight200 text-xl font-bold pl-5">{aluno.nome} {aluno.sobrenome}</Text>
                                </View>
                            </View>
                        </View>

                        <View className="py-10 gap-y-5">
                            <TouchableOpacity
                                onPress={() => navigation.navigate('criarTreinos', { idAluno: aluno.id })}
                                className="flex-row items-center">
                                <FontAwesome6
                                    name="dumbbell" size={25} color="#E4E4E7"
                                />
                                <Text className="text-colorLight200 font-bold text-base pl-3">Treinos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Avaliacoes', { idAluno: aluno.id })}
                                className="flex-row items-center">
                                <FontAwesome5 name="clipboard-list" size={25} color="#E4E4E7" />
                                <Text className="text-colorLight200 font-bold text-base pl-3">Avaliação</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-colorLight200 font-bold mb-2">Feedback</Text>
                            <TextInput
                                multiline
                                textAlignVertical="center"
                                className="bg-colorInputs w-full h-40 rounded-2xl border border-colorDark100 text-colorLight200 text-base p-5"
                                onChangeText={setAnotacao}
                                value={anotacao}
                            />

                            {houveMudanca && (
                                <TouchableOpacity
                                    onPress={handleSalvar}
                                    className="bg-colorViolet py-3 px-6 rounded-full mt-3"
                                >
                                    <Text className="text-white font-bold text-center">Salvar</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View className=" pt-10 items-center">
                            <TouchableOpacity
                                onPress={() => setShowModal(true)}
                                className="flex-row items-center bg-colorViolet rounded-full py-3 justify-center w-40"
                            >
                                <Text className="text-colorLight200 text-base font-semibold text-center">
                                    Excluir aluno
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <Modal
                        transparent
                        visible={showModal}
                        animationType="fade"
                        onRequestClose={() => setShowModal(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/80 px-6">
                            <View className="bg-colorDark100 rounded-2xl w-full p-6">
                                <Text className="text-colorLight200 text-lg font-bold mb-4">Deseja mesmo excluir este aluno?</Text>

                                <View className="flex-row justify-end gap-x-6">
                                    <TouchableOpacity onPress={() => setShowModal(false)}>
                                        <Text className="text-colorViolet text-lg font-semibold">Cancelar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleExcluirAluno}>
                                        <Text className="text-red-600 font-semibold text-lg">Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}