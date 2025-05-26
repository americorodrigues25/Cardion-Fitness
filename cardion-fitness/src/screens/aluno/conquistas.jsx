import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useGet } from '~/hook/crud/useGet';

import InfosPersonal from '~/components/modais/infosPersonal';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Conquistas() {
    const { getById } = useGet();

    const [modalVisible, setModalVisible] = useState(false);
    const [personal, setPersonal] = useState(null);
    const { getPersonalDoAluno } = useGet();
    const [loading, setLoading] = useState(false);


    const abrirModalPersonal = async () => {
        setLoading(true);
        try {
            const dados = await getPersonalDoAluno();

            if (dados && dados.nome) {
                setPersonal(dados);
                setModalVisible(true);
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Sem Personal',
                    text2: 'Você ainda não está vinculado a nenhum personal.'
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar os dados do personal.'
            });
        } finally {
            setLoading(false);
        }
    };

    const openWhatsApp = (telefone) => {
        if (!telefone) {
            Toast.show({
                type: 'info',
                text1: 'Telefone não informado.',
            });
            return;
        }

        const phoneNumber = telefone.replace(/\D/g, '');
        const url = `https://wa.me/${phoneNumber}`;
        Linking.openURL(url).catch(() =>
            Toast.show({
                type: 'error',
                text1: 'Erro ao abrir o WhatsApp',
            })
        );
    };

    const sendEmail = (email) => {
        if (!email) {
            Toast.show({
                type: 'info',
                text1: 'Email não informado.',
            });
            return;
        }
        const url = `mailto:${email}`;
        Linking.openURL(url).catch(() =>
            Toast.show({
                type: 'error',
                text1: 'Erro ao abrir o cliente de email',
            })
        );
    };

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className="flex-1 bg-colorBackground px-5 py-2"
        >

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >

                <View className='flex-row items-center justify-between mb-2'>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('~/assets/img/logo/Logo1.png')} className="w-20 h-10" resizeMode="contain" />
                    </View>

                    <View className='flex-row items-center gap-3'>
                        <TouchableOpacity >
                            <FontAwesome name="bell-o" size={20} color="#e4e4e7" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={abrirModalPersonal} disabled={loading} className="p-2">
                            {loading ? (
                                <ActivityIndicator size="small" color="#6943FF" />
                            ) : (
                                <MaterialCommunityIcons name="message-reply-text-outline" size={20} color="#e4e4e7" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <InfosPersonal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        personal={personal}
                        openWhatsApp={openWhatsApp}
                        sendEmail={sendEmail}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}