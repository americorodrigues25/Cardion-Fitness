import { View, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, TextInput, Text, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback, useEffect } from "react";
import { useGet } from "~/hook/crud/useGet";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Alunos() {
    const navigation = useNavigation();

    const [alunos, setAlunos] = useState([]);
    const { getAllAlunosByPersonal } = useGet();
    const isFocused = useIsFocused();
    const [busca, setBusca] = useState('');
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    useEffect(() => {
        const termo = busca.toLowerCase();

        const filtrados = alunos.filter((aluno) =>
            aluno.nome?.toLowerCase().includes(termo) ||
            aluno.email?.toLowerCase().includes(termo)
        );

        setAlunosFiltrados(filtrados);
        setPaginaAtual(1); 
    }, [busca, alunos]);

    const fetchAlunos = async () => {
        setCarregando(true);
        const data = await getAllAlunosByPersonal();
        setAlunos(data || []);
        setCarregando(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (isFocused) {
                fetchAlunos();
            }
        }, [isFocused])
    );

    const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);
    const alunosPaginados = alunosFiltrados.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    const mudarPagina = (novaPagina) => {
        if (novaPagina >= 1 && novaPagina <= totalPaginas) {
            setPaginaAtual(novaPagina);
        }
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} className='flex-1 bg-colorBackground px-5 py-2'>
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

                    <View className='flex-row items-center justify-between'>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('~/assets/img/logo/Logo1.png')} className="w-20 h-10" resizeMode="contain" />
                        </View>

                        <View className='flex-row items-center gap-3'>
                            <TouchableOpacity >
                                <FontAwesome name="bell-o" size={20} color="#e4e4e7" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowMessageModal(true)}>
                                <MaterialCommunityIcons name="message-reply-text-outline" size={20} color="#e4e4e7" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='py-20 px-5'>

                        <View className="flex-row justify-between items-center border-b border-colorDark100 px-4 pb-1">
                            <TextInput
                                placeholder="pesquisar"
                                placeholderTextColor="#5d5d5d"
                                returnKeyType="search"
                                autoCapitalize="words"
                                className="flex-1 text-colorLight200 text-lg h-auto"
                                value={busca}
                                onChangeText={setBusca}
                            />
                            <TouchableOpacity>
                                <Ionicons name="search" size={25} color="#E4E4E7" />
                            </TouchableOpacity>
                        </View>

                        <View className="py-10">
                            {carregando ? (
                                <View className="items-center justify-center">
                                    <ActivityIndicator size="large" color="#6943FF" />
                                </View>
                            ) : (
                                alunosPaginados.map((aluno) => (
                                    <TouchableOpacity
                                        key={aluno.id}
                                        onPress={() => navigation.navigate('detalhesAlunos', { aluno })}
                                    >
                                        <Text className="text-colorLight200 text-base bg-colorInputs px-10 py-5 mb-2 rounded-xl border-colorDark100 border">
                                            {aluno.nome || aluno.email}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>

                        {totalPaginas > 1 && (
                            <View className="flex-row justify-center items-center gap-2 mt-5">
                                <TouchableOpacity
                                    onPress={() => mudarPagina(paginaAtual - 1)}
                                    disabled={paginaAtual === 1}
                                    className="px-3 py-1 rounded bg-colorInputs"
                                >
                                    <Text className="text-colorLight200">{'<'}</Text>
                                </TouchableOpacity>

                                {Array.from({ length: totalPaginas }).map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => mudarPagina(index + 1)}
                                        className={`px-3 py-1 rounded ${paginaAtual === index + 1 ? 'bg-colorViolet' : 'bg-colorInputs'}`}
                                    >
                                        <Text className="text-colorLight200">{index + 1}</Text>
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    onPress={() => mudarPagina(paginaAtual + 1)}
                                    disabled={paginaAtual === totalPaginas}
                                    className="px-3 py-1 rounded bg-colorInputs"
                                >
                                    <Text className="text-colorLight200">{'>'}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>

                    <Modal transparent visible={showMessageModal} animationType="fade">
                        <View className="flex-1 justify-center items-center bg-black/80 px-6">
                            <View className="bg-colorDark200 rounded-2xl p-6 w-full max-h-[80%]">

                                {!selectedAluno ? (
                                    <>
                                        <Text className="text-xl font-bold text-center mb-4 text-colorLight200">
                                            Deseja conversar com algum aluno?
                                        </Text>

                                        <TextInput
                                            placeholder="Busque o aluno"
                                            placeholderTextColor="#A1A1AA"
                                            className="bg-colorDark100 text-colorLight200 px-4 py-4 rounded-xl mb-4"
                                            value={busca}
                                            onChangeText={setBusca}
                                        />

                                        {alunos.length === 0 ? (
                                            <Text className="text-center text-colorLight300 mb-4">Nenhum aluno cadastrado ainda.</Text>
                                        ) : (
                                            <ScrollView className="mb-4">
                                                {alunosFiltrados.length === 0 ? (
                                                    <Text className="text-center text-colorLight300">Nenhum aluno encontrado.</Text>
                                                ) : (
                                                    alunosFiltrados.map((aluno, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            className="py-3 px-4 border-b border-colorDark100"
                                                            onPress={() => setSelectedAluno(aluno)}
                                                        >
                                                            <Text className="text-lg text-colorLight300">{aluno.nome}</Text>
                                                        </TouchableOpacity>
                                                    ))
                                                )}
                                            </ScrollView>
                                        )}

                                        <TouchableOpacity
                                            className="bg-colorViolet py-3 rounded-full items-center mt-2"
                                            onPress={() => {
                                                setShowMessageModal(false)
                                                setBusca('')
                                                setSelectedAluno(null)
                                            }}
                                        >
                                            <Text className="text-colorLight200 font-bold">Cancelar</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        {selectedAluno.telefone ? (
                                            <>
                                                <Text className='text-xl font-bold text-center mb-10 text-colorLight200'>
                                                    {selectedAluno.telefone}
                                                </Text>
                                                <Text className="text-xl font-bold text-center mb-10 text-colorLight200">
                                                    Deseja ir para o WhatsApp de {selectedAluno.nome}?
                                                </Text>
                                            </>
                                        ) : (
                                            <Text className="text-xl font-bold text-center mb-10 text-colorLight200">
                                                Nenhum número cadastrado para {selectedAluno.nome}.
                                            </Text>
                                        )}

                                        {selectedAluno.telefone ? (
                                            <View className="flex-row justify-between gap-4">
                                                <TouchableOpacity
                                                    className="flex-1 bg-colorViolet py-3 rounded-full items-center"
                                                    onPress={() => {
                                                        const telefone = selectedAluno.telefone?.replace(/\D/g, '');
                                                        const url = `https://wa.me/55${telefone}`;
                                                        Linking.openURL(url);
                                                        setShowMessageModal(false);
                                                        setSelectedAluno(null);
                                                        setBusca('');
                                                    }}
                                                >
                                                    <Text className="text-white font-bold">Sim</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    className="flex-1 bg-gray-300 py-3 rounded-full items-center"
                                                    onPress={() => setSelectedAluno(null)}
                                                >
                                                    <Text className="text-gray-800 font-bold">Não</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                className="bg-gray-300 py-3 rounded-full items-center"
                                                onPress={() => setSelectedAluno(null)}
                                            >
                                                <Text className="text-gray-800 font-bold">Voltar</Text>
                                            </TouchableOpacity>
                                        )}

                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
