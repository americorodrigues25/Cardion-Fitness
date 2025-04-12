import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

//### aq referente a biometria e facial
import * as LocalAuthentication from 'expo-local-authentication';

import { useDelete } from '~/hook/crud/useDelete';

import { useGet } from '~/hook/crud/useGet';

// ponto para refatorar, deixar mais legivel o trazer nome
// para pegar o nome é so usar a funcao de getById e pegar a propriedade nome
export default function Home({ navigation }) {
    const [nome,setNome] = useState();
    const {getById} = useGet()
    const {deleteAccount} = useDelete()

    const trazerNome = async ()=>{
        const user = await getById()
        setNome(user.nome)
        Alert.alert(user.nome)
    }

    useEffect(()=> { 
        const fetchNome = async () => {
            await trazerNome();};
        fetchNome();
        },[])
     
    
        
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


    return (
        <View className='flex justify-center items-center w-full h-full'>
            <Text>Seja bem vindo(a) {nome}</Text>

            {/* Botão só pra fazer testes */}
            <TouchableOpacity
                onPress={handleLogout}
                className='mt-5 bg-red-500 px-4 py-2 rounded'
            >
                <Text className='text-white font-bold'>Sair</Text>
            </TouchableOpacity>

                        {/* Botão só pra fazer testes */}
                        <TouchableOpacity
                onPress={()=>autenticar()}
                className='mt-5 bg-red-500 px-4 py-2 rounded'
            >
                <Text className='text-white font-bold'>APAGAR CONTA</Text>
            </TouchableOpacity>
        </View>
    );
};