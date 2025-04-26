import { View, Text, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';


import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

import { Asset } from 'expo-asset';

import { SERVER_URL } from '~/apiConfig/config';

import { useGet } from '~/hook/crud/useGet';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const { getById } = useGet();
    const [filename, setFilename] = useState();
    const { updateDadosBasicos } = useUpdate();
    const [campoFocado, setCampoFocado] = useState('');


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
    }, []);

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
                const res = await axios.post(`${SERVER_URL}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                setImageUrl(`${res.data.url}?${new Date().getTime()}`);
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
                const res = await axios.post(`${SERVER_URL}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                setImageUrl(`${res.data.url}?${new Date().getTime()}`);
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
                <ScrollView bounces={false} overScrollMode="never" contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="pt-5 px-5">
                        <TouchableOpacity onPress={() => navigation.openDrawer()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Editar perfil</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="px-10 py-10">
                        <View className="items-center">
                            <View className="relative">
                                <Image
                                    key={imageUrl}
                                    source={imageUrl ? { uri: imageUrl } : require('~/assets/img/imgProfileDefault.png')}
                                    resizeMode="cover"
                                    className="w-40 h-40 rounded-full"
                                />
                                <TouchableOpacity onPress={handleEditImage} className="absolute bottom-0 right-2 bg-colorViolet rounded-2xl p-2">
                                    <FontAwesome name="pencil" size={25} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="mt-5">
                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">Nome:</Text>
                            <Input
                                placeholder="Digite seu nome e sobrenome"
                                keyboardType="default"
                                autoCapitalize="words"
                                autoCorrect={true}
                                returnKeyType="done"
                                maxLength={30}
                                placeholderTextColor="#5d5d5d"
                                value={nome}
                                onChangeText={setNome}
                                onFocus={() => setCampoFocado('nome')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'nome' ? '#6943FF' : '#27272A',
                                }}
                            />

                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">E-mail:</Text>
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Campo bloqueado',
                                        text2: 'Não é possível editar o e-mail',
                                        position: 'top',
                                    })
                                }
                            >
                                <View pointerEvents="box-only">
                                    <Input
                                        placeholder="E-mail"
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        textContentType="emailAddress"
                                        editable={false}
                                        placeholderTextColor="#5d5d5d"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </TouchableWithoutFeedback>

                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">Telefone:</Text>
                            <Input
                                placeholder="(XX) XXXXX-XXXX"
                                keyboardType="phone-pad"
                                textContentType="telephoneNumber"
                                returnKeyType="done"
                                mask
                                type="custom"
                                options={{ mask: '(99) 99999-9999' }}
                                placeholderTextColor="#5d5d5d"
                                value={telefone}
                                onChangeText={setTelefone}
                                onFocus={() => setCampoFocado('telefone')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'telefone' ? '#6943FF' : '#27272A',
                                }}
                            />

                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">Data de nascimento:</Text>
                            <Input
                                placeholder="(dd/mm/aaaa)"
                                keyboardType="number-pad"
                                returnKeyType="done"
                                mask
                                type="custom"
                                options={{ mask: '99/99/9999' }}
                                placeholderTextColor="#5d5d5d"
                                value={dataNasc}
                                onChangeText={setDataNascimento}
                                onFocus={() => setCampoFocado('dataNascimento')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'dataNascimento' ? '#6943FF' : '#27272A',
                                }}
                            />

                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">Selecione um gênero:</Text>
                            <View className="flex justify-between px-12 py-[22px] gap-y-3 bg-colorInputs border-[1.5px] border-colorDark100 rounded-2xl mb-1">
                                <TouchableOpacity onPress={() => setSexo('Masculino')} className="flex-row items-center">
                                    <View className={`w-5 h-5 rounded-full border-2 ${sexo === 'Masculino' ? 'bg-colorViolet border-colorViolet' : 'border-colorLight200'}`}></View>
                                    <Text className="ml-2 text-colorLight200 text-base">Masculino</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setSexo('Feminino')} className="flex-row items-center">
                                    <View className={`w-5 h-5 rounded-full border-2 ${sexo === 'Feminino' ? 'bg-colorViolet border-colorViolet' : 'border-colorLight200'}`}></View>
                                    <Text className="ml-2 text-colorLight200 text-base">Feminino</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setSexo('Outro')} className="flex-row items-center">
                                    <View className={`w-5 h-5 rounded-full border-2 ${sexo === 'Outro' ? 'bg-colorViolet border-colorViolet' : 'border-colorLight200'}`}></View>
                                    <Text className="ml-2 text-colorLight200 text-base">Outro</Text>
                                </TouchableOpacity>
                            </View>

                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">Peso:</Text>
                            <Input
                                placeholder="Digite seu peso"
                                keyboardType="number-pad"
                                returnKeyType="done"
                                mask
                                type="custom"
                                options={{ mask: '99.99' }}
                                placeholderTextColor="#5d5d5d"
                                value={peso}
                                onChangeText={setPeso}
                                onFocus={() => setCampoFocado('peso')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'peso' ? '#6943FF' : '#27272A',
                                }}
                            />

                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">Altura:</Text>
                            <Input
                                placeholder="Digite sua altura"
                                keyboardType="number-pad"
                                returnKeyType="done"
                                mask
                                type="custom"
                                options={{ mask: '9.99' }}
                                placeholderTextColor="#5d5d5d"
                                value={altura}
                                onChangeText={setAltura}
                                onFocus={() => setCampoFocado('altura')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'altura' ? '#6943FF' : '#27272A',
                                }}
                            />

                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">Objetivo:</Text>
                            <Input
                                placeholder="Objetivo"
                                keyboardType="default"
                                returnKeyType="done"
                                maxLength={30}
                                placeholderTextColor="#5d5d5d"
                                value={objetivo}
                                onChangeText={setObjetivo}
                                onFocus={() => setCampoFocado('objetivo')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'objetivo' ? '#6943FF' : '#27272A',
                                }}
                            />

                            <View className="my-5">
                                <ButtonViolet onPress={atualizarDados}>
                                    <ButtonTextViolet>Salvar</ButtonTextViolet>
                                </ButtonViolet>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
