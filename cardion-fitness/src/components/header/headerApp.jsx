import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HeaderApp({ onPressIcon, loading = false }) {
    return (
        <View className="flex-row items-center justify-between mb-2">
            <Image
                source={require('~/assets/img/logo/Logo1.png')}
                className="w-20 h-10"
                resizeMode="contain"
            />

            <TouchableOpacity onPress={onPressIcon} disabled={loading} className="p-2">
                {loading ? (
                    <ActivityIndicator size="small" color="#6943FF" />
                ) : (
                    <MaterialCommunityIcons name="message-reply-text-outline" size={20} color="#e4e4e7" />
                )}
            </TouchableOpacity>
        </View>
    );
}
