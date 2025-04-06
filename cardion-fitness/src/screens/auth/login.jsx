import { SafeAreaView, View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';

import { useState } from 'react';

import BackgroundImage from '~/components/loadingBackgroundImage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// hooks
import { useGoogleAuth } from '../../hook/useGoogleAuth';
import { useAuth } from '~/hook/useAuthentication';

export default function Login() {
    const [role, setRole] = useState('aluno'); // ou 'personal'
    const { promptAsync, loading, error, userRole } = useGoogleAuth(role);
    const navigation = useNavigation();
    const { login, signUp, loading: loadingAuth, error:errorAuth } = useAuth();

    const handleLogin = async () => {
        const user = await login(email, password);
        if (user) {
            // todo: remover alert, coloquei para teste
          console.log("Login bem-sucedido!", user);
          Alert.alert("Deu certo")
        }
      };

    return (
        <BackgroundImage
            source={require('~/assets/img/backgroundImage/imagemFundo3.png')}
        >
            <SafeAreaView className='w-full'>

                <View className="flex-row items-center justify-between w-full px-5">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-ios-new" size={25} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Image
                        source={require('~/assets/img/logo/Logo1.png')}
                        className="w-4/12"
                        style={{ resizeMode: 'contain' }}
                    />
                </View>

                <Text className="text-colorLight200 text-5xl font-semibold text-center my-10 px-10">
                    Vamos entrar?
                </Text>

                <View className="w-full px-10">
                    <TouchableOpacity className="flex-row items-center justify-center bg-colorInputs border-colorDark100 border-[1.5px] p-4 rounded-2xl mt-10 mb-3">
                        <Image source={require('~/assets/img/redeSocial/facebook.png')} className='w-10 h-10 mr-3' />
                        <Text className="text-colorLight200 ml-4 text-lg">Continuar com Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => promptAsync()} className="flex-row items-center justify-center bg-colorInputs border-colorDark100 border-[1.5px] p-4 rounded-2xl mb-3">
                        <Image source={require('~/assets/img/redeSocial/google.png')} className='w-10 h-10 mr-3' />
                        <Text className="text-colorLight200 ml-4 text-lg">Continuar com Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-center bg-colorInputs border-colorDark100 border-[1.5px] p-4 rounded-2xl">
                        <Image source={require('~/assets/img/redeSocial/logotipo-da-apple.png')} className='w-10 h-10 mr-3' />
                        <Text className="text-colorLight200 ml-4 text-lg">Continuar com Apple</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center my-6 px-10 mt-10">
                    <View className="flex-1 h-[0.5px] bg-gray-500" />
                    <Text className="text-colorLight200 mx-2 text-4xl">ou</Text>
                    <View className="flex-1 h-[0.5px] bg-gray-500" />
                </View>

                <View className='w-full items-center px-10'>
                    <ButtonViolet
                        onPress={() => navigation.navigate('signup')}
                        style={{
                            shadowColor: '#6943FF',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.7,
                            shadowRadius: 7,
                            elevation: 12,
                        }}
                    >
                        <ButtonTextViolet onPress={handleLogin}>Entrar com senha</ButtonTextViolet>
                    </ButtonViolet>
                </View>
                <TouchableOpacity className='mt-20'>
                    <Text className="text-colorLight200 text-base font-normal text-center">
                        Não tem uma conta? <Text className='text-colorViolet font-semibold'>Crie-a</Text>
                    </Text>
                </TouchableOpacity>

            </SafeAreaView>
        </BackgroundImage>

    );
}
