// 📦 Imports
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";

// 🔁 Hooks
import { useDelete } from "~/hook/crud/useDelete";
import { useGet } from "~/hook/crud/useGet";
import { useAvaliacao } from "~/hook/crud/avaliacao/useAvaliacao";

// 🎯 Componentes e utilitários
import { ButtonViolet } from "~/components/button";
import AvaliarAppModal from "~/components/modais/avaliarApp";
import PerguntasFrequentesModal from "~/components/modais/perguntasFrequentes";
import ExcluirContaModal from "~/components/modais/excluirConta";

export default function HelSupport() {
    const navigation = useNavigation();
    const { getById } = useGet();
    const { deleteAccount } = useDelete();
    const { avaliar } = useAvaliacao();

    const [showAvaliarModal, setShowAvaliarModal] = useState(false);
    const [showFAQModal, setShowFAQModal] = useState(false);
    const [showExcluirModal, setShowExcluirModal] = useState(false);

    const [rating, setRating] = useState(4);
    const [comentario, setComentario] = useState("");

    async function criarAvaliacao() {
        const user = await getById();
        const nome = user?.nome || "Usuário";

        const data = {
            name: nome,
            avaliacao: rating,
            comentario,
        };

        const resultado = await avaliar(data);
        if (resultado) {
            Toast.show({
                type: "success",
                text1: "Avaliação enviada!",
                position: "top",
            });
            setShowAvaliarModal(false);
        } else {
            Alert.alert("Erro", "Não foi possível enviar a avaliação.");
            setShowAvaliarModal(false);
        }
    }

    async function autenticar() {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            Alert.alert(
                "Biometria não configurada",
                "Seu dispositivo não tem biometria ou ela não está ativada."
            );
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Autentique-se para continuar",
            fallbackLabel: "Usar senha",
        });

        if (result.success) {
            await deleteAccount();
        } else {
            Alert.alert("Falha na autenticação");
        }
    }

    function abrirWhatsapp() {
        const phoneNumber = "5511964166962";
        const message = "Olá, preciso de ajuda com o app.";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        Linking.openURL(url).catch(() => {
            Alert.alert("Erro", "Não foi possível abrir o WhatsApp");
        });
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-colorBackground">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="pt-5 px-5">
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            className="flex-row"
                        >
                            <Image
                                source={require("~/assets/img/btnVoltar.png")}
                                className="w-4 h-5"
                            />
                            <Text className="ml-2 text-colorLight200">Ajuda e Suporte</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 justify-center items-center px-10 py-10">
                        <Text className="text-center text-colorLight200 text-3xl font-semibold mb-5">
                            Como podemos ajudar?
                        </Text>
                        <Text className="text-center text-colorLight200 text-xl">
                            Tire <Text className="font-bold">todas</Text> as suas dúvidas sobre
                            o app e como ele funciona
                        </Text>

                        <View className="w-full gap-y-7 py-10">
                            <TouchableOpacity
                                className="flex-row items-center justify-center rounded-full py-[20px] px-[30px] w-full"
                                onPress={abrirWhatsapp}
                                style={{
                                    backgroundColor: "#0ab248",
                                    shadowColor: "#0ab248",
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12,
                                }}
                            >
                                <Image
                                    source={require("~/assets/img/redeSocial/whatsapp.png")}
                                    className="w-7 h-7"
                                    resizeMode="contain"
                                />
                                <Text className="text-colorLight200 font-bold text-lg ml-2 text-center">
                                    Peça ajuda no WhatsApp!
                                </Text>
                            </TouchableOpacity>

                            <ButtonViolet
                                onPress={() => setShowFAQModal(true)}
                                style={{
                                    shadowColor: "#6943FF",
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12,
                                }}
                            >
                                <Text className="text-colorLight200 font-bold text-lg text-center">
                                    Perguntas frequentes
                                </Text>
                            </ButtonViolet>

                            <ButtonViolet
                                onPress={() => Linking.openURL("https://seudominio.com/sobre")}
                                style={{
                                    shadowColor: "#6943FF",
                                    shadowOffset: 0,
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12,
                                }}
                            >
                                <Text className="text-colorLight200 font-bold text-lg text-center">
                                    Sobre
                                </Text>
                            </ButtonViolet>

                            <ButtonViolet
                                onPress={() => setShowAvaliarModal(true)}
                                style={{
                                    shadowColor: "#6943FF",
                                    shadowOffset: 0,
                                    shadowOpacity: 0.7,
                                    shadowRadius: 7,
                                    elevation: 12,
                                }}
                            >
                                <Text className="text-colorLight200 font-bold text-lg text-center">
                                    Avaliação
                                </Text>
                            </ButtonViolet>
                        </View>

                        <TouchableOpacity onPress={() => setShowExcluirModal(true)}>
                            <Text className="text-red-600 font-bold text-lg">Excluir conta</Text>
                        </TouchableOpacity>
                    </View>

                    {/* MODAIS */}
                    <AvaliarAppModal
                        visible={showAvaliarModal}
                        onClose={() => setShowAvaliarModal(false)}
                        rating={rating}
                        setRating={setRating}
                        comentario={comentario}
                        setComentario={setComentario}
                        onSubmit={criarAvaliacao}
                    />

                    <PerguntasFrequentesModal
                        visible={showFAQModal}
                        onClose={() => setShowFAQModal(false)}
                    />

                    <ExcluirContaModal
                        visible={showExcluirModal}
                        onClose={() => setShowExcluirModal(false)}
                        onConfirm={autenticar}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
