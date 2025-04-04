import { SafeAreaView, View, Image, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';

import BackgroundImage from '~/components/loadingBackgroundImage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SignUp({ }) {
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <BackgroundImage
            source={require('~/assets/img/backgroundImage/imagemFundo3.png')}
        >

            <SafeAreaView className='w-full h-full'>
                <View className="absolute top-0 left-0 w-full px-5 pt-16 z-10">
                    <Icon name="arrow-back-ios-new" size={25} color="#FFFFFF" />
                </View>

                <View className='px-10'>
                    <Text className="text-colorLight200 text-5xl font-semibold text-center mt-20 mb-10 px-10">
                        Crie sua conta
                    </Text>

                    <Input
                        placeholder='Email'
                        placeholderTextColor='#5d5d5d'
                    />

                    <Input
                        placeholder='Senha'
                        placeholderTextColor='#5d5d5d'
                    />

                    <Input
                        placeholder='Confirme sua senha'
                        placeholderTextColor='#5d5d5d'
                    />

                    <View className="mt-10 flex-row items-center gap-2 justify-center">
                        <TouchableOpacity
                            onPress={() => setRememberMe(!rememberMe)}
                            activeOpacity={0.7}
                            className="w-6 h-6 rounded-md border-2 border-colorViolet flex items-center justify-center"
                        >
                            {rememberMe && <View className="w-6 h-6 bg-colorViolet rounded-md" />}
                        </TouchableOpacity>

                        <Text className="text-gray-300 text-lg">Lembrar</Text>
                    </View>

                    <View className='mt-5'>
                        <ButtonViolet>
                            <ButtonTextViolet>Entrar</ButtonTextViolet>
                        </ButtonViolet>
                    </View>

                    <View className="flex-row items-center mt-14">
                        <View className="flex-1 h-[0.5px] bg-gray-500" />
                        <Text className="text-colorLight200 mx-2 text-xl">ou continuar com</Text>
                        <View className="flex-1 h-[0.5px] bg-gray-500" />
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