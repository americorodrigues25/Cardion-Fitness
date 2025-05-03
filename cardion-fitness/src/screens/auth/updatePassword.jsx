import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '~/hook/useAuthentication';
import Toast from 'react-native-toast-message';

import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import { InputPassword } from '~/components/inputPassword';

import { useNavigation } from '@react-navigation/native';

export default function AtualizarSenha() {
    const navigation = useNavigation();

    const { updatePasswordInterno, loading } = useAuth();

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [campoFocado, setCampoFocado] = useState('');
    const [formError, setFormError] = useState('');

    const handleAtualizarSenha = async () => {
        setFormError('');

        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            setFormError('Preencha todos os campos.');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setFormError('As novas senhas não coincidem.');
            return;
        }

        if (novaSenha.length < 6) {
            setFormError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            await updatePasswordInterno(senhaAtual, novaSenha);
            Toast.show({
                type: 'success',
                text1: 'Senha atualizada com sucesso !',
                position: 'top',
            });
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            navigation.goBack();
        } catch (err) {
            setFormError('Erro ao atualizar');
        }
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className="pt-5 px-5">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Atualizar senha</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 justify-center items-center px-10">
                        <Text className="text-colorLight200 text-3xl font-semibold text-center">Atualizar Senha</Text>

                        <View className='w-full py-10'>
                            <InputPassword
                                placeholder="Senha atual"
                                secureTextEntry
                                keyboardType="default"
                                returnKeyType="done"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                accessibilityLabel="Campo de senha atual"
                                value={senhaAtual}
                                onChangeText={setSenhaAtual}
                                onFocus={() => setCampoFocado('senhaAtual')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'senhaAtual' ? '#6943FF' : '#27272A',
                                }}
                            />

                            <InputPassword
                                placeholder="Nova senha"
                                secureTextEntry
                                keyboardType="default"
                                returnKeyType="done"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                accessibilityLabel="Campo para digitar nova senha"
                                value={novaSenha}
                                onChangeText={setNovaSenha}
                                onFocus={() => setCampoFocado('novaSenha')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'novaSenha' ? '#6943FF' : '#27272A',
                                }}
                            />

                            <InputPassword
                                placeholder="Confirmar nova senha"
                                secureTextEntry
                                keyboardType="default"
                                returnKeyType="done"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                accessibilityLabel="Campo para digitar nova senha "
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                                onFocus={() => setCampoFocado('novaSenha2')}
                                onBlur={() => setCampoFocado('')}
                                style={{
                                    borderColor: campoFocado === 'novaSenha2' ? '#6943FF' : '#27272A',
                                }}
                            />

                            {formError ? (
                                <Text className="text-red-500 text-sm mb-5 text-center">{formError}</Text>
                            ) : null}

                        </View>

                        <ButtonViolet
                            onPress={handleAtualizarSenha}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#E4E4E7" /> : (
                                <ButtonTextViolet>Atualizar Senha</ButtonTextViolet>
                            )}
                        </ButtonViolet>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
};
