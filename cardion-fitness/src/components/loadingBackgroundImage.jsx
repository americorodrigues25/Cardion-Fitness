import { ImageBackground, View, ActivityIndicator } from 'react-native';
import { useState } from 'react';

export default function BackgroundImage({ children, source }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <View className="flex-1">
            <ImageBackground
                source={source}
                className="flex-1 justify-center items-center w-full h-full bg-colorInputs"
                onLoadEnd={() => setImageLoaded(true)}
            >
                {!imageLoaded && (
                    <ActivityIndicator
                        size="large"
                        color="#6943FF"
                        style={{ position: 'absolute' }}
                    />
                )}
                {imageLoaded && children}
            </ImageBackground>
        </View>
    );
}
