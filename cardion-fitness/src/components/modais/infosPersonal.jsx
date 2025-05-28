import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function InfosPersonal({ visible, onClose, personal, openWhatsApp, sendEmail }) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/80 px-5">
                <View className="bg-colorDark100 rounded-2xl p-6 w-full max-h-[80%]">
                    <Text className="text-lg font-bold mb-5 text-colorLight200">Informações do Personal</Text>

                    <View className="gap-y-1">
                        <View className="flex-row items-center gap-x-2">
                            <Ionicons name="person" size={20} color="#6943FF" />
                            <Text className="text-colorLight200 font-bold">Nome: {personal?.nome || "Não informado"}</Text>
                        </View>

                        <View className="flex-row items-center gap-x-2">
                            <FontAwesome name="phone" size={20} color="#6943FF" />
                            <Text className="text-colorLight200 font-bold">Telefone: {personal?.telefone || "Não informado"}</Text>
                        </View>

                        <View className="flex-row items-center gap-x-2">
                            <FontAwesome name="envelope" size={20} color="#6943FF" />
                            <Text className="text-colorLight200 font-bold">Email: {personal?.email || "Não informado"}</Text>
                        </View>
                    </View>

                    {(personal?.telefone || personal?.email) && (
                        <View className="mt-6 gap-y-2 mx-10">
                            {personal?.telefone && (
                                <TouchableOpacity
                                    onPress={() => openWhatsApp(personal.telefone)}
                                    className="border border-green-500 rounded-md py-2 px-4"
                                >
                                    <Text className="text-green-500 font-semibold text-center">Falar via WhatsApp</Text>
                                </TouchableOpacity>
                            )}
                            {personal?.email && (
                                <TouchableOpacity
                                    onPress={() => sendEmail(personal.email)}
                                    className="border border-colorViolet rounded-md py-2 px-4"
                                >
                                    <Text className="text-colorViolet font-semibold text-center">Enviar Email</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    <TouchableOpacity onPress={onClose} className="mt-5">
                        <Text className="text-colorViolet text-right font-bold">Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
