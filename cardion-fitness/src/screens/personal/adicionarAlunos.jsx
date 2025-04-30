import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from 'react';
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { ButtonTextViolet, ButtonViolet } from "~/components/button";
import { Input } from "~/components/input";

import { useNavigation } from "@react-navigation/native"

export default function AdicionarAlunos() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [campoFocado, setCampoFocado] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(false);
    const [usuario, setUsuario] = useState(null);

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handlePesquisar = async () => {
        setFormError('');
        setModalVisible(false);
        setUsuario(null);
        setEmail('');

        if (!email) {
            setFormError("Por favor, preencha o campo de e-mail.");
            return;
        }

        if (!validarEmail(email)) {
            setFormError("E-mail inválido. Tente novamente.");
            return;
        }


        //aqui pra testar um usuario fake, depois no handlePesquisar tem q colocar a chamada real do banco
        const user = email === "gay@gmail.com"
            ? { nome: "Marquim Dev", email: "gay@gmail.com" }
            : null;

        setUsuarioEncontrado(!!user);
        setUsuario(user);
        setModalVisible(true);
    };

    const handleAdicionarUsuario = () => {

        Toast.show({
            type: 'success',
            text1: 'Parabens ✅',
            text2: 'Você tem um novo aluno vinculado ! 🎉',
        });

        //aqui é pra vincular o usuario

        console.log("Deu certim:", usuario);
        setModalVisible(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView edges={['top', 'bottom']} className='flex-1 bg-colorBackground'>
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="pt-5 px-5 flex-row justify-between">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Adicionar aluno</Text>
                        </TouchableOpacity>
                        <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
                    </View>

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
                                    placeholderTextColor='#5d5d5d'
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setCampoFocado('email')}
                                    onBlur={() => setCampoFocado('')}
                                    style={{
                                        borderColor: campoFocado === 'email' ? '#6943FF' : '#27272A',
                                    }}
                                />
                                {formError ? (
                                    <Text className="text-red-500 text-sm mb-5 text-center">{formError}</Text>
                                ) : null}
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
            </SafeAreaView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/80">
                    <View className="bg-colorDark200 p-6 rounded-lg w-10/12">
                        {usuarioEncontrado ? (
                            <>
                                <MaterialCommunityIcons name="account-check" size={40} color="#10B981" className="self-center mb-3" />
                                <Text className="text-center text-xl text-colorLight200 mb-4">
                                    Usuário encontrado
                                </Text>
                                <Text className="text-center text-colorLight200 mb-1">Nome: {usuario.nome}</Text>
                                <Text className="text-center text-colorLight200 mb-4">E-mail: {usuario.email}</Text>
                                <TouchableOpacity
                                    onPress={handleAdicionarUsuario}
                                    className="bg-colorViolet p-3 rounded-full mb-2 mx-10"
                                >
                                    <Text className="text-colorLight200 text-center">Adicionar usuário</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    className="bg-gray-400 p-3 rounded-full mx-10"
                                >
                                    <Text className="text-colorLight200 text-center">Fechar</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <MaterialCommunityIcons name="account-cancel" size={40} color="#EF4444" className="self-center mb-3" />
                                <Text className="text-center text-xl text-colorLight200 mb-4">
                                    Nenhum usuário encontrado
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    className="bg-colorViolet p-3 rounded-full mx-10"
                                >
                                    <Text className="text-colorLight200 text-center">Fechar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            
        </KeyboardAvoidingView>
    )
}
