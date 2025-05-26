import { View, Text, TouchableOpacity, Image, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from "react-native-toast-message";

import { Linking } from "react-native";
import { ButtonViolet } from "~/components/button";
import { useNavigation } from '@react-navigation/native';

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BackHandler } from "react-native";

//### aq referente a biometria e facial
import * as LocalAuthentication from 'expo-local-authentication';
import { useDelete } from '~/hook/crud/useDelete';
import { useGet } from '~/hook/crud/useGet';
import { useAvaliacao } from "~/hook/crud/avaliacao/useAvaliacao";

export default function HelSupport() {
    const navigation = useNavigation();
    const { getById } = useGet();
    const { deleteAccount } = useDelete();
    const [showModal, setShowModal] = useState(false);
    const [showModalQuestions, setShowModalQuestions] = useState(false)
    const [rating, setRating] = useState(4);
    const { avaliar } = useAvaliacao()
    const [comentario, setComentario] = useState()
    const [openIndex, setOpenIndex] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const faqData = [
        {
            question: 'Como entro em contato com o meu personal?',
            answer: 'Nós disponibilizamos o contato dos personais na área do perfil.',
        },
        {
            question: 'Preciso pagar algo para usar o aplicativo?',
            answer: 'Não, o aplicativo é gratuito para uso.',
        },
        {
            question: 'O aplicativo disponibiliza dietas?',
            answer: 'Sim, algumas dietas estão disponíveis com base no seu perfil.',
        },
        {
            question: 'Como faço para adicionar um personal?',
            answer: 'Vá até a aba de "Personal" e clique em "Adicionar".',
        },
        {
            question: 'Como faço para adicionar um aluno?',
            answer: 'Na aba "Alunos", clique em "+ Adicionar aluno".',
        },
        {
            question: 'É possível adicionar quantos alunos?',
            answer: 'Não há limite de alunos cadastrados.',
        },
        {
            question: 'Tenho limite de alunos adicionados?',
            answer: 'Não, você pode adicionar quantos alunos quiser.',
        },
        {
            question: 'Como faço para adicionar um treino?',
            answer: 'Na seção "Treinos", clique em "Novo treino" e preencha os dados.',
        },
    ];

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const onClose = () => {
        setShowModalQuestions(false);
    };

    const criarAvaliacao = async () => {
        Alert.alert("cheguei aqui")
        const user = await getById()
        const nome = user.nome


        const data = {
            name: nome,
            avaliacao: rating,
            comentario: comentario,
        }

        const resultado = await avaliar(data)
        if (resultado) {
             Toast.show({
                                type: 'success',
                                text1: `Avaliação enviada!`,
                                position: 'top',
                            });
            setShowModal(false);
        } else {
            Alert.alert("Erro")
            setShowModal(false);
        }

    }

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

    function abrirWhatsapp() {
        const phoneNumber = "5511964166962";
        const message = "Olá, preciso de ajuda com o app.";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        Linking.openURL(url).catch(() => {
            Alert.alert("Erro", "Não foi possível abrir o WhatsApp");
        })
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView bounces={false} overScrollMode="never" contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="pt-5 px-5">
                        <TouchableOpacity onPress={() => navigation.openDrawer()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                            <Text className="ml-2 text-colorLight200">Ajuda e Suporte</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 justify-center items-center px-10 py-10">
                        <Text className="text-center text-colorLight200 text-3xl font-semibold mb-5">
                            Como podemos ajudar?
                        </Text>
                        <Text className="text-center text-colorLight200 text-xl">
                            Tire <Text className="font-bold">todas</Text> as suas dúvidas sobre o app e como ele funciona
                        </Text>

                        <View className="w-full gap-y-7 py-10">
                            <TouchableOpacity
                                className="flex-row items-center justify-center rounded-full py-[20px] px-[30px] w-full"
                                onPress={abrirWhatsapp}
                                style={{
                                    backgroundColor: '#0ab248',
                                    shadowColor: '#0ab248',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12,
                                }}>
                                <Image
                                    source={require('~/assets/img/redeSocial/whatsapp.png')}
                                    className="w-7 h-7"
                                    resizeMode="contain"
                                />
                                <Text className="text-colorLight200 font-bold text-lg ml-2 text-center">Peça ajuda no WhatsApp!</Text>
                            </TouchableOpacity>

                            <ButtonViolet onPress={() => setShowModalQuestions(true)}
                                style={{
                                    shadowColor: '#6943FF',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12,
                                }}>
                                <Text className="text-colorLight200 font-bold text-lg text-center">Perguntas frequentes</Text>
                            </ButtonViolet>

                            <ButtonViolet
                                style={{
                                    shadowColor: '#6943FF',
                                    shadowOffset: 0,
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12
                                }}>
                                <Text className="text-colorLight200 font-bold text-lg text-center">Sobre</Text>
                            </ButtonViolet>

                            <ButtonViolet onPress={() => setShowModal(true)}
                                style={{
                                    shadowColor: '#6943FF',
                                    shadowOffset: 0,
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12
                                }}>
                                <Text className="text-colorLight200 font-bold text-lg text-center">Avaliação</Text>
                            </ButtonViolet>

                        </View>

                        <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
                            <Text className="text-red-600 font-bold text-lg">Excluir conta</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Modal de avaliar o app */}
                    <Modal transparent visible={showModal} animationType="slide">
                        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                            <View className="flex-1 bg-black/80 justify-center items-center">
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                                    className="w-full items-center flex-1 justify-center"
                                >
                                    <TouchableWithoutFeedback onPress={() => { }}>
                                        <View className="bg-colorDark200 w-[85%] p-5 rounded-2xl">
                                            <Text className="text-colorLight200 font-bold text-xl text-center mb-5">DEIXE SUA AVALIAÇÃO</Text>
                                            <Text className="text-colorLight200 text-center mb-4">Como estamos nos saindo?</Text>

                                            <View className="flex-row justify-center mb-5">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <TouchableOpacity key={i} onPress={() => setRating(i)}>
                                                        <FontAwesome
                                                            name={i <= rating ? "star" : "star-o"}
                                                            size={32}
                                                            color="#e6a800"
                                                            style={{ marginHorizontal: 8 }}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>

                                            <TextInput
                                                placeholder="Comentar..."
                                                placeholderTextColor="#525252"
                                                className="bg-colorInputs text-colorLight200 p-3 rounded-xl mb-5 h-24"
                                                multiline
                                                value={comentario}
                                                onChangeText={setComentario}
                                            />

                                            <TouchableOpacity
                                                onPress={() => {
                                                    criarAvaliacao()
                                                }}
                                                className="bg-colorViolet p-4 rounded-full mx-10"
                                            >
                                                <Text className="text-white font-bold text-center">ENVIAR</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    {/* Modal de perguntas frequentes */}
                    <Modal transparent visible={showModalQuestions} animationType="slide">
                        <TouchableWithoutFeedback onPress={() => setShowModalQuestions(false)}>
                            <View className="flex-1 bg-black/80 justify-center items-center">
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                                    className="w-full items-center flex-1 justify-center"
                                >
                                    <TouchableWithoutFeedback onPress={() => { }}>
                                        <View className="bg-colorDark200 w-[85%] max-h-[80%] rounded-2xl p-5">
                                            <Text className="text-colorLight200 text-xl font-bold text-center mb-5">
                                                PRECISA DE AJUDA?
                                            </Text>

                                            <ScrollView showsVerticalScrollIndicator={false} className="mb-2">
                                                {faqData.map((item, index) => (
                                                    <View key={index} className="border-b border-[#333] py-2.5">
                                                        <TouchableOpacity
                                                            onPress={() => toggleQuestion(index)}
                                                            className="flex-row justify-between items-center"
                                                        >
                                                            <Text className="text-colorLight200 text-base flex-1 pr-2.5">
                                                                {item.question}
                                                            </Text>
                                                            <AntDesign
                                                                name={openIndex === index ? 'minuscircleo' : 'pluscircleo'}
                                                                size={16}
                                                                color="#6943FF"
                                                            />
                                                        </TouchableOpacity>

                                                        {openIndex === index && (
                                                            <Text className="text-gray-400 text-sm mt-2">{item.answer}</Text>
                                                        )}
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    { /*Modal excluir conta */}
                    {showDeleteModal && (
                        <Modal transparent animationType="fade" visible={showDeleteModal}>

                            <View className="flex-1 justify-center items-center bg-black/80 px-8">
                                <View className="bg-white rounded-2xl p-6 w-full">
                                    <Text className="text-xl font-bold text-center mb-4 text-red-600">
                                        Tem certeza que deseja excluir sua conta?
                                    </Text>

                                    <Text className="text-center text-colorDark100 mb-6">
                                        Sua conta será excluída permanentemente. Você pode se arrepender depois. Deseja mesmo continuar?
                                    </Text>

                                    <View className="flex-row justify-between gap-x-4">
                                        <TouchableOpacity
                                            className="flex-1 bg-red-600 py-3 rounded-full items-center"
                                            onPress={async () => {
                                                setShowDeleteModal(false);
                                                await autenticar();
                                            }}
                                        >
                                            <Text className="text-white font-bold">Sim, Excluir</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="flex-1 bg-gray-300 py-3 rounded-full items-center"
                                            onPress={() => setShowDeleteModal(false)}
                                        >
                                            <Text className="text-gray-800 font-bold">Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}