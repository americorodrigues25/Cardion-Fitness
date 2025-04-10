import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
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
            <Text>Seja bem vindo(a)</Text>

            {/* Botão só pra fazer testes */}
            <TouchableOpacity
                onPress={handleLogout}
                className='mt-5 bg-red-500 px-4 py-2 rounded'
            >
                <Text className='text-white font-bold'>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};