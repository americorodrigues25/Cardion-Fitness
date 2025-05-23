import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState, useEffect, useRef } from 'react';
import { useRealizarSessaoTreino } from '~/hook/crud/treino/sessoesTreino/useRealizarSessaoTreino';

import Toast from 'react-native-toast-message';

export default function TreinoDetalhado({ route }) {
    const { treino } = route.params;
    const [checks, setChecks] = useState({});
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    const { realizarSessao } = useRealizarSessaoTreino();

    const toggleCheck = (index) => {
        setChecks((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} className='flex-1 bg-colorBackground'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View className='flex-row justify-between items-center py-5 px-5 bg-colorViolet'>
                    <Text className='text-2xl font-bold text-colorLight200'>{treino.nome}</Text>
                    <Text className='text-2xl font-bold text-colorLight200'>{formatTime(seconds)}</Text>
                </View>
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className='px-5'>
                        <Text className='mt-10 text-xl font-bold text-colorLight200'>Exercícios:</Text>

                        {treino.exercicios.map((ex, index) => (
                            <View
                                key={index}
                                className="border border-gray-700 rounded-xl p-5 mt-2 text-red"
                            >
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-colorLight200 text-lg font-bold">{ex.nome}</Text>

                                    <Pressable onPress={() => toggleCheck(index)}>
                                        <Icon
                                            name={checks[index] ? 'checkmark-circle' : 'ellipse-outline'}
                                            size={24}
                                            color={checks[index] ? '#6943FF' : '#EF4444'}
                                        />
                                    </Pressable>
                                </View>

                                <View className="flex-row justify-between pt-2">
                                    <View>
                                        <Text className="text-gray-500 text-base">Carga</Text>
                                        <Text className="text-colorLight300 text-base">{ex.carga || '–'} Kg</Text>
                                    </View>
                                    <View>
                                        <Text className="text-gray-500 text-base">Séries</Text>
                                        <Text className="text-colorLight300 text-base">{ex.series} x {ex.repeticoes}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-gray-500 text-base">Descanso</Text>
                                        <Text className="text-colorLight300 text-base">{ex.descanso} s</Text>
                                    </View>
                                </View>

                                {ex.observacao ? (
                                    <View className="pt-2">
                                        <Text className="text-gray-500 text-base">Observações</Text>
                                        <Text className="text-colorLight300 text-base">{ex.observacao}</Text>
                                    </View>
                                ) : null}
                            </View>
                        ))}
                        <View className='px-20 py-5'>
                            <TouchableOpacity
                                disabled={Object.keys(checks).length !== treino.exercicios.length || Object.values(checks).includes(false)}
                                onPress={async () => {
                                    const sucesso = await realizarSessao(treino.id);
                                    if (sucesso) {
                                        Toast.show({
                                            type: 'success',
                                            text1: 'Treino concluído 💪',
                                            text2: 'Sessão registrada com sucesso!',
                                        });
                                    }
                                }}
                                className={`mt-6 p-3 rounded-full 
                                ${Object.keys(checks).length !== treino.exercicios.length || Object.values(checks).includes(false)
                                        ? 'bg-gray-500'
                                        : 'bg-colorViolet'}`}
                            >
                                <Text className="text-center text-colorLight200 font-bold text-lg">
                                    Concluir Treino
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <View className="flex-row justify-around items-center py-3 border-t-[0.5px] border-colorDark100">
                    <TouchableOpacity onPress={() => setIsRunning(true)}>
                        <Icon name="play" size={28} color="#6943FF" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsRunning(false)}>
                        <Icon name="pause" size={28} color="#6943FF" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setIsRunning(false); setSeconds(0); }}>
                        <Icon name="refresh" size={28} color="#6943FF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
