import { View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native'; //esse é evento do botão voltar em Android
import { useEffect, useState, useCallback } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            await AsyncStorage.removeItem('userLoggedIn');
            navigation.replace('userType');
        } catch (error) {
            Alert.alert('Erro ao sair:', error)
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
        <View>
            <Text>Seja bem vindo(a), </Text>
            <Text>Tela home personal </Text>

            {/* Botão só pra fazer testes */}
            <TouchableOpacity
                onPress={handleLogout}
                className='mt-5 bg-red-500 px-4 py-2 rounded'
            >
                <Text className='text-white font-bold'>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}