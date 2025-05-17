import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Modal, TextInput, ActivityIndicator, Alert } from "react-native";
import { useState, useCallback } from "react";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo'
import * as Progress from 'react-native-progress';
import { useGetTreino } from "~/hook/crud/treino/useGetTreino";
import { useDeleteTreino } from "~/hook/crud/treino/useDeleteTreino";
import { useEditTreino } from "~/hook/crud/treino/useEditTreino";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function CriarTreino() {
    const navigation = useNavigation();
    const route = useRoute();
    const idAluno = route.params?.idAluno;
    const [dadosTreinos, setDadosTreinos] = useState([]);
    const { getAllTreinosByIdAluno } = useGetTreino();
    const { deletarTreinoAluno } = useDeleteTreino();
    const [loading, setLoading] = useState(true);
    const [expandedTreinos, setExpandedTreinos] = useState({});

    const { EditarTreinoAluno } = useEditTreino();

    const [modalVisible, setModalVisible] = useState(false);
    const [treinoEditando, setTreinoEditando] = useState(null);

    const [treinoSelecionado, setTreinoSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const handleEditarTreino = async () => {
        if (!treinoEditando?.id) {
            Toast.show({
                type: 'error',
                text1: 'ID do treino não encontrado',
            });
            return;
        }

        if (!treinoEditando.exercicios || treinoEditando.exercicios.length === 0) {
            Alert.alert('Erro', 'Não é possível salvar o treino sem exercícios adicionados.')
            return;
        }

        try {
            const resultado = await EditarTreinoAluno(treinoEditando.id, treinoEditando);
            if (resultado) {
                setDadosTreinos((prev) =>
                    prev.map((t) => (t.id === treinoEditando.id ? treinoEditando : t))
                );
                setModalVisible(false);
                Toast.show({
                    type: 'success',
                    text1: 'Treino editado com sucesso! 🎉',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Falha ao editar treino.',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: `Erro ao editar treino: ${error.message}`,
            });
        }
    };

    const toggleExpand = (id) => {
        setExpandedTreinos((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleDeleteTreino = async (treinoId) => {
        const result = await deletarTreinoAluno(treinoId);
        if (result) {
            setDadosTreinos((prev) => prev.filter((treino) => treino.id !== treinoId));
        }
    };

    useFocusEffect(
        useCallback(() => {
            const carregarTreino = async () => {
                const idAluno = route.params?.idAluno;
                const idPersonal = await AsyncStorage.getItem("uid");

                if (idAluno && idPersonal) {
                    const resultado = await getAllTreinosByIdAluno(idAluno, idPersonal);
                    console.warn(resultado);
                    setDadosTreinos(resultado);
                    setLoading(false);
                }
            };

            carregarTreino();
        }, [route.params?.novoTreino])
    );

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
                            <Text className="ml-2 text-colorLight200">Editar treino</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#6943FF" className="mt-10" />
                    ) : dadosTreinos.length === 0 ? (
                        <Text className="text-colorLight200 text-center mt-10">Nenhum treino encontrado.</Text>
                    ) : (
                        dadosTreinos.map((treino, idx) => (

                            <TouchableOpacity
                                key={treino.id || idx}
                                onPress={() => toggleExpand(treino.id || idx)}
                                className="mb-2 mx-4 p-4 rounded-lg border-b border-colorDark100"
                            >
                                <View className="flex-row justify-between items-center p-2">
                                    <Text className="text-white font-bold text-xl">
                                        {treino?.nome ?? 'Sem nome'}
                                    </Text>

                                    <AntDesign
                                        name={expandedTreinos[treino?.id ?? idx] ? "up" : "down"}
                                        size={15}
                                        color="#E4E4E7"
                                    />
                                </View>

                                <View className="w-full mt-2">
                                    <View className='ml-5'>
                                        <Text className='text-colorLight300 text-xl mb-1'>Sessões realizadas</Text>
                                        <Text className="text-colorViolet text-3xl">

                                            {treino.sessoesRealizadas?.qtd ?? 0}
                                            <Text className="text-gray-500 text-xl"> / {treino.sessoes ?? 0}</Text>
                                        </Text>

                                    </View>
                                    <Progress.Bar
                                        progress={
                                            (treino.sessoesRealizadas?.qtd ?? 0) / (treino.sessoes || 1)
                                        }
                                        width={null}
                                        height={10}
                                        color="#6943FF"
                                        unfilledColor="#eee"
                                        borderWidth={0}
                                        borderRadius={5}
                                        animated={true}
                                        animationType="spring"
                                        animationDuration={500}
                                    />
                                </View>

                                {expandedTreinos[treino.id || idx] &&
                                    Array.isArray(treino.exercicios) &&
                                    treino.exercicios.length > 0 && (
                                        <View className="mt-4 gap-y-1">
                                            <Text className="text-colorLight200 text-base">Grupo Muscular: {treino.tipo}</Text>
                                            <Text className="text-colorLight200 text-base">{treino.dia}</Text>
                                            <Text className="text-colorLight200 text-base mb-2">
                                                Sessões de treino: {treino.sessoes}
                                            </Text>
                                            <Text className="text-colorLight200 font-bold text-lg mb-2">Exercícios:</Text>
                                            {treino.exercicios.map((ex, index) => (
                                                <View key={index} className="border border-gray-700 rounded-xl p-5 mb-2">

                                                    <View className="flex-row justify-between items-center">
                                                        <Text className="text-colorLight200 text-lg font-bold">{ex.nome}</Text>
                                                    </View>

                                                    <View className="flex-row justify-between pt-2">
                                                        <View>
                                                            <Text className="text-gray-500 text-base">Carga</Text>
                                                            <Text className="text-colorLight200 text-base">{ex.carga || '–'} Kg</Text>
                                                        </View>
                                                        <View>
                                                            <Text className="text-gray-500 text-base">Séries</Text>
                                                            <Text className="text-colorLight200 text-base">{ex.series} x {ex.repeticoes}</Text>
                                                        </View>
                                                        <View>
                                                            <Text className="text-gray-500 text-base">Descanso</Text>
                                                            <Text className="text-colorLight200 text-base">{ex.descanso} s</Text>
                                                        </View>
                                                    </View>

                                                    {ex.observacao ? (
                                                        <View className="pt-2">
                                                            <Text className="text-gray-500 text-base">Observações</Text>
                                                            <Text className="text-colorLight200 text-base">{ex.observacao}</Text>
                                                        </View>
                                                    ) : null}
                                                </View>
                                            ))}

                                            <View className="flex-row mt-5 gap-x-2 justify-between items-center mx-14">
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setTreinoEditando(treino);
                                                        setModalVisible(true);
                                                    }}
                                                    className=""
                                                >
                                                    <View className="flex-row items-center gap-x-1">
                                                        <Feather name="refresh-ccw" size={20} color="#E4E4E7" />
                                                        <Text className="text-colorLight200 ml-1">Atualizar</Text>
                                                    </View>
                                                </TouchableOpacity>


                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setTreinoSelecionado(treino.id || idx);
                                                        setMostrarModal(true);
                                                    }}
                                                >
                                                    <View className="flex-row items-center gap-x-1">
                                                        <Feather name="trash-2" size={20} color="#E4E4E7" />
                                                        <Text className="text-colorLight200">Deletar</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}


                            </TouchableOpacity>

                        ))
                    )}

                    <View className="p-10">
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("novoTreino", {
                                    idAluno,
                                    onSalvar: (novo) => {
                                        setDadosTreinos((prev) => [
                                            ...prev,
                                            {
                                                id: novo.id,
                                                nome: novo.nome,
                                                tipo: novo.tipo,
                                                dia: novo.dia,
                                                sessoes: novo.sessoes,
                                                exercicios: novo.exercicios || [],
                                            },
                                        ]);
                                    },
                                })
                            }
                            className="flex-row items-center bg-colorViolet rounded-full py-3 justify-center"
                        >
                            <View className="flex-row items-center gap-x-1">
                                <Entypo name="plus" size={20} color="#E4E4E7" />
                                <Text className="text-colorLight200 text-base font-semibold">Criar novo treino</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={false}
                        presentationStyle="fullScreen"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/80">
                            <ScrollView className="bg-colorBackground w-full h-full">
                                <View className="p-5">
                                    <Text className="text-xl font-bold mb-2 text-colorLight200">Editar Treino</Text>

                                    <TextInput
                                        value={treinoEditando?.nome}
                                        onChangeText={(text) => setTreinoEditando((prev) => ({ ...prev, nome: text }))}
                                        placeholder="Nome"
                                        className="border border-colorDark100 px-3 py-5 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                    />
                                    <TextInput
                                        value={treinoEditando?.tipo}
                                        onChangeText={(text) => setTreinoEditando((prev) => ({ ...prev, tipo: text }))}
                                        placeholder="Tipo"
                                        className="border border-colorDark100 px-3 py-5 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                    />
                                    <TextInput
                                        value={treinoEditando?.dia}
                                        onChangeText={(text) => setTreinoEditando((prev) => ({ ...prev, dia: text }))}
                                        placeholder="Dia"
                                        className="border border-colorDark100 px-3 py-5 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                    />

                                    {/* aq é a lista de exercícios */}
                                    <Text className="font-bold text-colorLight200 text-xl mb-2">Exercícios adicionados</Text>
                                    {treinoEditando?.exercicios?.map((ex, index) => (
                                        <View key={index} className="mb-4 border border-colorDark100 rounded-xl p-5">
                                            <TextInput
                                                value={ex.nome}
                                                onChangeText={(text) => {
                                                    const newEx = [...treinoEditando.exercicios];
                                                    newEx[index].nome = text;
                                                    setTreinoEditando((prev) => ({ ...prev, exercicios: newEx }));
                                                }}
                                                placeholder="Nome do exercício"
                                                placeholderTextColor="#D4D4D8"
                                                className="border border-colorDark100 p-3 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                            />
                                            <TextInput
                                                value={ex.carga}
                                                onChangeText={(text) => {
                                                    const newEx = [...treinoEditando.exercicios];
                                                    newEx[index].carga = text;
                                                    setTreinoEditando((prev) => ({ ...prev, exercicios: newEx }));
                                                }}
                                                placeholder="Carga"
                                                placeholderTextColor="#D4D4D8"
                                                keyboardType="numeric"
                                                className="border border-colorDark100 p-3 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                            />
                                            <TextInput
                                                value={ex.series}
                                                onChangeText={(text) => {
                                                    const newEx = [...treinoEditando.exercicios];
                                                    newEx[index].series = text;
                                                    setTreinoEditando((prev) => ({ ...prev, exercicios: newEx }));
                                                }}
                                                placeholder="Séries"
                                                placeholderTextColor="#D4D4D8"
                                                keyboardType="numeric"
                                                className="border border-colorDark100 p-3 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                            />
                                            <TextInput
                                                value={ex.repeticoes}
                                                onChangeText={(text) => {
                                                    const newEx = [...treinoEditando.exercicios];
                                                    newEx[index].repeticoes = text;
                                                    setTreinoEditando((prev) => ({ ...prev, exercicios: newEx }));
                                                }}
                                                placeholder="Repetições"
                                                placeholderTextColor="#D4D4D8"
                                                keyboardType="numeric"
                                                className="border border-colorDark100 p-3 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                            />
                                            <TextInput
                                                value={ex.descanso}
                                                onChangeText={(text) => {
                                                    const newEx = [...treinoEditando.exercicios];
                                                    newEx[index].descanso = text;
                                                    setTreinoEditando((prev) => ({ ...prev, exercicios: newEx }));
                                                }}
                                                placeholder="Descanso (s)"
                                                placeholderTextColor="#D4D4D8"
                                                keyboardType="numeric"
                                                className="border border-colorDark100 p-3 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                            />
                                            <TextInput
                                                value={ex.observacao}
                                                onChangeText={(text) => {
                                                    const newEx = [...treinoEditando.exercicios];
                                                    newEx[index].observacao = text;
                                                    setTreinoEditando((prev) => ({ ...prev, exercicios: newEx }));
                                                }}
                                                placeholder="Observação"
                                                placeholderTextColor="#D4D4D8"
                                                className="border border-colorDark100 p-3 rounded-lg text-colorLight200 mb-2 bg-colorInputs"
                                            />

                                            <TouchableOpacity
                                                onPress={() => {
                                                    const newEx = [...treinoEditando.exercicios];
                                                    newEx.splice(index, 1);
                                                    setTreinoEditando((prev) => ({ ...prev, exercicios: newEx }));
                                                }}
                                                className="mt-2"
                                            >
                                                <Text className="text-colorLight200 font-bold underline text-center">Remover exercicio</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}


                                    <TouchableOpacity
                                        onPress={() => {
                                            setTreinoEditando((prev) => ({
                                                ...prev,
                                                exercicios: [
                                                    ...(prev.exercicios || []),
                                                    {
                                                        nome: "",
                                                        series: "",
                                                        repeticoes: "",
                                                        descanso: "",
                                                        observacao: "",
                                                    },
                                                ],
                                            }));
                                        }}
                                        className="mb-4 bg-colorViolet py-2 rounded-full"
                                    >
                                        <View className="flex-row justify-center items-center gap-x-1">
                                            <Entypo name="plus" size={20} color="#E4E4E7" />
                                            <Text className="text-colorLight200 text-base font-semibold">Adicionar exercício</Text>
                                        </View>
                                    </TouchableOpacity>


                                    <View className="flex-row gap-x-2 justify-between items-center mx-20 py-2">
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text className="text-colorLight200 font-bold text-lg">Cancelar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={handleEditarTreino}
                                        >
                                            <Text className="text-colorViolet font-bold text-lg">Salvar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </Modal>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={mostrarModal}
                        onRequestClose={() => setMostrarModal(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/80 px-6">
                            <View className="bg-colorDark100 rounded-2xl w-full p-6">
                                <Text className="text-colorLight200 text-lg font-bold mb-4">
                                    Deseja realmente deletar este treino?
                                </Text>

                                <View className="flex-row justify-end gap-x-10">
                                    <TouchableOpacity
                                        onPress={() => setMostrarModal(false)}
                                    >
                                        <Text className="text-colorViolet text-lg font-semibold">Cancelar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={async () => {
                                            await handleDeleteTreino(treinoSelecionado);
                                            setMostrarModal(false);
                                        }}
                                    >
                                        <Text className="text-red-600 font-semibold text-lg">Deletar</Text>
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
