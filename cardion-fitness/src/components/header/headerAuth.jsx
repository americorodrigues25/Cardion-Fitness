import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HeaderAuth() {
    const navigation = useNavigation();

    return (
        <View className="px-5 pt-5 flex-row justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
            </TouchableOpacity>
            <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
        </View>
    );
}
