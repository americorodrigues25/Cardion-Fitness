// 📦 Imports
import {
    SafeAreaView,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// 🎯 Componentes e utilitários
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import BackgroundImage from '~/components/loadingBackgroundImage';
import HeaderAuth from '~/components/header/headerAuth';

// 🔁 Hooks
import { useAuth } from '~/hook/useAuthentication';

export default function ResetPassword() {
    const { resetPassword, loading } = useAuth();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [campoFocado, setCampoFocado] = useState('');

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const mostrarToastErro = (mensagem) => {
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: mensagem,
        });
    };

    const mostrarToastSucesso = (mensagem) => {
        Toast.show({
            type: 'success',
            text1: 'Sucesso!',
            text2: mensagem,
            onHide: () => navigation.navigate('loginPassword'),
            visibilityTime: 3000,
        });
    };

    const handleReset = async () => {
        if (!email) {
            mostrarToastErro('Por favor, preencha o campo de e-mail.');
            return;
        }

        if (!validarEmail(email)) {
            mostrarToastErro('E-mail inválido. Verifique o formato.');
            return;
        }

        try {
            const ok = await resetPassword(email);
            if (ok) {
                mostrarToastSucesso('Se houver uma conta com este e-mail, você receberá o link de redefinição.');
            }
        } catch (err) {
            const isInvalid = err?.code === 'auth/invalid-email';
            mostrarToastErro(isInvalid ? 'E-mail inválido. Verifique o formato.' : 'Ocorreu um erro ao enviar o link.');
        }
    };

    return (
        <BackgroundImage source={require('~/assets/img/backgroundImage/imagemFundo3.png')}>
            <SafeAreaView className="w-full h-full">
                <HeaderAuth />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="justify-center flex-1 px-10">
                        <Text className="text-colorLight200 text-5xl font-semibold text-center mb-20">
                            Redefinir senha
                        </Text>

                        <Input
                            placeholder="Digite o e-mail de cadastro"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                            placeholderTextColor="#5d5d5d"
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setCampoFocado('email')}
                            onBlur={() => setCampoFocado('')}
                            style={{
                                borderColor: campoFocado === 'email' ? '#6943FF' : '#27272A',
                            }}
                        />

                        <View className="items-center mt-20">
                            <ButtonViolet
                                onPress={handleReset}
                                disabled={loading}
                                style={{
                                    shadowColor: '#6943FF',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12,
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#E4E4E7" />
                                ) : (
                                    <ButtonTextViolet>Enviar</ButtonTextViolet>
                                )}
                            </ButtonViolet>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BackgroundImage>
    );
}