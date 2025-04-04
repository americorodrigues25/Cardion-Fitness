import { useEffect, useState } from 'react';
import { Image, ActivityIndicator, SafeAreaView } from "react-native";
import BackgroundWrapper from '~/components/loadingBackgroundImage'

export default function Splash({ navigation }) {
    const [showSplash] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowLoading(true);
        }, 2500);

        setTimeout(() => {
            setShowLoading(false);
            navigation.replace('userType');
        }, 5000);
    }, []);

    return (
        <BackgroundWrapper
            source={require('../../assets/img/imagemFundo1.png')}
            style={{ resizeMode: 'contain' }}
        >
            <SafeAreaView className='flex-1 justify-center items-center'>
                {showSplash && (
                    <Image
                        source={require('../../assets/img/Logo2.png')}
                        className='w-8/12 absolute'
                        style={{ resizeMode: 'contain' }}
                    />
                )}
                {showLoading && (
                    <ActivityIndicator
                        size="large"
                        color="#ffffff"
                        style={{ position: 'absolute', bottom: '350' }}
                    />
                )}
            </SafeAreaView>
        </BackgroundWrapper>

    );
}
