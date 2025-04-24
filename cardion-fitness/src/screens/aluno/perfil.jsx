import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

import { Asset } from 'expo-asset';

import { SERVER_URL } from '~/apiConfig/config';

import { useGet } from '~/hook/crud/useGet';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getAuth, signOut } from 'firebase/auth';

import { useUpdate } from '~/hook/crud/useUpdate';

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
    const { updateDadosBasicos } = useUpdate();

    const atualizarDados = async () => {
        const data = {
            dataNasc: dataNasc,
            sexo: sexo,
            peso: peso,
            altura: altura,
            objetivo: objetivo,
            nome: nome,
            telefone: telefone
        }

        const result = await updateDadosBasicos(data)

        if (result) {
            Toast.show({
                type: 'success',
                text1: 'Dados atualizados com sucesso ! 🎉',
            });
        } else {
            Alert.alert("Erro")
        }
    }

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
        <SafeAreaView
            edges={['top']}
            className='flex-1 bg-colorBackground'
        >
            <ScrollView
                bounces={false}
                overScrollMode='never'
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="pt-5 px-5">
                    <TouchableOpacity onPress={() => navigation.openDrawer()} className="flex-row">
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                        <Text className="ml-2 text-colorLight200">Editar perfil</Text>
                    </TouchableOpacity>
                </View>
                <View className='px-10 py-10'>
                    <View className="items-center">
                        <View className="relative">
                            <Image
                                key={imageUrl}
                                source={
                                    imageUrl
                                        ? { uri: imageUrl }
                                        : require('~/assets/img/imgProfileDefault.png')
                                }
                                resizeMode="cover"
                                className="w-40 h-40 rounded-full"
                            />

                            <TouchableOpacity
                                onPress={handleEditImage}
                                className="absolute bottom-0 right-2 bg-colorViolet rounded-2xl p-2"
                            >
                                <FontAwesome name="pencil" size={25} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='mt-5'>
                        <Text className='px-12 text-colorLight200 text-lg font-semibold mb-1'>Nome:</Text>
                        <Input
                            placeholder='Nome'
                            placeholderTextColor='#5d5d5d'
                            value={nome}
                            onChangeText={setNome}
                        />
                        <Text className='px-12 text-colorLight200 text-lg font-semibold mb-1'>E-mail:</Text>
                        <Input placeholder='E-mail'
                            placeholderTextColor='#5d5d5d'
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text className='px-12 text-colorLight200 text-lg font-semibold mb-1'>Telefone:</Text>
                        <Input
                            placeholder='Telefone'
                            placeholderTextColor='#5d5d5d'
                            value={telefone}
                            onChangeText={setTelefone}

                        />
                        <Text className='px-12 text-colorLight200 text-lg font-semibold mb-1'>Data de nascimento:</Text>
                        <Input
                            placeholder='Data de Nascimento'
                            placeholderTextColor='#5d5d5d'
                            value={dataNasc}
                            onChangeText={setDataNascimento}
                        />
                        <Text className='px-12 text-colorLight200 text-lg font-semibold mb-1'>Sexo:</Text>
                        <Input
                            placeholder='Sexo'
                            placeholderTextColor='#5d5d5d'
                            value={sexo}
                            onChangeText={setSexo}

                        />
                        <Text className='px-12 text-colorLight200 text-lg font-semibold'>Peso:</Text>
                        <Input placeholder='Peso'
                            placeholderTextColor='#5d5d5d'
                            value={peso}
                            onChangeText={setPeso}
                        />
                        <Text className='px-12 text-colorLight200 text-lg font-semibold mb-1'>Altura:</Text>
                        <Input
                            placeholder='Altura'
                            placeholderTextColor='#5d5d5d'
                            value={altura}
                            onChangeText={setAltura}

                        />
                        <Text className='px-12 text-colorLight200 text-lg font-semibold mb-1'>Objetivo:</Text>
                        <Input
                            placeholder='Objetivo'
                            placeholderTextColor='#5d5d5d'
                            value={objetivo}
                            onChangeText={setObjetivo}
                        />
                        <View className='my-5'>
                            <ButtonViolet onPress={atualizarDados}>
                                <ButtonTextViolet>Salvar</ButtonTextViolet>
                            </ButtonViolet>
                        </View>
                    </View>
                </View>
            </ScrollView >
        </SafeAreaView>
    );
};