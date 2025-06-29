// 📦 Imports
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

// 🎯 Componentes e utilitários
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import { InputPassword } from '~/components/inputPassword';
import BackgroundImage from '~/components/loadingBackgroundImage';
import HeaderAuth from '~/components/header/headerAuth';

// 🔁 Hooks
import { useAuth } from '~/hook/useAuthentication';

export default function SignUp() {
    const { signUp } = useAuth();
    const navigation = useNavigation();

    const [rememberMe, setRememberMe] = useState(false);
    const [name, setName] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [campoFocado, setCampoFocado] = useState('');
    const [loading, setLoading] = useState(false);

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const mostrarToastErro = (mensagem) =>
        Toast.show({ type: 'error', text1: 'Erro', text2: mensagem, position: 'top' });

    const mostrarToastSucesso = (mensagem) =>
        Toast.show({ type: 'success', text1: 'Conta criada com sucesso!', text2: mensagem, position: 'top' });

    const handleSignUp = async () => {
        setLoading(true);

        if (!name || !sobrenome || !email || !password || !confirmPassword) {
            mostrarToastErro('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        if (!validarEmail(email)) {
            mostrarToastErro('E-mail inválido. Tente novamente.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            mostrarToastErro('A senha de confirmação precisa ser a mesma.');
            setLoading(false);
            return;
        }

        try {
            const user = await signUp(name, email, password, sobrenome, rememberMe);
            if (user) {
                await AsyncStorage.setItem('userType', role);
                rememberMe
                    ? await AsyncStorage.setItem('userLoggedIn', 'true')
                    : await AsyncStorage.removeItem('userLoggedIn');

                mostrarToastSucesso('Bem-vindo(a)! 🎉');

                // Limpar campos
                setName('');
                setSobrenome('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                setTimeout(async () => {
                    const role = await AsyncStorage.getItem('role');
                    navigation.replace(role === 'aluno' ? 'homeAluno' : 'homePersonal');
                }, 1500);
            }
        } catch (err) {
            let message = 'Erro ao criar conta.';
            if (err.code === 'auth/email-already-in-use') message = 'Este e-mail já está cadastrado.';
            else if (err.code === 'auth/invalid-email') message = 'E-mail inválido.';
            else if (err.code === 'auth/weak-password') message = 'A senha deve ter pelo menos 6 caracteres.';
            else if (err.message) message = err.message;

            mostrarToastErro(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AsyncStorage.getItem('role').then((storedRole) =>
            setRole(storedRole === 'aluno' ? 'Aluno' : 'Personal')
        );
    }, []);

    return (
        <BackgroundImage source={require('~/assets/img/backgroundImage/imagemFundo3.png')}>
            <SafeAreaView className="w-full h-full">
                <HeaderAuth />

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

                        <View className="px-10 w-full">
                            {role && <Text className="text-lg mt-2 text-colorViolet text-center">{role}</Text>}

                            <View className="mt-10 space-y-5">
                                <Input
                                    placeholder="Digite seu nome"
                                    value={name}
                                    onChangeText={setName}
                                    onFocus={() => setCampoFocado('nome')}
                                    onBlur={() => setCampoFocado('')}
                                    placeholderTextColor="#5d5d5d"
                                    autoCapitalize="words"
                                    autoCorrect
                                    style={{ borderColor: campoFocado === 'nome' ? '#6943FF' : '#27272A' }}
                                />

                                <Input
                                    placeholder="Digite seu sobrenome"
                                    value={sobrenome}
                                    onChangeText={setSobrenome}
                                    onFocus={() => setCampoFocado('sobrenome')}
                                    onBlur={() => setCampoFocado('')}
                                    placeholderTextColor="#5d5d5d"
                                    autoCapitalize="words"
                                    autoCorrect
                                    style={{ borderColor: campoFocado === 'sobrenome' ? '#6943FF' : '#27272A' }}
                                />

                                <Input
                                    placeholder="Digite seu e-mail"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setCampoFocado('email')}
                                    onBlur={() => setCampoFocado('')}
                                    placeholderTextColor="#5d5d5d"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={{ borderColor: campoFocado === 'email' ? '#6943FF' : '#27272A' }}
                                />

                                <InputPassword
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setCampoFocado('senha')}
                                    onBlur={() => setCampoFocado('')}
                                    placeholderTextColor="#5d5d5d"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={{ borderColor: campoFocado === 'senha' ? '#6943FF' : '#27272A' }}
                                />

                                <InputPassword
                                    placeholder="Confirme a senha"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    onFocus={() => setCampoFocado('senha')}
                                    onBlur={() => setCampoFocado('')}
                                    placeholderTextColor="#5d5d5d"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={{ borderColor: campoFocado === 'senha' ? '#6943FF' : '#27272A' }}
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
                                onPress={handleSignUp}
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
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BackgroundImage>
    );
}
