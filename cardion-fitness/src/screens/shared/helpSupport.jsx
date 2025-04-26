import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Linking } from "react-native";

import { ButtonViolet } from "~/components/button";

import { useNavigation } from '@react-navigation/native';

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BackHandler } from "react-native";


export default function HelSupport() {

    const navigation = useNavigation();

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

                    <ButtonViolet
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
        </SafeAreaView>
    );
}