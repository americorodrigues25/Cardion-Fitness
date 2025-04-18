import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

import { Asset } from 'expo-asset';

import { SERVER_URL } from '~/apiConfig/config';

import { useGet } from '~/hook/crud/useGet';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomDrawerContent(props) {

    const [imageUrl, setImageUrl] = useState(null);
    const [nome, setNome] = useState();
    const { getById } = useGet()
    const[filename,setFilename] = useState()

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
            formData.append('userId',userId );

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
                formData.append('userId',userId );

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
        };}
          
    return (
        <DrawerContentScrollView {...props}>
            <View className='py-5 items-center'>
                <View className='relative'>
                    <Image
                    key={imageUrl}
                        source={ imageUrl
                            ? { uri: imageUrl }
                            : require('~/assets/img/imgProfileDefault.png')}
                        className='w-48 h-48 rounded-full'
                    />
                    <TouchableOpacity
                        onPress={handleEditImage}
                        className='absolute bottom-8 right-7 bg-colorLight200 rounded-full p-2'
                    >
                        <Ionicons name="camera" size={25} color="#000" />
                    </TouchableOpacity>
                </View>

                <Text className='text-xl font-bold'>{nome}</Text>
            </View>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}
