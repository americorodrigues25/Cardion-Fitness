import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { getAuth } from 'firebase/auth';

import { useGetDesafio } from '~/hook/crud/desafios/useGetDesafio';
import { useRealizarDesafio } from '~/hook/crud/desafios/useRealizarDesafio';

export default function ListaDesafios({ route }) {
    const { tipo } = route.params;

    const { getAllDesafiosByTipo } = useGetDesafio();
    const { realizarDesafio } = useRealizarDesafio();

    const [desafios, setDesafios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDesafios, setLoadingDesafios] = useState({});

    useEffect(() => {
        async function fetchDesafios() {
            setLoading(true);
            const dados = await getAllDesafiosByTipo(tipo);

            const normalizarNivel = (nivel) =>
                nivel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

            const ordemNivel = { iniciante: 1, intermediario: 2, avancado: 3 };

            const desafiosOrdenados = dados.sort(
                (a, b) => ordemNivel[normalizarNivel(a.nivel)] - ordemNivel[normalizarNivel(b.nivel)]
            );

            setDesafios(desafiosOrdenados);
            setLoading(false);
        }

        fetchDesafios();
    }, [tipo]);

    async function handleRealizarDesafio(desafio) {
        const user = getAuth().currentUser;
        if (!user) return alert('Usuário não autenticado.');

        setLoadingDesafios((prev) => ({ ...prev, [desafio.id]: true }));

        try {
            await realizarDesafio(user.uid, desafio.id);

            Toast.show({
                type: 'success',
                text1: 'Desafio realizado!',
                text2: `${desafio.nome} | +${desafio.pontos} pontos`,
                position: 'top',
            });
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao realizar desafio!',
                text2: 'Você já realizou este desafio hoje.',
                position: 'top',
            });
        } finally {
            setLoadingDesafios((prev) => ({ ...prev, [desafio.id]: false }));
        }
    }

    function renderDesafio({ item }) {
        const isLoading = loadingDesafios[item.id];

        return (
            <View className="bg-colorInputs p-4 rounded-2xl mb-4 border-[0.2px] border-gray-600">
                <Text className="text-colorLight300 font-bold text-xl">{item.nome}</Text>
                <Text className="text-gray-400 mt-1">{item.descricao}</Text>

                <View className="flex-row justify-between my-4">
                    <View className="bg-gray-600 py-[6px] rounded-full w-[90px]">
                        <Text className="text-colorLight200 text-xs uppercase text-center">{item.nivel}</Text>
                    </View>
                    <Text className="text-green-500 font-bold text-base text-center">+ {item.pontos} pontos</Text>
                </View>

                <TouchableOpacity
                    className="bg-colorViolet py-3 rounded-full items-center justify-center"
                    onPress={() => handleRealizarDesafio(item)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#E4E4E7" />
                    ) : (
                        <Text className="text-colorLight200 font-bold text-sm uppercase">
                            Realizar Desafio
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-colorBackground px-5 py-5">
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#6946FF" />
                    <Text className="mt-4 text-base text-colorLight200">Carregando desafios...</Text>
                </View>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <Text className="text-2xl font-bold text-colorLight300 mb-2">Desafios: {tipo}</Text>
                    <Text className="text-gray-300 mb-4">Complete os desafios e acumule pontos!</Text>

                    {desafios.length === 0 ? (
                        <Text className="text-gray-400 text-center mt-10">
                            Nenhum desafio disponível no momento.
                        </Text>
                    ) : (
                        <FlatList
                            data={desafios}
                            keyExtractor={(item) => item.id}
                            renderItem={renderDesafio}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}
