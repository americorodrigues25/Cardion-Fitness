import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Modal, TextInput,ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useRoute, useFocusEffect } from "@react-navigation/native";

import Entypo from 'react-native-vector-icons/Entypo'

import { useNavigation } from "@react-navigation/native";
import { useGetTreino } from "~/hook/crud/treino/useGetTreino";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function CriarTreino() {
    const navigation = useNavigation();
    const route = useRoute();
    const idAluno = route.params?.idAluno;
    const [dadosTreinos, setDadosTreinos] = useState([]);
    const {getAllTreinosByIdAluno} = useGetTreino()
    const [loading, setLoading] = useState(true);


    useFocusEffect(
        useCallback(() => {

        const carregarTreino = async () => {
        const idAluno = route.params?.idAluno;
        const idPersonal = await AsyncStorage.getItem("uid")

        if (idAluno && idPersonal) {
          const resultado = await getAllTreinosByIdAluno(idAluno, idPersonal);
          console.warn(resultado)
          setDadosTreinos(resultado);
           setLoading(false);   
        }
      };

      carregarTreino();
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

                    {loading ? (
                    <ActivityIndicator size="large" color="#8B5CF6" />
                ) : dadosTreinos.length === 0 ? (
                    <Text className="text-colorLight200 text-center">Nenhum treino encontrado.</Text>
                ) : (
                    dadosTreinos.map((treino, idx) => (
                    <View key={treino.id || idx} className="mb-4 p-4 bg-colorViolet rounded-lg">
                        <Text className="text-colorLight200 font-bold text-lg">
                        {treino.nome /* ex: "Mano" */} 
                        </Text>
                        <Text className="text-colorLight200">Tipo: {treino.tipo}</Text>
                        <Text className="text-colorLight200">Dia: {treino.dia}</Text>
                        <Text className="text-colorLight200 mb-2">
                        Sessões: {treino.sessoes || '–'}
                        </Text>

                        {Array.isArray(treino.exercicios) && treino.exercicios.length > 0 && (
                        <View className="text-colorLight200 font-bold text-lg">
                            <Text className="text-colorLight200 font-bold text-lg">Exercícios:</Text>
                            {treino.exercicios.map((ex, i) => (
                            <Text key={i} className="text-colorLight200">
                                • {ex.nome} — {ex.series}×{ex.repeticoes} (Desc: {ex.descanso}s)
                            </Text>
                            ))}
                        </View>
                        )}
                    </View>
                    ))
                )}

                    <View className="px-10 py-10">
                        <View className="">
                            {/* esta passndo a função onSalvar como parametro */}
                            <TouchableOpacity onPress={() =>
                                navigation.navigate('novoTreino', {
                                    idAluno,
                                 onSalvar: (novo) => {
                                    setDadosTreinos(prev => [
                                        ...prev,
                                        {
                                        id: novo.id,
                                        nome: novo.nome,
                                        tipo: novo.tipo,
                                        dia: novo.dia,
                                        sessoes: novo.sessoes,
                                        exercicios: novo.exercicios || [],
                                        }
                                    ]);
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