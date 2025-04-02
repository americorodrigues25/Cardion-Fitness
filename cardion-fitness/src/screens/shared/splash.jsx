import { useEffect, useState } from 'react';
import { SafeAreaView, Image, ActivityIndicator } from "react-native";

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
        <SafeAreaView className='flex-1 justify-center items-center bg-colorDark400'>
            {showSplash && (
                <Image
                    source={require('../../assets/img/Logo1.png')}
                    className='w-10/12'
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
    );
}
