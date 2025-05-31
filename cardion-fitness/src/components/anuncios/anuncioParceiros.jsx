import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const imageRatio = 0.55;

const ad = {
  id: '1',
  title: 'Super desconto CrossFit Suzano',
  image: require('~/assets/img/anuncios/imageBannerCFS2.jpg'),
  link: 'https://exemplo-suplemento.com',
};

export default function AdCarousel({ visible, onClose }) {
  const [showAd, setShowAd] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      setShowAd(false);
      opacity.setValue(0);
      return;
    }

    const timer = setTimeout(() => {
      setShowAd(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (!showAd) return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [showAd]);

  const handlePress = () => {
    Linking.openURL(ad.link);
  };

  if (!showAd) return null;

  const imageWidth = width * 0.7;
  const imageHeight = imageWidth / imageRatio;

  return (
    <Modal visible={showAd} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-center items-center p-5">
        <Animated.View
          style={{ opacity }}
          className="rounded-2xl overflow-hidden items-center"
        >
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.9}
            className="bg-white rounded-2xl border-4 border-gray-200 shadow-lg"
            style={{ width: imageWidth }}
          >

            <View className="bg-gray-200 py-1.5 justify-center items-center border-b border-gray-300">
              <Text className="text-xs text-gray-600 font-semibold">Anúncio de Terceiro</Text>
            </View>

            <Image
              source={ad.image}
              style={{ width: '100%', height: imageHeight }}
              resizeMode="cover"
              className='rounded-b-2xl'
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="flex-row items-center mt-3 bg-white px-3 py-1.5 rounded-full border border-gray-300"
          >
            <Ionicons name="close" size={18} color="#6943FF" className="mr-1.5" />
            <Text className="text-sm text-colorViolet font-semibold">Fechar Anúncio</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
