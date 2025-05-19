import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useGetTreino } from '~/hook/crud/treino/useGetTreino';
import { getAuth } from 'firebase/auth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { gerarPdfTreinos } from '~/utils/gerarPdfTreinos';
import { useGet } from '~/hook/crud/useGet';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import * as Progress from 'react-native-progress';

export default function TreinosAluno() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const { getAllTreinosByIdAluno } = useGetTreino();
    const [dadosTreinos, setDadosTreinos] = useState([]);
    const {getById, getPersonalDoAluno} = useGet()
    const [nome,setNome] = useState()
    const [nomePersonal,setNomePersonal] = useState()

    useFocusEffect(
        useCallback(() => {
            const fetchTreinos = async () => {
                try {
                    setLoading(true);
                    const user = getAuth().currentUser;
                    if (user) {
                        const idAluno = user.uid;
                        const dados = await getAllTreinosByIdAluno(idAluno);
                        setDadosTreinos(dados);
                    }
                } catch (error) {
                    console.error("Erro ao buscar treinos:", error);
                } finally {
                    setLoading(false);
                }
            };

            const fetchAluno = async () =>{
                    const user = await getById()
                    setNome(user.nome)
                
            }

            const fetchNomePersonal = async () => {
                const personal = await getPersonalDoAluno()
                setNomePersonal(personal.nome)
            }
            fetchTreinos();

            fetchAluno();

            fetchNomePersonal();
        }, [])
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-colorBackground justify-center items-center">
                <ActivityIndicator size="large" color="#6943FF" />
                <Text className="mt-4 text-base text-colorLight200">Carregando treinos...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className='flex-1 bg-colorBackground'
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="pt-5 px-5 flex-row justify-between">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Meus treinos</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="py-10 px-5">
                        <View className='flex-row justify-between items-center'>
                            <Text className="text-2xl font-bold mb-4 text-colorLight200">Meus Treinos</Text>
                            <View>
                                <Text className="text-lg font-bold text-colorLight200">Personal </Text>
                                { /*trazer nome do personal vinculado*/}
                                <Text className="text-lg mb-4 text-gray-400">{nomePersonal} </Text>
                            </View>
                        </View>

                        {dadosTreinos.length === 0 ? (
                            <Text className="text-center mt-5 text-colorLight200">Nenhum treino encontrado.</Text>
                        ) : (
                            dadosTreinos.map((treino, idx) => (
                                <TouchableOpacity
                                    key={treino.id || idx}
                                    onPress={() => navigation.navigate('TreinoDetalhado', { treino })}
                                    className="bg-colorDark100 p-4 rounded-xl shadow mb-3"
                                >

                                    <View className="flex-row justify-between items-center">

                                        <Text className="text-colorViolet font-bold text-3xl">{treino.nome.slice(-1)}</Text>

                                        <View className="flex-1 px-4">
                                            <Text className="text-colorViolet font-bold">Grupos Musculares</Text>
                                            <Text className="text-gray-400">{treino.tipo}</Text>
                                        </View>

                                        <View className="items-center self-start">
                                            <Text className="text-colorViolet font-bold">{treino.dia}</Text>
                                        </View>
                                    </View>

                                    <View className=' px-5'>
                                        <View className="flex-row items-center mt-5 mb-2">
                                            <View className='flex-row justify-center items-center'>
                                                <View className='bg-colorViolet p-2 rounded-full'>
                                                    < FontAwesome5 name='dumbbell' size={15} color='#E4E4E7' />
                                                </View>
                                                <View className='ml-3'>
                                                    <Text className="text-gray-400 text-lg mb-1">Sessões realizadas</Text>
                                                    <Text className="text-colorViolet text-2xl">
                                                        {treino.sessoesRealizadas?.qtd ?? 0}
                                                        <Text className="text-gray-400 text-base"> / {treino.sessoes ?? 0}</Text>
                                                    </Text>
                                                </View>


                                            </View>
                                        </View>

                                        <Progress.Bar
                                            progress={(treino.sessoesRealizadas?.qtd ?? 0) / (treino.sessoes || 1)}
                                            width={null}
                                            height={10}
                                            color="#7c3aed"
                                            unfilledColor="#e5e5e5"
                                            borderWidth={0}
                                            borderRadius={5}
                                            animated
                                        />
                                    </View>

                                </TouchableOpacity>

                            ))
                        )}
                    </View>
                    <View className='px-20'>
                        <TouchableOpacity
                            onPress={() => gerarPdfTreinos(dadosTreinos,nome)}
                            className="bg-colorViolet py-3 rounded-full">
                            <Text className="text-colorLight200 text-center text-lg font-bold">Baixar Treino</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
