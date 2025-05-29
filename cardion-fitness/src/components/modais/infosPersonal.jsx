import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function InfosPersonal({ visible, onClose, personal, anotacao }) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/80 px-5">
                <View className="bg-colorDark100 rounded-2xl p-6 w-full max-h-[80%]">

                    <View className="mt-4">
                        <View className='flex-row items-center gap-x-2 mb-2'>
                            <Entypo name='message' size={25} color='#6943FF' />
                            <Text className="text-lg font-bold text-colorLight200">Feedback do seu personal:</Text>
                        </View>
                        <Text className="text-colorLight300">{anotacao || 'Nenhum feedback no momento'}</Text>
                    </View>

                    <TouchableOpacity onPress={onClose} className="mt-5 bg-colorViolet px-10 py-2 rounded-full mx-14">
                        <Text className="text-colorLight200 font-bold text-center">Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
