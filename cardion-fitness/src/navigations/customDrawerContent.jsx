import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGet } from '~/hook/crud/useGet';

export default function CustomDrawerContent(props) {

    const [nome, setNome] = useState();
    const { getById } = useGet()

        const trazerNome = async () => {
            const user = await getById()
            setNome(user.nome)
            Alert.alert(user.nome)
        }
    
        useEffect(() => {
            const fetchNome = async () => {
                await trazerNome();
            };
            fetchNome();
        }, [])

    const handleEditImage = () => {
        Alert.alert(
            'Alterar Foto de Perfil',
            'Escolha uma opção',
            [
                { text: 'Tirar foto' },
                { text: 'Escolher da galeria' },
                { text: 'Remover foto' },
                { text: 'Cancelar', style: 'destructive' },
            ],
            { cancelable: true }
        );
    };
    return (
        <DrawerContentScrollView {...props}>
            <View className='py-5 items-center'>
                <View className='relative'>
                    <Image
                        source={require('~/assets/img/imgProfileDefault.png')}
                        className='w-48 h-48 rounded-full'
                    />
                    <TouchableOpacity
                        onPress={handleEditImage}
                        className='absolute bottom-8 right-7 bg-colorLight200 rounded-full p-2'
                    >
                        <Ionicons name="camera" size={25} color="#000" />
                    </TouchableOpacity>
                </View>

                <Text className='text-xl font-bold'>{nome}</Text>
            </View>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}
