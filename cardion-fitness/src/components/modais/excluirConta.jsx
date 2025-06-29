import { Modal, View, Text, TouchableOpacity } from "react-native";

export default function ExcluirContaModal({ visible, onClose, onConfirm }) {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View className="flex-1 justify-center items-center bg-black/80 px-8">
                <View className="bg-white rounded-2xl p-6 w-full">
                    <Text className="text-xl font-bold text-center mb-4 text-red-600">
                        Tem certeza que deseja excluir sua conta?
                    </Text>
                    <Text className="text-center text-colorDark100 mb-6">
                        Sua conta será excluída permanentemente. Você pode se arrepender depois. Deseja mesmo continuar?
                    </Text>
                    <View className="flex-row justify-between gap-x-4">
                        <TouchableOpacity
                            className="flex-1 bg-red-600 py-3 rounded-full items-center"
                            onPress={() => {
                                onClose();
                                onConfirm();
                            }}
                        >
                            <Text className="text-white font-bold">Sim, Excluir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 bg-gray-300 py-3 rounded-full items-center"
                            onPress={onClose}
                        >
                            <Text className="text-gray-800 font-bold">Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
