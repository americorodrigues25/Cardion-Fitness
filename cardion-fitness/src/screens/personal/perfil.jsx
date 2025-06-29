import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Platform,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { Asset } from 'expo-asset';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

import { Input } from '~/components/input';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { SERVER_URL } from '~/apiConfig/config';
import { useGet } from '~/hook/crud/useGet';
import { useUpdate } from '~/hook/crud/useUpdate';

export default function Perfil() {
    const navigation = useNavigation();
    const { getById } = useGet();
    const { updateDadosBasicosPersonal } = useUpdate();

    const [imageUrl, setImageUrl] = useState(null);
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNasc, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('');
    const [campoFocado, setCampoFocado] = useState('');

    // Atualizar dados
    const atualizarDadosPersonal = async () => {
        const data = { nome, sobrenome, telefone, dataNasc, sexo, altura: null, peso: null, objetivo: null };
        const result = await updateDadosBasicosPersonal(data);

        Toast.show({
            type: result ? 'success' : 'error',
            text1: result ? 'Dados atualizados com sucesso! 🎉' : 'Erro ao atualizar',
        });
    };

    const trazerDadosPersonal = async () => {
        const user = await getById();
        setNome(user.nome);
        setSobrenome(user.sobrenome);
        setEmail(user.email);
        setTelefone(user.telefone);
        setDataNascimento(user.dataNasc);
        setSexo(user.sexo);
    };

    // Buscar foto
    const buscarFotoPerfil = async () => {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();
        const userId = await AsyncStorage.getItem('uid');
        const res = await axios.get(`${SERVER_URL}/image/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        setImageUrl(`${res.data.url}?${Date.now()}`);
    };

    useEffect(() => {
        trazerDadosPersonal();
        buscarFotoPerfil();
    }, []);

    const handleEditImage = () => {
        Alert.alert('Alterar Foto de Perfil', 'Escolha uma opção', [
            { text: 'Tirar foto', onPress: tirarFoto },
            { text: 'Escolher da galeria', onPress: escolherDaGaleria },
            { text: 'Remover foto', onPress: removerFoto },
            { text: 'Cancelar', style: 'destructive' },
        ]);
    };

    const uploadFoto = async (uri) => {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();
        const userId = await AsyncStorage.getItem('uid');

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('image', { uri, name: 'upload.jpg', type: 'image/jpeg' });

        try {
            const res = await axios.post(`${SERVER_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            setImageUrl(`${res.data.url}?${Date.now()}`);
            Asset.fromURI(res.data.url).downloadAsync();
        } catch {
            Toast.show({ type: 'error', text1: 'Erro no upload' });
        }
    };

    const tirarFoto = async () => {
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
        if (!result.canceled) uploadFoto(result.assets[0].uri);
    };

    const escolherDaGaleria = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
        if (!result.canceled) uploadFoto(result.assets[0].uri);
    };

    const removerFoto = async () => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            const userId = await AsyncStorage.getItem('uid');
            await axios.delete(`${SERVER_URL}/image/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
            setImageUrl(null);
            Toast.show({ type: 'success', text1: 'Imagem removida' });
        } catch {
            Toast.show({ type: 'error', text1: 'Erro ao remover imagem' });
        }
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never" contentContainerStyle={{ flexGrow: 1 }}>
                    {/* Topo */}
                    <View className="pt-5 px-5">
                        <TouchableOpacity onPress={() => navigation.openDrawer()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Editar perfil</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="px-10 py-10 items-center">
                        <View className="relative">
                            <Image
                                key={imageUrl}
                                source={imageUrl ? { uri: imageUrl } : require('~/assets/img/imgProfileDefault.png')}
                                className="w-40 h-40 rounded-full"
                            />
                            <TouchableOpacity onPress={handleEditImage} className="absolute bottom-0 right-2 bg-colorViolet rounded-2xl p-2">
                                <FontAwesome name="pencil" size={25} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="px-10">
                        {[
                            { label: 'Nome', value: nome, set: setNome, key: 'nome' },
                            { label: 'Sobrenome', value: sobrenome, set: setSobrenome, key: 'sobrenome' },
                            {
                                label: 'Telefone',
                                value: telefone,
                                set: setTelefone,
                                key: 'telefone',
                                mask: true,
                                type: 'custom',
                                options: { mask: '(99) 99999-9999' },
                            },
                            {
                                label: 'Data de nascimento',
                                value: dataNasc,
                                set: setDataNascimento,
                                key: 'dataNascimento',
                                mask: true,
                                type: 'custom',
                                options: { mask: '99/99/9999' },
                            },
                        ].map(({ label, value, set, key, ...rest }) => (
                            <View key={key}>
                                <Text className="px-2 text-colorLight200 text-lg font-semibold mb-1">{label}:</Text>
                                <Input
                                    placeholder={`Digite seu ${label.toLowerCase()}`}
                                    placeholderTextColor="#5d5d5d"
                                    value={value}
                                    onChangeText={set}
                                    onFocus={() => setCampoFocado(key)}
                                    onBlur={() => setCampoFocado('')}
                                    style={{ borderColor: campoFocado === key ? '#6943FF' : '#27272A' }}
                                    {...rest}
                                />
                            </View>
                        ))}

                        <Text className="px-2 text-colorLight200 text-lg font-semibold mb-1">E-mail:</Text>
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
                                <Input value={email} editable={false} placeholderTextColor="#5d5d5d" />
                            </View>
                        </TouchableWithoutFeedback>

                        <Text className="px-2 text-colorLight200 text-lg font-semibold mb-1">Selecione um gênero:</Text>
                        <View className="bg-colorInputs px-5 py-4 rounded-2xl border-[1.5px] border-colorDark100 gap-y-3 mb-5">
                            {['Masculino', 'Feminino', 'Outro'].map((opcao) => (
                                <TouchableOpacity key={opcao} onPress={() => setSexo(opcao)} className="flex-row items-center">
                                    <View
                                        className={`w-5 h-5 rounded-full border-2 ${sexo === opcao ? 'bg-colorViolet border-colorViolet' : 'border-colorLight200'
                                            }`}
                                    />
                                    <Text className="ml-2 text-colorLight200 text-base">{opcao}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity className="mb-4" onPress={() => navigation.navigate('updatePassword')}>
                            <Text className="text-colorLight200 text-base text-center">
                                Atualizar minha <Text className="text-colorViolet font-semibold">senha</Text>
                            </Text>
                        </TouchableOpacity>

                        <View className='mb-5'>
                            <ButtonViolet onPress={atualizarDadosPersonal}>
                                <ButtonTextViolet>Salvar</ButtonTextViolet>
                            </ButtonViolet>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
