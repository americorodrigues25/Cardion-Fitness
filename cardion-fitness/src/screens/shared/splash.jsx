import { Image, ActivityIndicator, SafeAreaView } from "react-native";
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BackgroundImage from '~/components/loadingBackgroundImage';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Splash({ navigation }) {
    const [loadingIsVisible, setLoadingIsVisible] = useState(false);

    useEffect(() => {
        const auth = getAuth();

        const checkAuth = async () => {

            await new Promise(resolve => setTimeout(resolve, 2500));
            setLoadingIsVisible(true);


            await new Promise(resolve => setTimeout(resolve, 2500));

            try {
                const remember = await AsyncStorage.getItem('userLoggedIn');

                onAuthStateChanged(auth, (user) => {
                    if (user && remember === 'true') {
                        { /*Busca se o usuario já está autenticado e entra na conta correspondente*/ }
                        navigation.replace('homeAluno');
                    }
                    else {
                        navigation.replace('userType');
                    }
                });
            } catch (err) {
                console.log("Erro ao verificar autenticação:", err);
                navigation.replace('userType');
            }

            setLoadingIsVisible(false);
        };

        checkAuth();
    }, []);

    return (
        <BackgroundImage
            source={require('~/assets/img/backgroundImage/imagemFundo1.png')}
            style={{ resizeMode: 'contain' }}
        >
            <SafeAreaView className='flex-1 justify-center items-center'>
                <Image
                    source={require('~/assets/img/logo/Logo2.png')}
                    className='w-8/12 absolute'
                    style={{ resizeMode: 'contain' }}
                />
                {loadingIsVisible && (
                    <ActivityIndicator
                        size="large"
                        color="#ffffff"
                        className="absolute bottom-[350px]"
                    />
                )}
            </SafeAreaView>
        </BackgroundImage>

    );
}
