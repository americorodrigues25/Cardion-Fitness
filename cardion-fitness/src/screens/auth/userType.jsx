import { View, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import BackgroundImage from '~/components/loadingBackgroundImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import * as Notifications from 'expo-notifications';
import { configurarNotificacoes } from '~/services/notifications';


export default function UserType() {
    const navigation = useNavigation();

    //solicita permissão de notificação
    useEffect(() => {
        const requestPermission = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                console.log('Permissão ok');

                //depois de o usuario permitir vai agendar as notificações
                configurarNotificacoes();
            } else {
                console.log('Permissão negada');
            }
        };

        requestPermission();
    }, []);

    const handleAluno = async () => {
        const role = await AsyncStorage.getItem('role')

        if (role) {
            await AsyncStorage.removeItem('role')
        }

        await AsyncStorage.setItem('role', 'aluno');
        navigation.navigate('loginPassword',)
    }

    const handlePersonal = async () => {
        const role = await AsyncStorage.getItem('role')

        if (role) {
            await AsyncStorage.removeItem('role')
        }

        await AsyncStorage.setItem('role', 'personal');
        navigation.navigate('loginPassword',)
    }

    return (
        <BackgroundImage
            source={require('~/assets/img/backgroundImage/imagemFundo2.png')}
            style={{ resizeMode: 'contain' }}
        >
            <SafeAreaView className='w-full items-center'>

                <Image
                    source={require('~/assets/img/logo/Logo1.png')}
                    className='w-6/12' style={{ resizeMode: 'contain' }}
                />

                <View className='w-full items-center mt-10 px-12'>
                    <ButtonViolet
                        onPress={() => handleAluno()}
                        style={{
                            shadowColor: '#6943FF',
                            shadowOffset: 0,
                            shadowOpacity: 0.7,
                            shadowRadius: 7,
                            elevation: 12,
                        }}>
                        <ButtonTextViolet >SOU ALUNO</ButtonTextViolet>
                    </ButtonViolet>

                    <ButtonViolet
                        onPress={() => handlePersonal()}
                        style={{
                            shadowColor: '#6943FF',
                            shadowOffset: 0,
                            shadowOpacity: 0.7,
                            shadowRadius: 7,
                            elevation: 12,
                            marginTop: 15,
                        }}>
                        <ButtonTextViolet>SOU PERSONAL</ButtonTextViolet>
                    </ButtonViolet>
                </View>

            </SafeAreaView>
        </BackgroundImage>
    );
}
