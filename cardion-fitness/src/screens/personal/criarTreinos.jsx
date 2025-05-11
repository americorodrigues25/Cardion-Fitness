import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Modal, TextInput } from "react-native";
import { useState, useCallback } from "react";
import { useRoute, useFocusEffect } from "@react-navigation/native";

import Entypo from 'react-native-vector-icons/Entypo'

import { useNavigation } from "@react-navigation/native";


export default function CriarTreino() {
    const navigation = useNavigation();
    const route = useRoute();
    const idAluno = route.params?.idAluno;
    const [dadosTreinos, setDadosTreinos] = useState({});


    useFocusEffect(
        useCallback(() => {
            if (route.params?.novoTreino) {
                const novo = route.params.novoTreino;
                setDadosTreinos(prev => ({
                    ...prev,
                    [novo.nome || `Treino ${Object.keys(prev).length + 1}`]: {
                        tipo: novo.tipo,
                        dia: novo.dia,
                        sessoes: novo.sessoes,
                        realizadas: 0
                    }
                }));
            }
        }, [route.params?.novoTreino])
    );

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
                            <Text className="ml-2 text-colorLight200">Detallhes aluno</Text>
                        </TouchableOpacity>
                    </View>

                    { /* aqui ta trazendo os dados salvos na tela novoTreino */}
                    {Object.entries(dadosTreinos).map(([nome, treino], index) => (
                        <View key={index} className="mb-4 p-4 bg-colorViolet rounded-lg">
                            <Text className="text-colorLight200 font-bold">{nome}</Text>
                            <Text className="text-colorLight200">{treino.tipo}</Text>
                            <Text className="text-colorLight200">{treino.dia}</Text>
                            <Text className="text-colorLight200">Sessões: {treino.sessoes}</Text>
                        </View>
                    ))}

                    <View className="px-10 py-10">
                        <View className="">
                            {/* esta passndo a função onSalvar como parametro */}
                            <TouchableOpacity onPress={() =>
                                navigation.navigate('novoTreino', {
                                    idAluno,
                                    onSalvar: (novo) => {
                                        setDadosTreinos(prev => ({
                                            ...prev,
                                            [novo.nome || `Treino ${Object.keys(prev).length + 1}`]: {
                                                tipo: novo.tipo,
                                                dia: novo.dia,
                                                sessoes: novo.sessoes,
                                                realizadas: 0
                                            }
                                        }));
                                    }
                                })
                            } className="flex-row items-center bg-colorViolet rounded-xl py-3 justify-center">
                                <View className="flex-row items-center">
                                    <Entypo name="plus" size={20} color='#E4E4E7' />
                                    <Text className="text-colorLight200 text-base font-semibold text-center">Criar novo treino</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}