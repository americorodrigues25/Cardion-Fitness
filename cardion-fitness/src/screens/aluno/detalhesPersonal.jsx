import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Image, imageUrl, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGet } from '~/hook/crud/useGet';

import { useNavigation } from "@react-navigation/native";

import axios from 'axios';

import { SERVER_URL } from '~/apiConfig/config';

import { Ionicons, FontAwesome, FontAwesome6 } from '@expo/vector-icons';


function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
}

export default function InfosPersonal() {
    const navigation = useNavigation();
    const { getPersonalDoAluno } = useGet();
    const [personal, setPersonal] = useState(null);
    const [imageUrl, setImageUrl] = useState()

    useEffect(() => {
        const fetchPersonal = async () => {
            try {
                const data = await getPersonalDoAluno();
                if (data) setPersonal(data);
            } catch (error) {
                console.log('Erro ao buscar personal do aluno:', error);
            }
        };
        const fetchImage = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            const token = await user.getIdToken();
            const res = await axios.get(`${SERVER_URL}/image/${personal.id}`, { headers: { 'Authorization': `Bearer ${token}` } });

            setImageUrl(`${res.data.url}?${Date.now()}`);
        };

        fetchPersonal();
        fetchImage
    }, []);

    // Função para abrir WhatsApp no telefone
    const openWhatsApp = (telefone) => {
        if (!telefone) return;
        // Limpa números não numéricos (deixar só números)
        const phoneNumber = telefone.replace(/\D/g, '');
        const url = `https://wa.me/${phoneNumber}`;
        Linking.openURL(url).catch(err => console.log('Erro ao abrir WhatsApp:', err));
    };

    // Função para enviar email
    const sendEmail = (email) => {
        if (!email) return;
        const url = `mailto:${email}`;
        Linking.openURL(url).catch(err => console.log('Erro ao abrir email:', err));
    };

    if (!personal) {
        return (
            <View className=" bg-colorBackground flex-1 justify-center items-center p-4 ">
                <ActivityIndicator size="large" color="#6943FF" />
                <Text>Carregando informações...</Text>
            </View>
        );
    }

    return (
        < SafeAreaView edges={['top']} className="flex-1 bg-colorBackground" >
            <ScrollView
                bounces={false}
                overScrollMode='never'
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >

                <View className="pt-5 px-5">
                    <TouchableOpacity onPress={() => navigation.openDrawer()} className="flex-row">
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                        <Text className="ml-2 text-colorLight200">Meu personal</Text>
                    </TouchableOpacity>
                </View>

                <View className="p-5">

                    <View className="flex-row items-center justify-center">
                        <Image
                            key={imageUrl}
                            source={imageUrl ? { uri: imageUrl } : require('~/assets/img/imgProfileDefault.png')}
                            resizeMode="cover"
                            className="w-28 h-28 rounded-full"
                        />
                    </View>

                    <Text className="text-xl font-bold mt-4 text-center text-colorLight200">Informações do Personal</Text>

                    <View className="gap-y-2 my-6">
                        <View className="flex-row items-center gap-x-3">
                            <Ionicons name="person" size={22} color="#6943FF" />
                            <Text className="text-colorLight300">Nome: {personal?.nome || "Não informado"}</Text>
                        </View>

                        <View className="flex-row items-center gap-x-3">
                            <FontAwesome name="envelope" size={22} color="#6943FF" />
                            <Text className="text-colorLight300">Email: {personal?.email || "Não informado"}</Text>
                        </View>

                        <View className="flex-row items-center gap-x-3">
                            <FontAwesome name="phone" size={22} color="#6943FF" />
                            <Text className="text-colorLight300">Telefone: {personal?.telefone || "Não informado"}</Text>
                        </View>

                        <View className="flex-row items-center gap-x-3">
                            <Ionicons name="calendar-number" size={22} color="#6943FF" />
                            <Text className="text-colorLight300">Data de nascimento: {personal.dataNasc || ''}</Text>
                        </View>

                        <View className="flex-row items-center gap-x-3">
                            <FontAwesome name="user-plus" size={22} color="#6943FF" />
                            <Text className="text-colorLight300">Data de vinculação: {formatTimestamp(personal.dataVinculacao)}</Text>
                        </View>
                    </View>

                    {(personal.telefone || personal.email) && (
                        <View className="mt-2 mx-10 gap-y-[10px]">
                            {personal.telefone && (
                                <TouchableOpacity
                                    onPress={() => openWhatsApp(personal.telefone)}
                                    className="border border-green-500 rounded-full py-3 px-4"
                                >
                                    <Text className="text-green-500 font-semibold text-center">Abrir WhatsApp</Text>
                                </TouchableOpacity>
                            )}
                            {personal.email && (
                                <TouchableOpacity
                                    onPress={() => sendEmail(personal.email)}
                                    className="border border-colorViolet rounded-full py-3 px-4"
                                >
                                    <Text className="text-colorViolet font-semibold text-center">Enviar Email</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
