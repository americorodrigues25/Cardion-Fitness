import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as ImagePicker from 'expo-image-picker';
import { Asset } from 'expo-asset';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

import { SERVER_URL } from '~/apiConfig/config';
import { useGet } from '~/hook/crud/useGet';
import { useUpdate } from '~/hook/crud/useUpdate';
import { useConquistas } from '~/hook/crud/conquistas/useConquistas';

import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { Input } from '~/components/input';

export default function Perfil() {
    const navigation = useNavigation();

    // Estados do formulário
    const [imageUrl, setImageUrl] = useState(null);
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNasc, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [campoFocado, setCampoFocado] = useState('');

    const { getById } = useGet();
    const { updateDadosBasicos } = useUpdate();
    const { verificarConquistaPerfil } = useConquistas();

    // Função para carregar dados do usuário
    const trazerDados = async () => {
        const user = await getById();
        if (!user) return;

        setNome(user.nome || '');
        setSobrenome(user.sobrenome || '');
        setEmail(user.email || '');
        setTelefone(user.telefone || '');
        setDataNascimento(user.dataNasc || '');
        setSexo(user.sexo || '');
        setPeso(user.peso || '');
        setAltura(user.altura || '');
        setObjetivo(user.objetivo || '');
    };

    // Função para atualizar dados básicos
    const atualizarDados = async () => {
        const data = {
            dataNasc,
            sexo,
            peso,
            altura,
            objetivo,
            nome,
            sobrenome,
            telefone,
        };

        const result = await updateDadosBasicos(data);

        if (result) {
            Toast.show({
                type: 'success',
                text1: 'Dados atualizados com sucesso ! 🎉',
            });

            const uid = await AsyncStorage.getItem('uid');
            verificarConquistaPerfil(uid);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar dados',
            });
        }
    };

    // Função para carregar imagem do perfil
    const fetchImage = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const userId = await AsyncStorage.getItem('uid');
            if (!userId) return;

            const res = await axios.get(`${SERVER_URL}/image/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setImageUrl(`${res.data.url}?${Date.now()}`);
        } catch {
            setImageUrl(null);
        }
    };

    // Carrega dados e imagem quando o componente monta
    useEffect(() => {
        trazerDados();
        fetchImage();
    }, []);

    // Função genérica para upload de imagem (câmera ou galeria)
    const uploadImage = async (uri) => {
        try {
            const formData = new FormData();
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');

            const token = await user.getIdToken();
            const userId = await AsyncStorage.getItem('uid');
            if (!userId) throw new Error('UID não encontrado');

            formData.append('userId', userId);
            formData.append('image', {
                uri,
                name: 'upload.jpg',
                type: 'image/jpeg',
            });

            const res = await axios.post(`${SERVER_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setImageUrl(`${res.data.url}?${Date.now()}`);
            Asset.fromURI(res.data.url).downloadAsync();
        } catch {
            Toast.show({ type: 'error', text1: 'Erro no upload' });
        }
    };

    // Funções para lidar com foto
    const tirarFoto = () => handleImageUpload(ImagePicker.launchCameraAsync);
    const escolherDaGaleria = () => handleImageUpload(ImagePicker.launchImageLibraryAsync);

    const handleImageUpload = async (launchFunc) => {
        const result = await launchFunc({ allowsEditing: true, quality: 1 });
        if (!result.canceled) {
            await uploadImage(result.assets[0].uri);
        }
    };

    // Função para remover foto
    const removerFoto = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');

            const token = await user.getIdToken();
            const userId = await AsyncStorage.getItem('uid');
            if (!userId) throw new Error('UID não encontrado');

            await axios.delete(`${SERVER_URL}/image/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setImageUrl(null);
            Toast.show({ type: 'success', text1: 'Imagem removida' });
        } catch {
            Toast.show({ type: 'error', text1: 'Erro ao remover imagem!' });
        }
    };

    // Modal para escolher ação da foto
    const handleEditImage = () => {
        Alert.alert(
            'Alterar Foto de Perfil',
            'Escolha uma opção',
            [
                { text: 'Tirar foto', onPress: tirarFoto },
                { text: 'Escolher da galeria', onPress: escolherDaGaleria },
                { text: 'Remover foto', onPress: removerFoto },
                { text: 'Cancelar', style: 'destructive' },
            ],
            { cancelable: true }
        );
    };

    // Componente auxiliar para renderizar inputs
    const renderInput = ({
        label,
        value,
        setValue,
        focusKey,
        keyboardType = 'default',
        mask = false,
        type,
        options,
        editable = true,
        placeholder,
        autoCapitalize = 'none',
        autoCorrect = false,
        maxLength,
        textContentType,
        returnKeyType = 'done',
    }) => (
        <>
            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">{label}</Text>
            <Input
                placeholder={placeholder}
                keyboardType={keyboardType}
                mask={mask}
                type={type}
                options={options}
                placeholderTextColor="#5d5d5d"
                value={value}
                onChangeText={setValue}
                onFocus={() => setCampoFocado(focusKey)}
                onBlur={() => setCampoFocado('')}
                style={{
                    borderColor: campoFocado === focusKey ? '#6943FF' : '#27272A',
                }}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                maxLength={maxLength}
                textContentType={textContentType}
                returnKeyType={returnKeyType}
                editable={editable}
            />
        </>
    );

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
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

                        <View className="mt-5">
                            {renderInput({
                                label: 'Nome:',
                                value: nome,
                                setValue: setNome,
                                focusKey: 'nome',
                                placeholder: 'Digite seu nome',
                                keyboardType: 'default',
                                autoCapitalize: 'words',
                                autoCorrect: true,
                                maxLength: 30,
                            })}

                            {renderInput({
                                label: 'Sobrenome:',
                                value: sobrenome,
                                setValue: setSobrenome,
                                focusKey: 'sobrenome',
                                placeholder: 'Digite seu sobrenome',
                                keyboardType: 'default',
                                autoCapitalize: 'words',
                                autoCorrect: true,
                                maxLength: 30,
                            })}

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
                                        style={{
                                            borderColor: campoFocado === 'email' ? '#6943FF' : '#27272A',
                                        }}
                                        onFocus={() => setCampoFocado('email')}
                                        onBlur={() => setCampoFocado('')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>

                            {renderInput({
                                label: 'Telefone:',
                                value: telefone,
                                setValue: setTelefone,
                                focusKey: 'telefone',
                                placeholder: '(XX) XXXXX-XXXX',
                                keyboardType: 'phone-pad',
                                textContentType: 'telephoneNumber',
                                mask: true,
                                type: 'custom',
                                options: { mask: '(99) 99999-9999' },
                            })}

                            {renderInput({
                                label: 'Data de nascimento:',
                                value: dataNasc,
                                setValue: setDataNascimento,
                                focusKey: 'dataNascimento',
                                placeholder: '(dd/mm/aaaa)',
                                keyboardType: 'number-pad',
                                mask: true,
                                type: 'custom',
                                options: { mask: '99/99/9999' },
                            })}

                            <Text className="px-12 text-colorLight200 text-lg font-semibold mb-1">
                                Selecione um gênero:
                            </Text>
                            <View className="flex justify-between px-12 py-[22px] gap-y-3 bg-colorInputs border-[1.5px] border-colorDark100 rounded-2xl mb-1">
                                {['Masculino', 'Feminino', 'Outro'].map((gen) => (
                                    <TouchableOpacity
                                        key={gen}
                                        onPress={() => setSexo(gen)}
                                        className="flex-row items-center"
                                    >
                                        <View
                                            className={`w-5 h-5 rounded-full border-2 ${sexo === gen
                                                    ? 'bg-colorViolet border-colorViolet'
                                                    : 'border-colorLight200'
                                                }`}
                                        ></View>
                                        <Text className="ml-2 text-colorLight200 text-base">{gen}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                className="mt-5"
                                onPress={() => navigation.navigate('updatePassword')}
                            >
                                <Text className="text-colorLight200 text-base font-normal text-center">
                                    Atualizar minha <Text className="text-colorViolet font-semibold">senha</Text>
                                </Text>
                            </TouchableOpacity>

                            <View className="my-5">
                                <ButtonViolet onPress={atualizarDados}>
                                    <ButtonTextViolet>Salvar</ButtonTextViolet>
                                </ButtonViolet>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
