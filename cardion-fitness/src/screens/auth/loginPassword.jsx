import { SafeAreaView, View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import { InputPassword } from '~/components/inputPassword';
import Toast from 'react-native-toast-message';

import BackgroundImage from '~/components/loadingBackgroundImage';

// hook
import { useAuth } from '~/hook/useAuthentication';
import { useGet } from '~/hook/crud/useGet';

export default function SignUp({ }) {
    const { login, signUp, accountExists, loading: loadingAuth, error: errorAuth } = useAuth();
    const navigation = useNavigation();
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [role, setRole] = useState('');
    const [nome, setNome] = useState();
    const { getById } = useGet();


    const trazerNome = async () => {
        const user = await getById()
        setNome(user.nome)
    }

    useEffect(() => {
        const fetchNome = async () => {
            await trazerNome();
        };
        fetchNome();
    }, [])

    const handleLogin = async () => {
        setFormError('');

        if (!email || !password) {
            setFormError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const contaExiste = await accountExists(email)
            if (!contaExiste) {
                setFormError('Conta não encontrada');
                return
            }

            const user = await login(email, password, rememberMe);
            if (user) {
                setEmail('');
                setPassword('');
                Toast.show({
                    type: 'success',
                    text1: `Olá, ${nome} !`,
                    text2: `Que bom que voltou 🎉`,
                    position: 'top',
                });

                const role = await AsyncStorage.getItem("role")
                if (role == 'aluno') {
                    navigation.replace('homeAluno');
                } else {
                    navigation.replace('homePersonal');
                }
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

    { /*Esta pegando o nome da role e importando na tela*/ }
    useEffect(() => {
        const getRole = async () => {
            const storedRole = await AsyncStorage.getItem('role');
            if (storedRole) {
                setRole(storedRole === 'aluno' ? 'Aluno' : 'Personal');
            }
        };

        getRole();
    }, []);

    return (
        <BackgroundImage
            source={require('~/assets/img/backgroundImage/imagemFundo3.png')}
        >
            <SafeAreaView className='w-full h-full flex-1 justify-center items-center'>
                <View className="absolute top-0 left-0 w-full px-5 pt-16 z-10 flex-row justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                    </TouchableOpacity>
                    <Image source={require('~/assets/img/logo/Logo1.png')} className="w-28 h-14" resizeMode="contain" />
                </View>

                <View className='mt-12'>
                    <Text className="text-colorLight200 text-5xl font-semibold text-center">
                        Vamos entrar ?
                    </Text>
                </View>

                <View className='px-10 w-full'>
                    {role !== '' && (
                        <Text className='text-lg mt-2 text-colorViolet text-center'>{role}</Text>
                    )}

                    <View className='mt-10'>
                        <Input
                            placeholder='Digite seu e-mail'
                            keyboardType="email-address"       
                            returnKeyType="next" 
                            autoCapitalize="none" 
                            autoCorrect={false}     
                            textContentType="emailAddress"  
                            accessibilityLabel="Campo de e-mail"
                            placeholderTextColor='#5d5d5d'
                            value={email}
                            onChangeText={setEmail}
                        />

                        <InputPassword
                            placeholder='Digite sua senha'
                            keyboardType="default"       
                            autoCapitalize="none"    
                            autoCorrect={false} 
                            textContentType="password"     
                            accessibilityLabel="Campo de senha"
                            placeholderTextColor='#5d5d5d'
                            value={password}
                            onChangeText={setPassword}
                        />

                        {formError !== '' && (
                            <Text className="text-red-500 mt-4 text-center">{formError}</Text>
                        )}

                    </View>

                    <View className=" flex-row items-center gap-2 justify-center my-10">
                        <TouchableOpacity
                            onPress={() => setRememberMe(!rememberMe)}
                            activeOpacity={0.7}
                            className="w-6 h-6 rounded-md border-2 border-colorViolet flex items-center justify-center"
                        >
                            {rememberMe && <View className="w-6 h-6 bg-colorViolet rounded-md" />}
                        </TouchableOpacity>

                        <Text className="text-gray-300 text-base">Lembrar</Text>
                    </View>


                    <View className=''>
                        <ButtonViolet onPress={handleLogin}
                            style={{
                                shadowColor: '#6943FF',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.7,
                                shadowRadius: 7,
                                elevation: 12,
                            }}
                        >
                            <ButtonTextViolet>Entrar</ButtonTextViolet>
                        </ButtonViolet>
                    </View>

                    <TouchableOpacity className='mt-5' onPress={() => navigation.navigate('resetPassword')}>
                        <Text className="text-colorLight200 text-base font-normal text-center">
                            Esqueci minha <Text className='text-colorViolet font-semibold'>senha</Text>
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center mt-10">
                        <View className="flex-1 h-[2px] bg-colorDark100" />
                        <Text className="mx-2 text-colorLight200 text-3xl">ou</Text>
                        <View className="flex-1 h-[2px] bg-colorDark100" />
                    </View>

                    <TouchableOpacity className='mt-10' onPress={() => navigation.navigate('signUp')}>
                        <Text className="text-colorLight200 text-base font-normal text-center">
                            Não possui conta ? <Text className='text-colorViolet font-semibold'>Crie-a</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </BackgroundImage>
    )
};