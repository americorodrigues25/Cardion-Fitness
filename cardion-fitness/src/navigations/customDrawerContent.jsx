import { View, Text, Image, TouchableOpacity, Alert, Touchable } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

import { Asset } from 'expo-asset';

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

    const trazerNome = async () => {
        const user = await getById()
        setNome(user.nome)
        Alert.alert(user.nome)
    }

    useEffect(() => {
        const fetchNome = async () => {
            await trazerNome();
        };

        const fetchImage = async () => {
            const userId = await AsyncStorage.getItem("uid");
            const res = await axios.get(`${SERVER_URL}/image/${userId}`);
            setImageUrl(`${res.data.url}?${Date.now()}`);
        };

        fetchImage();
        fetchNome();
    }, [])

    const handleEditImage = () => {
        Alert.alert(
            'Alterar Foto de Perfil',
            'Escolha uma opção',
            [
                {
                    text: 'Tirar foto',
                    onPress: () => tirarFoto(),
                },
                {
                    text: 'Escolher da galeria',
                    onPress: () => escolherDaGaleria(),
                },
                {
                    text: 'Remover foto',
                    onPress: () => removerFoto(),
                },
                {
                    text: 'Cancelar',
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const tirarFoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            const formData = new FormData();

            const userId = await AsyncStorage.getItem("uid")
            formData.append('userId', userId);

            formData.append('image', {
                uri: localUri,
                name: 'upload.jpg',
                type: 'image/jpeg',
            });

            try {
                // Envia a imagem para o servidor
                const res = await axios.post(`${SERVER_URL}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                // Recebe a URL da imagem e o filename
                setImageUrl(`${res.data.url}?${new Date().getTime()}`);


                // Limpa o cache da imagem, forçando o Expo a recarregar
                Asset.fromURI(res.data.url).downloadAsync();

            } catch (error) {
                console.error('Erro no upload:', error);
            }
        }
    };

    const escolherDaGaleria = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            const formData = new FormData();

            const userId = await AsyncStorage.getItem("uid")
            formData.append('userId', userId);

            formData.append('image', {
                uri: localUri,
                name: 'upload.jpg',
                type: 'image/jpeg',
            });

            try {
                // Envia a imagem para o servidor
                const res = await axios.post(`${SERVER_URL}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                // Recebe a URL da imagem e o filename
                setImageUrl(`${res.data.url}?${new Date().getTime()}`);


                // Limpa o cache da imagem, forçando o Expo a recarregar
                Asset.fromURI(res.data.url).downloadAsync();

            } catch (error) {
                console.error('Erro no upload:', error);
            }
        }
    };


    const removerFoto = async () => {
        try {
            const userId = await AsyncStorage.getItem("uid");
            await axios.delete(`${SERVER_URL}/image/${userId}`);

            setImageUrl(null);
            Alert.alert('Imagem removida', 'A imagem de perfil foi resetada.');
        } catch (error) {
            console.error('Erro ao remover imagem:', error);
            Alert.alert('Erro', 'Não foi possível remover a imagem.');
        };
    }

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
                                    className="w-40 h-40 rounded-full border-4 border-colorViolet"
                                />


                            <TouchableOpacity
                                onPress={handleEditImage}
                                className="absolute bottom-0 right-2 bg-colorViolet rounded-full p-2"
                            >
                                <Ionicons name="camera" size={25} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-2xl font-bold mt-5 text-colorLight200">{nome}</Text>
                    </View>

                    <View className="px-2 mt-10">
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Inicio')}
                            className={`flex-row items-center ${isActive('Inicio') ? 'bg-colorViolet rounded-full p-2' : ''
                                }`}
                        >
                            <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                <Entypo name="home" size={25} color="#E4E4E7" />
                            </View>
                            <Text className="text-colorLight200 text-lg">Inicio</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Meu Perfil')}
                            className={`flex-row items-center mt-5 ${isActive('Meu Perfil') ? 'bg-colorViolet rounded-full p-2' : ''
                                }`}
                        >
                            <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                <MaterialCommunityIcons name="pencil" size={25} color="#E4E4E7" />
                            </View>
                            <Text className="text-colorLight200 text-lg">Meu perfil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { }} className="flex-row items-center mt-5">
                            <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                <MaterialCommunityIcons name="headset" size={25} color="#E4E4E7" />
                            </View>
                            <Text className="text-colorLight200 text-lg">Ajuda e Suporte</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { }} className="flex-row items-center mt-5">
                            <View className="bg-colorDark100 p-2 rounded-full mr-3">
                                <MaterialCommunityIcons name="shield-lock" size={25} color="#E4E4E7" />
                            </View>
                            <Text className="text-colorLight200 text-lg">Política de privacidade</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-10 mb-6">
                    <TouchableOpacity onPress={handleLogout} className="flex-row items-center bg-red-600 rounded-full py-3 justify-center">
                        <Text className="text-colorLight200 text-lg font-bold text-center">SAIR DA CONTA</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </DrawerContentScrollView>

    );
}
