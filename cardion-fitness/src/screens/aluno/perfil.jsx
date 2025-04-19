import { View, Text, TouchableOpacity, Alert, Image, SafeAreaView, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import { InputPassword } from '~/components/inputPassword';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

import { Asset } from 'expo-asset';

import { SERVER_URL } from '~/apiConfig/config';

import { useGet } from '~/hook/crud/useGet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';

export default function Perfil({ }) {

    const navigation = useNavigation();

    const [imageUrl, setImageUrl] = useState(null);
    const [nome, setNome] = useState();
    const [email, setEmail] = useState();
    const [telefone, setTelefone] = useState();
    const [dataNasc, setDataNascimento] = useState();
    const [sexo, setSexo] = useState();
    const [peso, setPeso] = useState();
    const [altura, setAltura] = useState();
    const [objetivo, setObjetivo] = useState();
    const { getById } = useGet()
    const [filename, setFilename] = useState()

    const trazerDados = async () => {
        const user = await getById()
        setNome(user.nome)
        setEmail(user.email)
        setTelefone(user.telefone)
        setDataNascimento(user.dataNasc)
        setSexo(user.sexo)
        setPeso(user.peso)
        setAltura(user.altura)
        setObjetivo(user.objetivo)
        Alert.alert(user.nome)
    }

    useEffect(() => {
        const fetchNome = async () => {
            await trazerDados();
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

    return (
        <ScrollView
            bounces={false}
            overScrollMode='never'
        >
            <SafeAreaView className='flex-1 w-full h-full bg-colorBackground'>
                <View className="pt-5 px-5">
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={28} color="#6943FF" />
                    </TouchableOpacity>
                </View>
                <View className='px-10'>
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
                    <View>
                        <Input
                            placeholder='Nome'
                            placeholderTextColor='#5d5d5d'
                            value={nome}
                        />
                        <Input placeholder='E-mail'
                            placeholderTextColor='#5d5d5d'
                            value={email}
                        />
                        <Input
                            placeholder='Telefone'
                            placeholderTextColor='#5d5d5d'
                            value={telefone}

                        />
                        <Input
                            placeholder='Data de Nascimento'
                            placeholderTextColor='#5d5d5d'
                            value={dataNasc}
                        />
                        <Input
                            placeholder='Sexo'
                            placeholderTextColor='#5d5d5d'
                            value={sexo}

                        />
                        <Input placeholder='Peso'
                            placeholderTextColor='#5d5d5d'
                            value={peso}
                        />
                        <Input
                            placeholder='Altura'
                            placeholderTextColor='#5d5d5d'
                            value={altura}

                        />
                        <Input
                            placeholder='Objetivo'
                            placeholderTextColor='#5d5d5d'
                            value={objetivo}
                        />

                        <ButtonViolet>
                            <ButtonTextViolet>Salvar</ButtonTextViolet>
                        </ButtonViolet>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};