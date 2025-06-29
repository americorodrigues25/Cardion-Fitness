import { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HeaderAppBack from '~/components/header/headerAppBack';
import { ButtonTextViolet, ButtonViolet } from '~/components/button';
import { Input } from '~/components/input';
import PesquisarAlunos from '~/components/modais/pesquisarAlunos';

import { useGet } from '~/hook/crud/useGet';
import { useVinculo } from '~/hook/crud/vincularAlunos/vincularAluno';

export default function AdicionarAlunos() {
    const navigation = useNavigation();
    const { getAlunoByEmail } = useGet();
    const { vincularAluno } = useVinculo();

    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [campoFocado, setCampoFocado] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const validarEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handlePesquisar = async () => {
        setFormError('');
        setModalVisible(false);
        setUsuario(null);
        setUsuarioEncontrado(false);

        if (!email) return setFormError("Por favor, preencha o campo de e-mail.");
        if (!validarEmail(email)) return setFormError("E-mail inválido. Tente novamente.");

        const users = await getAlunoByEmail(email);
        const user = users[0];

        setUsuarioEncontrado(!!user);
        setUsuario(user);
        setModalVisible(true);
    };

    const handleAdicionarUsuario = async () => {
        setIsLoading(true);
        try {
            const success = await vincularAluno(usuario.uid);
            setEmail('');
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Erro ao tentar vincular',
                text2: 'Tente novamente mais tarde.',
            });
        } finally {
            setIsLoading(false);
            setModalVisible(false);
        }
    };

    const limparModal = () => {
        setUsuario(null);
        setUsuarioEncontrado(false);
        setModalVisible(false);
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                >
                    <HeaderAppBack title="Adicionar aluno" />

                    <View className="flex-1 justify-center items-center">
                        <View className="w-full px-10">
                            <Text className="text-colorLight200 text-3xl font-semibold text-center">
                                Pesquisar alunos
                            </Text>

                            <View className="py-10">
                                <Input
                                    placeholder="Digite o e-mail"
                                    keyboardType="email-address"
                                    returnKeyType="done"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="emailAddress"
                                    placeholderTextColor="#5d5d5d"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setCampoFocado('email')}
                                    onBlur={() => setCampoFocado('')}
                                    style={{ borderColor: campoFocado === 'email' ? '#6943FF' : '#27272A' }}
                                />
                                {formError && (
                                    <Text className="text-red-500 text-sm mb-5 text-center">{formError}</Text>
                                )}
                            </View>

                            <ButtonViolet onPress={handlePesquisar}>
                                <View className="mr-2">
                                    <ButtonTextViolet>Pesquisar</ButtonTextViolet>
                                </View>
                                <MaterialCommunityIcons name="account-search" size={25} color="#E4E4E7" />
                            </ButtonViolet>
                        </View>
                    </View>
                </ScrollView>

                <PesquisarAlunos
                    visible={modalVisible}
                    usuario={usuario}
                    encontrado={usuarioEncontrado}
                    isLoading={isLoading}
                    onAdicionar={handleAdicionarUsuario}
                    onFechar={limparModal}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}