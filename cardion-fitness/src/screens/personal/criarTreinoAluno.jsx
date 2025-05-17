import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    Text,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback, useEffect } from "react";
import { useGet } from "~/hook/crud/useGet";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CriarTreinoAluno() {
    const navigation = useNavigation();
    const [alunos, setAlunos] = useState([]);
    const { getAllAlunosByPersonal } = useGet();
    const isFocused = useIsFocused();
    const [busca, setBusca] = useState('');
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const alunosPaginados = alunosFiltrados.slice(inicio, fim);

    const mudarPagina = (novaPagina) => {
        if (novaPagina >= 1 && novaPagina <= totalPaginas) {
            setPaginaAtual(novaPagina);
        }
    };

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

    return (
        <SafeAreaView edges={['top', 'bottom']} className='flex-1 bg-colorBackground pl-5 py-2'>
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
                            <Text className="ml-2 text-colorLight200">Criar treinos</Text>
                        </TouchableOpacity>
                        <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
                    </View>

                    <View className='py-10 px-10'>
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

                        <Text className="text-colorLight200 my-10 text-center">Para qual aluno deseja criar o treino ?</Text>

                        <View className="">
                            {carregando ? (
                                <View className="items-center justify-center">
                                    <ActivityIndicator size="large" color="#6943FF" />
                                </View>
                            ) : (
                                alunosPaginados.map((aluno) => (
                                    <TouchableOpacity
                                        key={aluno.id}
                                        onPress={() => navigation.navigate('criarTreinos', { idAluno: aluno.id })}
                                    >
                                        <Text className="text-colorLight200 text-base bg-colorInputs px-10 py-5 mb-2 rounded-xl border-colorDark100 border">
                                            {aluno.nome || aluno.email}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            )}

                            {/* Paginação */}
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
