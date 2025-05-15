import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo'

import { useNavigation, useRoute } from '@react-navigation/native';

import { GerarPdfAvaliacao } from '~/utils/gerarPdfAvaliacao';

export default function AvaliacaoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    console.log('params recebidos:', route.params);
    const { idAluno } = route.params || {};
    console.log('idAluno:', idAluno);

    const handleAvaliacao = (avaliacao) => {
        navigation.navigate('DetalhesAvaliacao', { avaliacao });
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
                        <Text className="text-center text-gray-500">Nenhuma avaliação registrada.</Text>

                        {/* cards q será exibido a avaliação criada (Avaliação - Data: DD/MM/AAAA) - ao clicar, abrir a tela detalhes da avaliação */}
                        <TouchableOpacity
                            onPress={() => handleAvaliacao()}
                            className="bg-gray-100 p-4 rounded-xl mb-3"
                        >
                            <Text>Avaliações</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            className="flex-row items-center bg-colorViolet rounded-full py-3 justify-center"
                            onPress={() => navigation.navigate('CriarAvaliacao', { idAluno })}
                        >
                            <View className="flex-row items-center gap-x-1">
                                <Entypo name="plus" size={20} color="#E4E4E7" />
                                <Text className="text-colorLight200 text-base font-semibold">Criar novo treino</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center bg-red-500 rounded-full py-3 justify-center mt-10"
                        >
                            <View className="text-center">
                                <Text className="text-colorLight200 text-base font-semibold">Gerar PDF</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}
