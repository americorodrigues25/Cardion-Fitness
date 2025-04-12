import { SafeAreaView, View, Image, Text, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import { InputPassword } from '~/components/inputPassword';

import BackgroundImage from '~/components/loadingBackgroundImage';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    const [showModal, setShowModal] = useState(false);

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
            const user = await signUp(name,email, password, rememberMe);
            if (user) {
                await AsyncStorage.setItem('userType', 'aluno');

                if (rememberMe) {
                    await AsyncStorage.setItem('userLoggedIn', 'true');
                } else {
                    await AsyncStorage.removeItem('userLoggedIn');
                }

                setShowModal(true);
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                navigation.replace('homeAluno');
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

    return (
        <BackgroundImage
            source={require('~/assets/img/backgroundImage/imagemFundo3.png')}
        >

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View className="flex-1 items-center justify-center bg-black/70">
                    <View className="bg-colorDark100 rounded-3xl p-10 w-10/12 items-center h-2/4 justify-center">
                        <Icon name="check-circle" size={90} color="#6943ff" />
                        <Text className="text-5xl font-semibold mb-4 mt-10 text-center text-colorViolet">
                            Parabéns!
                        </Text>
                        <Text className="text-xl font-semibold mb-4 text-center text-colorLight200">
                            Sua conta está pronta para uso
                        </Text>

                        <ButtonViolet
                            onPress={() => setShowModal(false)}
                        >
                            <ButtonTextViolet>Acessar</ButtonTextViolet>
                        </ButtonViolet>
                    </View>
                </View>
            </Modal>


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
