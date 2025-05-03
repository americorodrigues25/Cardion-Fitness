import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native'; //esse é evento do botão voltar em Android
import { useEffect, useState, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useNavigation } from '@react-navigation/native';

import { useGet } from '~/hook/crud/useGet';

export default function Home() {
    const navigation = useNavigation();
    const [nome, setNome] = useState();
    const { getById } = useGet()

    const trazerNome = async () => {
        const user = await getById()
        setNome(user.nome)
    }

    useEffect(() => {
        const fetchNome = async () => {
            await trazerNome();
        };
        fetchNome();
    }, [])

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // aqui é pra bloquear o botão de voltar no android, pro usuario não 
                // conseguir voltar pro login depois de entrar na home
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );


    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className='flex-1 bg-colorBackground pl-5 py-2'
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className='flex-row items-center justify-between pr-5'>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
                        </View>

                        <View className='flex-row items-center gap-5'>
                            <TouchableOpacity >
                                <FontAwesome name="bell-o" size={23} color="#e4e4e7" />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <MaterialCommunityIcons name="message-reply-text-outline" size={23} color="#e4e4e7" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='py-10'>
                        <View className=''>
                            <Text className='text-colorLight200 text-2xl font-semibold'>Bem vindo, {nome}!</Text>
                            <Text className='text-base font-semibold text-colorLight200 px-5 py-5'>Seus alunos</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row gap-5">

                                <TouchableOpacity onPress={() => navigation.navigate('VincularAluno')}
                                    className="min-w-[300px] h-80">
                                    <ImageBackground
                                        source={require('~/assets/img/button-cards/mulherAcademia.png')}
                                        className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                    >
                                        <View className="bg-black/30 p-5">
                                            <Text className="text-white text-3xl font-bold"> Adicionar{"\n"} aluno</Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>

                                <TouchableOpacity className="min-w-[300px] h-80 mr-5">
                                    <ImageBackground
                                        source={require('~/assets/img/button-cards/homemAcademia.jpg')}
                                        className="h-full rounded-2xl overflow-hidden justify-end" resizeMode="cover"
                                    >
                                        <View className="bg-black/30 p-5">
                                            <Text className="text-white text-3xl font-bold">Grupo de{"\n"}alunos</Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}