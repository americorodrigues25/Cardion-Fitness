import { SafeAreaView, View, Image, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import { InputPassword } from '~/components/inputPassword';

import BackgroundImage from '~/components/loadingBackgroundImage';

// hook
import { useAuth } from '~/hook/useAuthentication';

export default function SignUp({ }) {
    const { signUp } = useAuth();
    const navigation = useNavigation();
    const [rememberMe, setRememberMe] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [formError, setFormError] = useState('');
    const [role, setRole] = useState('');

    const handleSignUp = async () => {
        setFormError('');

        if (!name || !email || !password || !confirmPassword) {
            setFormError("Por favor, preencha todos os campos.");
            return;
        }

        if (password !== confirmPassword) {
            setFormError("A senha de confirmação precisa ser a mesma.");
            return;
        }

        try {
            const user = await signUp(name, email, password, rememberMe);
            if (user) {
                await AsyncStorage.setItem('userType', role);

                if (rememberMe) {
                    await AsyncStorage.setItem('userLoggedIn', 'true');
                } else {
                    await AsyncStorage.removeItem('userLoggedIn');
                }

                Toast.show({
                    type: 'success',
                    text1: 'Conta criada com sucesso!',
                    text2: 'Bem-vindo(a)! 🎉',
                    position: 'top',
                });

                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                setTimeout(() => {
                    navigation.replace('homeAluno');
                }, 1500);
            }
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setFormError("Este e-mail já está cadastrado.");
            } else if (err.code === 'auth/invalid-email') {
                setFormError("E-mail inválido.");
            } else if (err.code === 'auth/weak-password') {
                setFormError("A senha deve ter pelo menos 6 caracteres.");
            } else {
                setFormError("Erro ao criar conta: " + err.message);
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
                <View className="absolute top-0 left-0 w-full px-5 pt-16 z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-5 h-7' />
                    </TouchableOpacity>
                </View>

                <View className='px-10 w-full'>
                    <Text className="text-colorLight200 text-5xl font-semibold text-center">
                        Cadastrar conta
                    </Text>

                    {role !== '' && (
                        <Text className='text-lg mt-2 text-colorViolet text-center'>{role}</Text>
                    )}

                    <View className='mt-20'>
                        <Input
                            placeholder='Nome'
                            placeholderTextColor='#5d5d5d'
                            value={name}
                            onChangeText={setName}
                        />

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

                        <InputPassword
                            placeholder='Confirme sua senha'
                            placeholderTextColor='#5d5d5d'
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        {formError !== '' && (
                            <Text className={`mt-4 text-center ${formError.includes("sucesso") ? 'text-green-400' : 'text-red-500'}`}>
                                {formError}
                            </Text>
                        )}
                    </View>

                    <View className="flex-row items-center gap-2 justify-center mt-6">
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
                        <ButtonViolet onPress={handleSignUp}>
                            <ButtonTextViolet>Cadastrar</ButtonTextViolet>
                        </ButtonViolet>
                    </View>
                </View>
            </SafeAreaView>
        </BackgroundImage>
    );
}
