import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useState } from "react";

export default function PerguntasFrequentesModal({ visible, onClose }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "Como entro em contato com o meu personal?",
            answer: "Nós disponibilizamos o contato dos personais na área do perfil.",
        },
        {
            question: "Como me vinculo a um personal trainer no app?",
            answer:
                "O personal se vinculará ao aluno, buscando-o pelo e-mail cadastrado no aplicativo.",
        },
        {
            question: "O que é um treino no aplicativo?",
            answer:
                "É um conjunto de exercícios criado pelo seu personal trainer, personalizado para seus objetivos.",
        },
        {
            question: "Como vejo os treinos que o personal criou para mim??",
            answer:
                'Acesse a aba "Meus Treinos" no menu principal. Lá você verá todos os treinos ativos.',
        },
        {
            question: "Posso marcar quais treinos já fiz?",
            answer:
                "Sim! Basta abrir o treino e registrar a sessão como concluída.",
        },
        {
            question: "É possível adicionar quantos alunos?",
            answer: "Não há limite de alunos cadastrados.",
        },
        {
            question: "O que é a avaliação física no app?",
            answer:
                "É uma análise feita pelo seu personal com base em dados como peso, medidas corporais e percentual de gordura.",
        },
        {
            question: "Como acesso minha avaliação física?",
            answer:
                'Na aba "Minha Avaliação", você pode visualizar todas as avaliações feitas pelo seu personal.',
        },
        {
            question: "Posso ter mais de um personal vinculado?",
            answer:
                "Atualmente, só é possível ter um personal ativo por vez.",
        },
        {
            question: "O que são os desafios do aplicativo?",
            answer:
                "São atividades que você pode realizar para acumular pontos e desbloquear conquistas.",
        },
        {
            question: "Como participo de um desafio?",
            answer:
                'Acesse a aba "Desafios", escolha o desafio desejado e clique em "Participar".',
        },
        {
            question: "O que ganho ao completar desafios?",
            answer: "Você acumula pontos e sobe no ranking geral do app.",
        },
        {
            question: "O que são as conquistas?",
            answer:
                'Metas atingidas como "10 treinos concluídos", salvas no seu perfil.',
        },
        {
            question: "Onde vejo meu ranking?",
            answer:
                "Na aba 'Ranking', com base nos pontos conquistados com desafios e conquistas.",
        },
        {
            question: "Meus dados estão seguros no aplicativo?",
            answer:
                "Sim, todos os dados são armazenados com segurança e usados para melhorar sua experiência.",
        },
        {
            question: "Consigo usar o app sem estar vinculado a um personal?",
            answer:
                "Sim, mas para treinos e avaliações personalizadas é necessário ter um personal vinculado.",
        },
    ];

    return (
        <Modal transparent visible={visible} animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/80 justify-center items-center">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full items-center flex-1 justify-center"
                    >
                        <TouchableWithoutFeedback>
                            <View className="bg-colorDark200 w-[85%] max-h-[80%] rounded-2xl p-5">
                                <Text className="text-colorLight200 text-xl font-bold text-center mb-5">
                                    PRECISA DE AJUDA?
                                </Text>

                                <ScrollView showsVerticalScrollIndicator={false} className="mb-2">
                                    {faqData.map((item, index) => (
                                        <View key={index} className="border-b border-[#333] py-2.5">
                                            <TouchableOpacity
                                                onPress={() => toggleQuestion(index)}
                                                className="flex-row justify-between items-center"
                                            >
                                                <Text className="text-colorLight200 text-base flex-1 pr-2.5">
                                                    {item.question}
                                                </Text>
                                                <AntDesign
                                                    name={
                                                        openIndex === index ? "minuscircleo" : "pluscircleo"
                                                    }
                                                    size={16}
                                                    color="#6943FF"
                                                />
                                            </TouchableOpacity>
                                            {openIndex === index && (
                                                <Text className="text-gray-400 text-sm mt-2">
                                                    {item.answer}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
