import { SafeAreaView, View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';

import BackgroundImage from '~/components/loadingBackgroundImage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// hook
import { useAuth } from '~/hook/useAuthentication';

export default function ResetPassword({ }) {
    const { resetPassword,login, signUp, loading, error } = useAuth();
    const navigation = useNavigation();
    const [rememberMe, setRememberMe] = useState(false);
    const [email,setEmail] = useState()


    const handleReset = async () => {
        const ok = await resetPassword(email);
        if (ok) {
          setSuccess(true);
        }
      };

    return (
        <BackgroundImage
            source={require('~/assets/img/backgroundImage/imagemFundo3.png')}
        >

            <SafeAreaView className='w-full h-full'>
                <View className="absolute top-0 left-0 w-full px-5 pt-16 z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-ios-new" size={25} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <View className='px-10'>
                    <Text className="text-colorLight200 text-5xl font-semibold text-center mt-20 mb-10 px-10">
                        Esqueci minha senha
                    </Text>

                    <Input
                        placeholder='Email'
                        placeholderTextColor='#5d5d5d'
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* todo: alterar estilo do botao de redefinir senha */}
                    <View className="mt-10 flex-row items-center gap-2 justify-center">
                        <TouchableOpacity
                            onPress={handleReset}
                            activeOpacity={0.7}
                            className="w-6 h-6 rounded-md border-2 border-colorViolet flex items-center justify-center"
                        >
                           
                        </TouchableOpacity>

                        <Text className="text-gray-300 text-lg">Enviar link de redefinição</Text>
                    </View>


                    <View className='flex-1 items-center flex-row justify-center gap-5 my-20'>
                        <TouchableOpacity className="flex-row items-center justify-center bg-colorInputs border-colorDark100 border-[1.5px] p-4 rounded-2xl  w-20">
                            <Image source={require('~/assets/img/redeSocial/facebook.png')} className='w-10 h-10' />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-center bg-colorInputs border-colorDark100 border-[1.5px] p-4 rounded-2xl w-20">
                            <Image source={require('~/assets/img/redeSocial/google.png')} className='w-10 h-10' />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-center bg-colorInputs border-colorDark100 border-[1.5px] p-4 rounded-2xl w-20">
                            <Image source={require('~/assets/img/redeSocial/logotipo-da-apple.png')} className='w-10 h-10' />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity className=''>
                        <Text className="text-colorLight200 text-base font-normal text-center">
                            Esqueci minha <Text className='text-colorViolet font-semibold'>senha</Text>
                        </Text>
                    </TouchableOpacity>


                </View>
            </SafeAreaView>
        </BackgroundImage>
    )
};