import { Image, ActivityIndicator, SafeAreaView } from "react-native";
import { useEffect, useState } from 'react';

import BackgroundImage from '~/components/loadingBackgroundImage';

export default function Splash({ navigation }) {
    const [loadingIsVisible, setLoadingIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoadingIsVisible(true);
        }, 2500);

        setTimeout(() => {
            setLoadingIsVisible(false);
            navigation.replace('userType');
        }, 5000);
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
