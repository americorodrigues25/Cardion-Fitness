import { SafeAreaView, View, Image, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
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
    const [role, setRole] = useState('');
    const [campoFocado, setCampoFocado] = useState('');
    const [sobrenome, setSobrenome] = useState();
    const [loading, setLoading] = useState(false);


    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSignUp = async () => {
        setLoading(true);

        if (!name || !email || !sobrenome || !password || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Por favor, preencha todos os campos.',
                position: 'top',
            });
            setLoading(false);
            return;
        }

        if (!validarEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'E-mail inválido. Tente novamente.',
                position: 'top',
            });
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'A senha de confirmação precisa ser a mesma.',
                position: 'top',
            });
            setLoading(false);
            return;
        }

        try {
            const user = await signUp(name, email, password, sobrenome, rememberMe);
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
                setSobrenome('');

                setTimeout(async () => {
                    const role = await AsyncStorage.getItem("role");
                    setLoading(false);
                    if (role == 'aluno') {
                        navigation.replace('homeAluno');
                    } else {
                        navigation.replace('homePersonal');
                    }
                }, 1500);
            }
        } catch (err) {
            let message = 'Erro ao criar conta.';

            if (err.code === 'auth/email-already-in-use') {
                message = "Este e-mail já está cadastrado.";
            } else if (err.code === 'auth/invalid-email') {
                message = "E-mail inválido.";
            } else if (err.code === 'auth/weak-password') {
                message = "A senha deve ter pelo menos 6 caracteres.";
            } else if (err.message) {
                message = err.message;
            }

            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: message,
                position: 'top',
            });

            setLoading(false);
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

            <SafeAreaView className='w-full h-full'>

                <View className=" px-5 pt-5 flex-row justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                    </TouchableOpacity>
                    <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{ paddingTop: 35, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >


                        <Text className="text-colorLight200 text-5xl font-semibold text-center">
                            Crie sua conta
                        </Text>

                        <View className='px-10 w-full'>
                            {role !== '' && (
                                <Text className='text-lg mt-2 text-colorViolet text-center'>{role}</Text>
                            )}

                            <View className='mt-10'>
                                <Input
                                    placeholder='Digite seu nome'
                                    keyboardType="default"
                                    autoCapitalize="words"
                                    returnKeyType="done"
                                    maxLength={30}
                                    placeholderTextColor='#5d5d5d'
                                    value={name}
                                    onChangeText={setName}
                                    autoCorrect={true}
                                    onFocus={() => setCampoFocado('nome')}
                                    onBlur={() => setCampoFocado('')}
                                    style={{
                                        borderColor: campoFocado === 'nome' ? '#6943FF' : '#27272A',
                                    }}
                                />

                                <Input
                                    placeholder='Digite seu sobrenome'
                                    keyboardType="default"
                                    autoCapitalize="words"
                                    returnKeyType="done"
                                    maxLength={30}
                                    placeholderTextColor='#5d5d5d'
                                    value={sobrenome}
                                    onChangeText={setSobrenome}
                                    autoCorrect={true}
                                    onFocus={() => setCampoFocado('sobrenome')}
                                    onBlur={() => setCampoFocado('')}
                                    style={{
                                        borderColor: campoFocado === 'sobrenome' ? '#6943FF' : '#27272A',
                                    }}
                                />

                                <Input
                                    placeholder='Digite seu e-mail'
                                    keyboardType="email-address"
                                    returnKeyType="done"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="emailAddress"
                                    placeholderTextColor='#5d5d5d'
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setCampoFocado('email')}
                                    onBlur={() => setCampoFocado('')}
                                    style={{
                                        borderColor: campoFocado === 'email' ? '#6943FF' : '#27272A',
                                    }}
                                />

                                <InputPassword
                                    placeholder='Digite sua senha'
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    autoCorrect={false}
                                    textContentType="password"
                                    placeholderTextColor='#5d5d5d'
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setCampoFocado('senha')}
                                    onBlur={() => setCampoFocado('')}
                                    style={{
                                        borderColor: campoFocado === 'senha' ? '#6943FF' : '#27272A',
                                    }}
                                />

                                <InputPassword
                                    placeholder='Confirme a senha'
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    autoCorrect={false}
                                    textContentType="password"
                                    placeholderTextColor='#5d5d5d'
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    onFocus={() => setCampoFocado('senha')}
                                    onBlur={() => setCampoFocado('')}
                                    style={{
                                        borderColor: campoFocado === 'senha' ? '#6943FF' : '#27272A',
                                    }}
                                />
                            </View>

                            <View className="flex-row items-center gap-2 justify-center my-10">
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
                                <ButtonViolet onPress={handleSignUp}
                                    disabled={loading}
                                    style={{
                                        shadowColor: '#6943FF',
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.7,
                                        shadowRadius: 7,
                                        elevation: 12,
                                        opacity: loading ? 0.7 : 1,
                                    }}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <ButtonTextViolet>Cadastrar</ButtonTextViolet>
                                    )}
                                </ButtonViolet>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BackgroundImage>
    );
}
