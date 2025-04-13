import { View, Text, TouchableOpacity } from 'react-native';
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