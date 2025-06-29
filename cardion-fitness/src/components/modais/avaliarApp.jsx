import {
    Modal, View, Text, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function AvaliarAppModal({
    visible, onClose, rating, setRating, comentario, setComentario, onSubmit
}) {
    return (
        <Modal transparent visible={visible} animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/80 justify-center items-center">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full items-center flex-1 justify-center"
                    >
                        <TouchableWithoutFeedback>
                            <View className="bg-colorDark200 w-[85%] p-5 rounded-2xl">
                                <Text className="text-colorLight200 font-bold text-xl text-center mb-5">DEIXE SUA AVALIAÇÃO</Text>
                                <Text className="text-colorLight200 text-center mb-4">Como estamos nos saindo?</Text>

                                <View className="flex-row justify-center mb-5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <TouchableOpacity key={i} onPress={() => setRating(i)}>
                                            <FontAwesome
                                                name={i <= rating ? "star" : "star-o"}
                                                size={32}
                                                color="#e6a800"
                                                style={{ marginHorizontal: 8 }}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TextInput
                                    placeholder="Comentar..."
                                    placeholderTextColor="#525252"
                                    className="bg-colorInputs text-colorLight200 p-3 rounded-xl mb-5 h-24"
                                    multiline
                                    value={comentario}
                                    onChangeText={setComentario}
                                />

                                <TouchableOpacity onPress={onSubmit} className="bg-colorViolet p-4 rounded-full mx-10">
                                    <Text className="text-white font-bold text-center">ENVIAR</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
