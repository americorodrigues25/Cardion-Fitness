import { useState } from 'react';
import { ImageBackground, View, ActivityIndicator } from 'react-native';

export default function BackgroundWrapper({ children, source }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <View className="flex-1">
            <ImageBackground
                source={source}
                className="flex-1 justify-center items-center w-full h-full"
                onLoadEnd={() => setImageLoaded(true)}
            >
                {!imageLoaded && (
                    <ActivityIndicator size="large" color="#6943FF" style={{ position: 'absolute' }} />
                )}

                {imageLoaded && children}
            </ImageBackground>
        </View>
    );
}
