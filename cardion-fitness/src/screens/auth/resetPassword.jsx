import { SafeAreaView, View, Text, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';

import Toast from 'react-native-toast-message';

import BackgroundImage from '~/components/loadingBackgroundImage';

import { useAuth } from '~/hook/useAuthentication';

export default function ResetPassword() {
    const { resetPassword, loading } = useAuth();
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [campoFocado, setCampoFocado] = useState('');


    const handleReset = async () => {

        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Por favor, preencha o campo de e-mail.',
            });
            return;
        }

        try {
            const ok = await resetPassword(email);
            if (ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso!',
                    text2: 'Se houver uma conta com este e-mail, você receberá um link para redefinir a senha.',
                    onHide: () => navigation.navigate('loginPassword'),
                    visibilityTime: 3000,
                });
            }
        } catch (err) {
            if (err.code === 'auth/invalid-email') {
                Toast.show({
                    type: 'error',
                    text1: 'E-mail inválido',
                    text2: 'Verifique o formato do e-mail.',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Ocorreu um erro ao enviar o link de redefinição.',
                });
            }
        }
    };

    return (
        <BackgroundImage source={require('~/assets/img/backgroundImage/imagemFundo3.png')}>
            <SafeAreaView className='w-full h-full'>
                <View className=" px-5 pt-5 flex-row justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                    </TouchableOpacity>
                    <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1">

                    <View className='justify-center flex-1'>
                        <Text className="text-colorLight200 text-5xl font-semibold text-center">
                            Redefinir senha
                        </Text>

                        <View className='px-10 w-full'>

                            <View className='mt-20'>
                                <Input
                                    placeholder='Digite o e-mail de cadastro'
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
                            </View>

                            <View className="flex-row items-center justify-center mt-20">
                                <ButtonViolet onPress={handleReset} disabled={loading}
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
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BackgroundImage>
    );
}
