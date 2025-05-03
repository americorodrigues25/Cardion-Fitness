import { View, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback, useEffect } from "react";
import { useGet } from "~/hook/crud/useGet";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const { getAllAlunosByPersonal } = useGet();
    const isFocused = useIsFocused();
    const [busca, setBusca] = useState('');
    const [alunosFiltrados, setAlunosFiltrados] = useState([]);

    useEffect(() => {
        const termo = busca.toLowerCase();

        const filtrados = alunos.filter((aluno) =>
            aluno.nome?.toLowerCase().includes(termo) ||
            aluno.email?.toLowerCase().includes(termo)
        );

        setAlunosFiltrados(filtrados);
    }, [busca, alunos]);

    const fetchAlunos = async () => {
        const data = await getAllAlunosByPersonal();
        setAlunos(data || []);
    };

    useFocusEffect(
        useCallback(() => {
            if (isFocused) {
                fetchAlunos();
            }
        }, [isFocused])
    );

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className='flex-1 bg-colorBackground pl-5 py-2'
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

                    <View className='flex-row items-center justify-between pr-5'>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
                        </View>

                        <View className='flex-row items-center gap-5'>
                            <TouchableOpacity >
                                <FontAwesome name="bell-o" size={23} color="#e4e4e7" />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <MaterialCommunityIcons name="message-reply-text-outline" size={23} color="#e4e4e7" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='py-20 px-10'>

                        <View className="flex-row justify-between items-center border-b border-colorDark100 px-4 pb-1">
                            <TextInput
                                placeholder="pesquisar"
                                placeholderTextColor="#5d5d5d"
                                returnKeyType="search"
                                autoCapitalize="words"
                                className="flex-1 text-colorLight200 text-lg h-10"
                                value={busca}
                                onChangeText={setBusca}

                            />
                            <TouchableOpacity>
                                <Ionicons name="search" size={25} color="#E4E4E7" />
                            </TouchableOpacity>
                        </View>

                        <View className="pt-20">

                            {alunosFiltrados.map((aluno) => (
                                <TouchableOpacity key={aluno.id}>
                                    <Text className="text-colorLight200 text-base bg-colorInputs px-10 py-5 mb-2 rounded-xl border-colorDark100 border">
                                        {aluno.nome || aluno.email}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}