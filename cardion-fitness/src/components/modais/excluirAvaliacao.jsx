import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

export default function ExcluirAvaliacao({ visible, onCancel, onConfirm }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/80 px-6">
        <View className="bg-colorDark100 rounded-2xl w-full p-6">
          <Text className="text-colorLight200 text-lg font-bold mb-3">
            Tem certeza que deseja apagar esta avaliação?
          </Text>
          <Text className="text-gray-400 mb-8">
            Isso não poderá ser revertido.
          </Text>
          <View className="flex-row justify-end gap-x-10">
            <TouchableOpacity onPress={onCancel}>
              <Text className="text-colorViolet text-lg font-semibold">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text className="text-red-600 font-semibold text-lg">Apagar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
