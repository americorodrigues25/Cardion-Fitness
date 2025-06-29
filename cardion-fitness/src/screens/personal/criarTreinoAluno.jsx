import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect, useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import HeaderAppBack from "~/components/header/headerAppBack";

import { useGet } from "~/hook/crud/useGet";

export default function CriarTreinoAluno() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { getAllAlunosByPersonal } = useGet();

    const [alunos, setAlunos] = useState([]);
    const [busca, setBusca] = useState('');
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const alunosPaginados = alunosFiltrados.slice(inicio, fim);

    const fetchAlunos = async () => {
        setCarregando(true);
        const data = await getAllAlunosByPersonal();
        setAlunos(data || []);
        setCarregando(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (isFocused) fetchAlunos();
        }, [isFocused])
    );

    useEffect(() => {
        const termo = busca.toLowerCase();
        const filtrados = alunos.filter(aluno =>
            aluno.nome?.toLowerCase().includes(termo) ||
            aluno.email?.toLowerCase().includes(termo)
        );
        setAlunosFiltrados(filtrados);
        setPaginaAtual(1);
    }, [busca, alunos]);

    const mudarPagina = (novaPagina) => {
        if (novaPagina >= 1 && novaPagina <= totalPaginas) {
            setPaginaAtual(novaPagina);
        }
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-colorBackground pl-5 py-2">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <HeaderAppBack title="Criar Treino" />

                    <View className="py-10 px-10">

                        <View className="flex-row items-center border-b border-colorDark100 px-4 pb-1">
                            <TextInput
                                className="flex-1 text-colorLight200 text-lg"
                                placeholder="Pesquisar"
                                placeholderTextColor="#5d5d5d"
                                returnKeyType="search"
                                autoCapitalize="words"
                                value={busca}
                                onChangeText={setBusca}
                            />
                            <TouchableOpacity>
                                <Ionicons name="search" size={25} color="#E4E4E7" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-colorLight200 my-10 text-center text-lg">
                            Para qual aluno deseja criar o treino?
                        </Text>

                        {carregando ? (
                            <View className="items-center justify-center mt-10">
                                <ActivityIndicator size="large" color="#6943FF" />
                            </View>
                        ) : (
                            alunosPaginados.map((aluno) => (
                                <TouchableOpacity
                                    key={aluno.id}
                                    onPress={() => navigation.navigate('criarTreinos', { idAluno: aluno.id })}
                                >
                                    <Text className="text-colorLight200 text-base bg-colorInputs px-10 py-5 mb-2 rounded-xl border border-colorDark100">
                                        {aluno.nome || aluno.email}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}

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
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
