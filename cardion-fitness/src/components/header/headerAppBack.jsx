import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HeaderAppBack({ title }) {
    const navigation = useNavigation();

    return (
        <View className="pt-5 px-5">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
                <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                <Text className="ml-2 text-colorLight200">{title}</Text>
            </TouchableOpacity>
        </View>
    );
}
