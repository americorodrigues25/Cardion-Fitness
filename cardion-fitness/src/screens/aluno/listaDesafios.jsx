import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useGetDesafio } from '~/hook/crud/desafios/useGetDesafio';
import { useRealizarDesafio } from '~/hook/crud/desafios/useRealizarDesafio';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message';

export default function ListaDesafios({ route }) {
    const { tipo } = route.params;
    const { getAllDesafiosByTipo } = useGetDesafio();
    const [desafios, setDesafios] = useState([]);
    const [loading, setLoading] = useState(true);
    const { realizarDesafio, loading: loadingRealizar } = useRealizarDesafio();
    const [loadingDesafios, setLoadingDesafios] = useState({});


    useEffect(() => {
        async function fetchDesafios() {
            setLoading(true);
            const dados = await getAllDesafiosByTipo(tipo);
            setDesafios(dados);
            setLoading(false);
        }
        fetchDesafios();
    }, [tipo]);


    async function handleRealizarDesafio(desafio) {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('Usuário não autenticado.');
            return;
        }

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
                text2: 'Você ja realizou este desafio.',
                position: 'top',
            });;
        } finally {
            setLoadingDesafios((prev) => ({ ...prev, [desafio.id]: false }));
        }
    }

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className="flex-1 bg-colorBackground px-5 py-5"
        >
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
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View className="bg-colorInputs p-4 rounded-2xl mb-4 border-[0.2px] border-gray-600">
                                    <Text className="text-colorLight300 font-bold text-xl">{item.nome}</Text>

                                    {/*aqui o ID é só teste pra conseguir identificar desafio no firebase e corrigir bug*/}
                                    <Text className="text-colorLight300 font-bold text-xl">{item.id}</Text>

                                    <Text className="text-gray-400 mt-1">{item.descricao}</Text>

                                    <View className="flex-row justify-between my-4">
                                        <View className="bg-gray-600 py-[6px] rounded-full w-[90px]">
                                            <Text className="text-colorLight200 text-xs uppercase text-center">{item.nivel}</Text>
                                        </View>
                                        <View className="justify-center">
                                            <Text className="text-green-500 font-bold text-base text-center">+ {item.pontos} pontos</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        className="bg-colorViolet py-3 rounded-full"
                                        onPress={() => handleRealizarDesafio(item)}
                                        disabled={loadingDesafios[item.id]}
                                    >
                                        <Text className="text-colorLight200 text-center font-bold text-sm uppercase">
                                            {loadingDesafios[item.id] ? 'Processando...' : 'Realizar Desafio'}
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            )}
                        />
                    )}
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}
