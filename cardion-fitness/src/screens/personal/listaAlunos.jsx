import { View, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, TextInput, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback, useEffect } from "react";
import { useGet } from "~/hook/crud/useGet";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NumerosAlunos from "~/components/modais/numeroAlunos";

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

                    <NumerosAlunos
                        showMessageModal={showMessageModal}
                        setShowMessageModal={setShowMessageModal}
                        alunos={alunos}
                        busca={busca}
                        setBusca={setBusca}
                        selectedAluno={selectedAluno}
                        setSelectedAluno={setSelectedAluno}
                        alunosFiltrados={alunosFiltrados}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
