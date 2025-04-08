import { SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';

import BackgroundImage from '~/components/loadingBackgroundImage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '~/hook/useAuthentication';

export default function ResetPassword() {
    const { resetPassword, loading } = useAuth();
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');


    const handleReset = async () => {
        setFormError('');

        if (!email) {
            setFormError("Por favor, preencha o campo de e-mail.");
            return;
        }

        try {
            const ok = await resetPassword(email);
            if (ok) {
                Alert.alert(
                    "Sucesso!",
                    "Se houver uma conta com este e-mail, você receberá um link para redefinir a senha.",
                    [{ text: "OK", onPress: () => navigation.navigate('loginPassword') }]
                );
            }
        } catch (err) {
            if (err.code === 'auth/invalid-email') {
                setFormError("E-mail inválido. Verifique o formato.");
            } else {
                setFormError("Ocorreu um erro ao enviar o link de redefinição.");
            }
        }
    };

    return (
        <BackgroundImage source={require('~/assets/img/backgroundImage/imagemFundo3.png')}>
            <SafeAreaView className='w-full h-full flex-1 justify-center items-center'>
                <View className="absolute top-0 left-0 w-full px-5 pt-16 z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-ios-new" size={25} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <View className='px-10 w-full'>
                    <Text className="text-colorLight200 text-5xl font-semibold text-center">
                        Redefinir senha
                    </Text>

                    <View className='mt-20 mb-2'>
                        <Input
                            placeholder='Email'
                            placeholderTextColor='#5d5d5d'
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {formError ? (
                        <Text className="text-red-500 text-sm mb-5 text-center">{formError}</Text>
                    ) : null}

                    <View className="flex-row items-center justify-center mt-10">
                        <ButtonViolet onPress={handleReset} disabled={loading}>
                            <ButtonTextViolet>
                                {loading ? 'Enviando...' : 'Enviar'}
                            </ButtonTextViolet>
                        </ButtonViolet>
                    </View>
                </View>
            </SafeAreaView>
        </BackgroundImage>
    );
}
