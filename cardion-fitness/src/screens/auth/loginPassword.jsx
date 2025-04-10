import { SafeAreaView, View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import { InputPassword } from '~/components/inputPassword';

import BackgroundImage from '~/components/loadingBackgroundImage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// hook
import { useAuth } from '~/hook/useAuthentication';

export default function SignUp({ }) {
    const { login, signUp, loading: loadingAuth, error: errorAuth } = useAuth();
    const navigation = useNavigation();
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState(false);
    const [password, setPassword] = useState();
    const [formError, setFormError] = useState('');

    const handleLogin = async () => {
        setFormError('');

        if (!email || !password) {
            setFormError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const user = await login(email, password, rememberMe);
            if (user) {
                setEmail('');
                setPassword('');
                Alert.alert("Sucesso", "Login realizado com sucesso!");
                navigation.replace('homeAluno');
            }
        } catch (err) {
            const errorCode = err?.code;

            if (
                errorCode === 'auth/user-not-found' ||
                errorCode === 'auth/wrong-password' ||
                errorCode === 'auth/invalid-email' ||
                errorCode === 'auth/invalid-credential'
            ) {
                setFormError('Usuário ou senha incorretos.');
            } else {
                setFormError('Não foi possível realizar o login. Tente novamente.');
            }
        }
    };



    return (
        <BackgroundImage
            source={require('~/assets/img/backgroundImage/imagemFundo3.png')}
        >
            <SafeAreaView className='w-full h-full flex-1 justify-center items-center'>
                <View className="absolute top-0 left-0 w-full px-5 pt-16 z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-5 h-7' />
                    </TouchableOpacity>
                </View>

                <View className='px-10 w-full'>
                    <Text className="text-colorLight200 text-5xl font-semibold text-center">
                        Entrar na conta
                    </Text>

                    <View className='mt-20'>
                        <Input
                            placeholder='Email'
                            placeholderTextColor='#5d5d5d'
                            value={email}
                            onChangeText={setEmail}
                        />

                        <InputPassword
                            placeholder='Senha'
                            placeholderTextColor='#5d5d5d'
                            value={password}
                            onChangeText={setPassword}
                        />

                        {formError !== '' && (
                            <Text className="text-red-500 mt-4 text-center">{formError}</Text>
                        )}

                    </View>

                    <View className=" flex-row items-center gap-2 justify-center mt-10">
                        <TouchableOpacity
                            onPress={() => setRememberMe(!rememberMe)}
                            activeOpacity={0.7}
                            className="w-6 h-6 rounded-md border-2 border-colorViolet flex items-center justify-center"
                        >
                            {rememberMe && <View className="w-6 h-6 bg-colorViolet rounded-md" />}
                        </TouchableOpacity>

                        <Text className="text-gray-300 text-lg">Lembrar</Text>
                    </View>


                    <View className='mt-8'>
                        <ButtonViolet onPress={handleLogin}>
                            <ButtonTextViolet>Entrar</ButtonTextViolet>
                        </ButtonViolet>
                    </View>

                    {/* Coloquei mais para cima apenas para teste */}
                    <TouchableOpacity className='' onPress={() => navigation.navigate('resetPassword')}>
                        <Text className="text-colorLight200 text-base font-normal text-center my-10">
                            Esqueci minha <Text className='text-colorViolet font-semibold'>senha</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </BackgroundImage>
    )
};