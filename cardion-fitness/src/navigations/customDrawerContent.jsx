import { View, Text, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import axios from 'axios';

import { SERVER_URL } from '~/apiConfig/config';

import { useGet } from '~/hook/crud/useGet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';

export default function CustomDrawerContent(props) {

    const { navigation, state } = props;
    const currentRoute = props.state.routeNames[props.state.index];

    const isActive = (routeName) => currentRoute === routeName;

    const [imageUrl, setImageUrl] = useState(null);
    const [nome, setNome] = useState();
    const { getById } = useGet()
    const [filename, setFilename] = useState()

    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getById();
                setNome(user.nome);
                setRole(user.role || (await AsyncStorage.getItem('role')));
                console.log('Tipo de usuário:', user.role);
            } catch (error) {
                console.log('Erro ao buscar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchNome = async () => {
            await trazerNome();
        };

        const fetchImage = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            const token = await user.getIdToken();

            const userId = await AsyncStorage.getItem("uid");
            const res = await axios.get(`${SERVER_URL}/image/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setImageUrl(`${res.data.url}?${Date.now()}`);
        };

        fetchImage();
        fetchNome();
    }, [])

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            await AsyncStorage.removeItem('userLoggedIn');
            navigation.replace('userType');
        } catch (error) {
            Alert.alert('Erro ao sair:', error)
        }
    };

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1 }}
            className="bg-colorViolet"
        >
            <View className="flex-1 justify-between">
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <View className="py-5 items-center">
                            <View className="relative">
                                <Image
                                    key={imageUrl}
                                    source={
                                        imageUrl
                                            ? { uri: imageUrl }
                                            : require('~/assets/img/imgProfileDefault.png')
                                    }
                                    resizeMode="cover"
                                    className="w-40 h-40 rounded-full border-[3px] border-colorViolet"
                                />
                            </View>
                            <Text className="text-2xl font-medium mt-5 text-colorLight200">{nome}</Text>
                        </View>

                        <View className="px-2 py-5">
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Inicio')}
                                className={`flex-row items-center ${isActive('Inicio') ? 'bg-colorViolet rounded-full p-2' : ''
                                    }`}
                            >
                                <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                    <Entypo name="home" size={23} color="#E4E4E7" />
                                </View>
                                <Text className="text-colorLight200 text-base font-medium">Início</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Meu Perfil')}
                                className={`flex-row items-center mt-5 ${isActive('Meu Perfil') ? 'bg-colorViolet rounded-full p-2' : ''
                                    }`}
                            >
                                <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                    <MaterialCommunityIcons name="pencil" size={23} color="#E4E4E7" />
                                </View>
                                <Text className="text-colorLight200 text-base font-medium">Editar perfil</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Ajuda e Suporte')}
                                className={`flex-row items-center mt-5 ${isActive('Ajuda e Suporte') ? 'bg-colorViolet rounded-full p-2' : ''
                                    }`}
                            >
                                <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                    <MaterialCommunityIcons name="headset" size={23} color="#E4E4E7" />
                                </View>
                                <Text className="text-colorLight200 text-base font-medium">Ajuda e Suporte</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Politica de privacidade')}
                                className={`flex-row items-center mt-5 ${isActive('Politica de privacidade') ? 'bg-colorViolet rounded-full p-2' : ''
                                    }`}
                            >
                                <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                    <MaterialCommunityIcons name="shield-lock" size={23} color="#E4E4E7" />
                                </View>
                                <Text className="text-colorLight200 text-base font-medium">Política de privacidade</Text>
                            </TouchableOpacity>

                            {role === 'aluno' && (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Infos Personal')}
                                    className={`flex-row items-center mt-5 ${isActive('Infos Personal') ? 'bg-colorViolet rounded-full p-2' : ''
                                        }`}
                                >
                                    <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                        <MaterialCommunityIcons name="account-details" size={23} color="#E4E4E7" />
                                    </View>
                                    <Text className="text-colorLight200 text-base font-medium">Meu Personal</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </ScrollView>

                <View className="px-10 my-6">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center bg-colorViolet rounded-full py-3 justify-center"
                    >
                        <Text className="text-colorLight200 text-base font-semibold text-center">
                            SAIR DA CONTA
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </DrawerContentScrollView>

    );
}
