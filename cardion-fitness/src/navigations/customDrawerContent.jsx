import { View, Text, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useEffect, useState, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';

import { SERVER_URL } from '~/apiConfig/config';
import { useGet } from '~/hook/crud/useGet';

export default function CustomDrawerContent(props) {
    const { navigation, state } = props;
    const currentRoute = state.routeNames[state.index];
    const isActive = (routeName) => currentRoute === routeName;

    const [imageUrl, setImageUrl] = useState(null);
    const [nome, setNome] = useState('');
    const [role, setRole] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { getById } = useGet();

    const fetchUserInfo = useCallback(async () => {
        try {
            const user = await getById();
            setNome(user.nome);
            setRole(user.role || (await AsyncStorage.getItem('role')));
        } catch (err) {
            console.error('Erro ao buscar dados do usuário:', err);
        }
    }, []);

    const fetchProfileImage = useCallback(async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const token = await user?.getIdToken();
            const userId = await AsyncStorage.getItem('uid');

            const res = await axios.get(`${SERVER_URL}/image/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setImageUrl(`${res.data.url}?${Date.now()}`);
        } catch (err) {
            console.error('Erro ao buscar imagem de perfil:', err);
        }
    }, []);

    useEffect(() => {
        fetchUserInfo();
        fetchProfileImage();
    }, [fetchUserInfo, fetchProfileImage]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut(getAuth());
            await AsyncStorage.removeItem('userLoggedIn');
            navigation.replace('userType');
        } catch (error) {
            Alert.alert('Erro ao sair', error.message || 'Tente novamente.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const renderItem = (label, icon, route) => (
        <TouchableOpacity
            onPress={() => navigation.navigate(route)}
            className={`flex-row items-center mt-5 ${isActive(route) ? 'bg-colorViolet rounded-full p-2' : ''}`}
        >
            <View className="bg-colorDark100 p-2 rounded-full mr-3">
                {icon}
            </View>
            <Text className="text-colorLight200 text-base font-medium">{label}</Text>
        </TouchableOpacity>
    );

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }} className="bg-colorViolet">
            <View className="flex-1 justify-between">
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="items-center py-5">
                        <Image
                            key={imageUrl}
                            source={imageUrl ? { uri: imageUrl } : require('~/assets/img/imgProfileDefault.png')}
                            resizeMode="cover"
                            className="w-40 h-40 rounded-full border-[3px] border-colorViolet"
                        />
                        <Text className="text-2xl font-medium mt-5 text-colorLight200">{nome}</Text>
                    </View>

                    <View className="px-4 py-5">
                        {renderItem('Início', <Entypo name="home" size={23} color="#E4E4E7" />, 'Inicio')}
                        {renderItem('Editar perfil', <MaterialCommunityIcons name="pencil" size={23} color="#E4E4E7" />, 'Meu Perfil')}
                        {renderItem('Ajuda e Suporte', <MaterialCommunityIcons name="headset" size={23} color="#E4E4E7" />, 'Ajuda e Suporte')}
                        {renderItem('Política de privacidade', <MaterialCommunityIcons name="shield-lock" size={23} color="#E4E4E7" />, 'Politica de privacidade')}

                        {role === 'aluno' &&
                            renderItem('Meu Personal', <MaterialCommunityIcons name="account-details" size={23} color="#E4E4E7" />, 'Infos Personal')}
                    </View>
                </ScrollView>

                <View className="px-10 my-6">
                    <TouchableOpacity
                        onPress={handleLogout}
                        disabled={isLoggingOut}
                        className="flex-row items-center bg-colorViolet rounded-full py-3 justify-center"
                    >
                        {isLoggingOut ? (
                            <ActivityIndicator size="small" color="#E4E4E7" />
                        ) : (
                            <Text className="text-colorLight200 text-base font-semibold text-center">SAIR DA CONTA</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </DrawerContentScrollView>
    );
}
