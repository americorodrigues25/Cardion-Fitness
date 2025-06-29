// 📦 Imports
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';

// 🎯 Componentes e utilitários
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import { InputPassword } from '~/components/inputPassword';
import BackgroundImage from '~/components/loadingBackgroundImage';
import { enviarMensagem } from '~/utils/enviarNotificacao';
import { SERVER_URL } from '~/apiConfig/config';
import HeaderAuth from '~/components/header/headerAuth';

// 🔁 Hooks
import { useAuth } from '~/hook/useAuthentication';
import { useGet } from '~/hook/crud/useGet';

export default function SignUp() {
    const navigation = useNavigation();
    const { login, signUp, accountExists, loading: loadingAuth } = useAuth();
    const { getById } = useGet();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [role, setRole] = useState('');
    const [campoFocado, setCampoFocado] = useState('');
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    // ✅ Função para validar email
    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // ✅ Toast de erro
    const mostrarErro = (mensagem) =>
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: mensagem,
            position: 'top',
        });

    const handleLogin = async () => {
        setIsLoadingButton(true);

        if (!email || !password) {
            mostrarErro('Preencha todos os campos.');
            setIsLoadingButton(false);
            return;
        }

        if (!validarEmail(email)) {
            mostrarErro('E-mail inválido. Tente novamente.');
            setIsLoadingButton(false);
            return;
        }

        try {
            const contaExiste = await accountExists(email);
            if (!contaExiste) {
                mostrarErro('Conta não encontrada.');
                setIsLoadingButton(false);
                return;
            }

            const user = await login(email, password, rememberMe);
            if (user) {
                const usuario = await getById();
                const nome = usuario.nome;

                enviarMensagem('Boas vindas', `Muito bom ter você aqui ${nome}`);
                await registerPushNotificationsAsync(user.id)
                setEmail('');
                setPassword('');

                Toast.show({
                    type: 'success',
                    text1: `Olá, ${nome}!`,
                    text2: 'Que bom que voltou 🎉',
                    position: 'top',
                });

                const role = await AsyncStorage.getItem('role');
                navigation.replace(role === 'aluno' ? 'homeAluno' : 'homePersonal');
            }
        } catch (err) {
            const errosComuns = [
                'auth/user-not-found',
                'auth/wrong-password',
                'auth/invalid-email',
                'auth/invalid-credential',
            ];
            mostrarErro(
                errosComuns.includes(err?.code)
                    ? 'Usuário ou senha incorretos.'
                    : 'Não foi possível realizar o login. Tente novamente.'
            );
        } finally {
            setIsLoadingButton(false);
        }
    };

    // Traz para tela o nome da role, ou seja, "Personal ou Aluno"
    useEffect(() => {
        const getRole = async () => {
            const storedRole = await AsyncStorage.getItem('role');
            setRole(storedRole === 'aluno' ? 'Aluno' : 'Personal');
        };
        getRole();
    }, []);

    async function registerPushNotificationsAsync(userId) {
        const savedToken = await AsyncStorage.getItem('expoPushToken');
        let finalToken = savedToken;

        if (!savedToken) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Permissão negada para notificações');
                return;
            }

            const { data } = await Notifications.getExpoPushTokenAsync();
            finalToken = data;
            await AsyncStorage.setItem('expoPushToken', finalToken);
        }

        // Envia para o backend
        await fetch(`${SERVER_URL}/register-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: finalToken, userId }),
        });
    }

    return (
        <BackgroundImage source={require('~/assets/img/backgroundImage/imagemFundo3.png')}>
            <SafeAreaView className="w-full h-full">
                <HeaderAuth />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <ScrollView contentContainerStyle={{ paddingTop: 40, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
                        <View className="mt-12">
                            <Text className="text-colorLight200 text-5xl font-semibold text-center">Vamos entrar ?</Text>
                        </View>

                        <View className="px-10 w-full">
                            {role !== '' && (
                                <Text className="text-lg mt-2 text-colorViolet text-center">{role}</Text>
                            )}

                            <View className="mt-10 space-y-5">
                                <Input
                                    placeholder="Digite seu e-mail"
                                    placeholderTextColor="#5d5d5d"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setCampoFocado('email')}
                                    onBlur={() => setCampoFocado('')}
                                    style={{
                                        borderColor: campoFocado === 'email' ? '#6943FF' : '#27272A',
                                    }}
                                />

                                <InputPassword
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChangeText={setPassword}
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
                                    className="w-6 h-6 rounded-md border-2 border-colorViolet flex items-center justify-center"
                                >
                                    {rememberMe && <View className="w-6 h-6 bg-colorViolet rounded-md" />}
                                </TouchableOpacity>
                                <Text className="text-gray-300 text-base">Lembrar</Text>
                            </View>

                            <ButtonViolet
                                onPress={handleLogin}
                                disabled={isLoadingButton}
                                style={{
                                    shadowColor: '#6943FF',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12,
                                    opacity: isLoadingButton ? 0.7 : 1,
                                }}
                            >
                                {isLoadingButton ? (
                                    <ActivityIndicator size="small" color="#E4E4E7" />
                                ) : (
                                    <ButtonTextViolet>Entrar</ButtonTextViolet>
                                )}
                            </ButtonViolet>

                            <TouchableOpacity className="mt-5" onPress={() => navigation.navigate('resetPassword')}>
                                <Text className="text-colorLight200 text-base text-center">
                                    Esqueci minha <Text className="text-colorViolet font-semibold">senha</Text>
                                </Text>
                            </TouchableOpacity>

                            <View className="flex-row items-center mt-10">
                                <View className="flex-1 h-[2px] bg-colorDark100" />
                                <Text className="mx-2 text-colorLight200 text-3xl">ou</Text>
                                <View className="flex-1 h-[2px] bg-colorDark100" />
                            </View>

                            <TouchableOpacity className="mt-10" onPress={() => navigation.navigate('signUp')}>
                                <Text className="text-colorLight200 text-base text-center">
                                    Não possui conta ? <Text className="text-colorViolet font-semibold">Crie-a</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BackgroundImage>
    );
}
