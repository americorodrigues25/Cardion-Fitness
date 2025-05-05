import { ImageBackground, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function BackgroundImage({ children, source }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View className="flex-1">
      <ImageBackground
        source={source}
        className="flex-1 justify-center items-center w-full h-full"
        resizeMode="cover"
        onLoadEnd={() => setImageLoaded(true)}
      >
        {children}

        {!imageLoaded && (
          <View style={StyleSheet.absoluteFill} className="bg-colorBackground justify-center items-center">
            <ActivityIndicator size="large" color="#6943FF" />
          </View>
        )}
      </ImageBackground>
    </View>
  );
}
