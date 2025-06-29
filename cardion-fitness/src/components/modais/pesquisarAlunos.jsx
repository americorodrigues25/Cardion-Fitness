import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PesquisarAlunos({
    visible,
    usuario,
    encontrado,
    isLoading,
    onAdicionar,
    onFechar,
}) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onFechar}
        >
            <View className="flex-1 justify-center items-center bg-black/80">
                <View className="bg-colorDark200 p-6 rounded-lg w-10/12">
                    {encontrado && usuario ? (
                        <>
                            <MaterialCommunityIcons
                                name="account-check"
                                size={40}
                                color="#10B981"
                                className="self-center mb-3"
                            />
                            <Text className="text-center text-xl text-colorLight200 mb-4">
                                Usuário encontrado
                            </Text>
                            <Text className="text-center text-colorLight200 mb-1">Nome: {usuario.nome}</Text>
                            <Text className="text-center text-colorLight200 mb-4">E-mail: {usuario.email}</Text>

                            <TouchableOpacity
                                onPress={onAdicionar}
                                className="bg-colorViolet p-3 rounded-full mb-2 mx-10"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#E4E4E7" />
                                ) : (
                                    <Text className="text-colorLight200 text-center">Adicionar usuário</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={onFechar} className="bg-gray-400 p-3 rounded-full mx-10">
                                <Text className="text-colorLight200 text-center">Fechar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <MaterialCommunityIcons
                                name="account-cancel"
                                size={40}
                                color="#EF4444"
                                className="self-center mb-3"
                            />
                            <Text className="text-center text-xl text-colorLight200 mb-4">
                                Nenhum usuário encontrado
                            </Text>
                            <TouchableOpacity onPress={onFechar} className="bg-colorViolet p-3 rounded-full mx-10">
                                <Text className="text-colorLight200 text-center">Fechar</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}
