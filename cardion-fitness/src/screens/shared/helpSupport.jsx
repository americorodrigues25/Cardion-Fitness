import { View, Text, TouchableOpacity, Image, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

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
    const [rating, setRating] = useState(4);
    const {avaliar} = useAvaliacao()
    const [comentario,setComentario] =useState()


    const criarAvaliacao = async () =>{
        const user = await getById()
        const nome = user.nome
        
        
        const data = {
            name:nome,
            avaliacao:rating,
            comentario: comentario, 
        }

        const resultado = await avaliar(data)
        if(resultado){
            Alert.alert("Avaliação enviada!")
            setShowModal(false);
        }else{
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
            <View className="pt-5 px-5">
                <TouchableOpacity onPress={() => navigation.openDrawer()} className="flex-row">
                    <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                    <Text className="ml-2 text-colorLight200">Ajuda e Suporte</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 justify-center items-center px-10">
                <Text className="text-center text-colorLight200 text-3xl font-semibold mb-5">
                    Como podemos ajudar?
                </Text>
                <Text className="text-center text-colorLight200 text-xl mb-10">
                    Tire <Text className="font-bold">todas</Text> as suas dúvidas sobre o app e como ele funciona
                </Text>

                <View className="w-full gap-y-7">
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

                    <ButtonViolet
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

                <TouchableOpacity onPress={() => autenticar()} className="mt-20">
                    <Text className="text-red-600 font-bold text-lg">Excluir conta</Text>
                </TouchableOpacity>
            </View>

            <Modal transparent visible={showModal} animationType="slide">
                <View className="flex-1 bg-black/80 justify-center items-center">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full items-center flex-1 justify-center"
                    >
                        <View className="bg-colorDark200 w-10/12 p-5 rounded-2xl">
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
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}