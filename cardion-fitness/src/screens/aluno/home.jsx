import { View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native'; //esse é evento do botão voltar em Android
import { useEffect, useState, useCallback } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

//### aq referente a biometria e facial
import * as LocalAuthentication from 'expo-local-authentication';

import { useDelete } from '~/hook/crud/useDelete';

import { useGet } from '~/hook/crud/useGet';

// ponto para refatorar, deixar mais legivel o trazer nome
// para pegar o nome é so usar a funcao de getById e pegar a propriedade nome

export default function Home({ navigation }) {
    const [nome, setNome] = useState();
    const { getById } = useGet()
    const { deleteAccount } = useDelete()

    const trazerNome = async () => {
        const user = await getById()
        setNome(user.nome)
        Alert.alert(user.nome)
    }

    useEffect(() => {
        const fetchNome = async () => {
            await trazerNome();
        };
        fetchNome();
    }, [])



    const autenticar = async () => {
        const compatibilidade = await LocalAuthentication.hasHardwareAsync();
        const biometriaCadastrada = await LocalAuthentication.isEnrolledAsync();

        if (!compatibilidade || !biometriaCadastrada) {
            Alert.alert('Biometria não configurada', 'Seu dispositivo não tem biometria ou ela não está ativada.');
            return;
        }

        const resultado = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autentique-se para continuar',
            fallbackLabel: 'Usar senha',
        });

        if (resultado.success) {
            Alert.alert("ai")
            await deleteAccount()
        } else {
            Alert.alert('Falha na autenticação');
        }
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // aqui é pra bloquear o botão de voltar no android, pro usuario não 
                // conseguir voltar pro login depois de entrar na home
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );


    return (
        <SafeAreaView className='flex-1 w-full h-full bg-colorBackground'>
            <View className=''>
                <View className="pt-5 px-5">
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={28} color="#6943FF" />
                    </TouchableOpacity>
                </View>
                <Text>Seja bem vindo(a) {nome}</Text>
                <Text>Tela home aluno</Text>

                {/* Botão só pra fazer testes */}
                <TouchableOpacity
                    onPress={() => autenticar()}
                    className='mt-5 bg-red-500 px-4 py-2 rounded'
                >
                    <Text className='text-white font-bold'>APAGAR CONTA</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};