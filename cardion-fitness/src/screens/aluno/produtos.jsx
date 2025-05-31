import { View, Text, ScrollView, TouchableOpacity, Linking, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const ebooks = [
    {
        id: 1,
        titulo: 'Guia de Alimentação Saudável',
        preco: 'R$ 49,90',
        descricao: 'Dicas práticas para melhorar sua alimentação e ter mais energia no dia a dia.',
    },
    {
        id: 2,
        titulo: 'Treino em Casa: 30 Dias',
        preco: 'R$ 39,90',
        descricao: 'Programa de treino funcional para fazer em casa sem equipamentos.',
    },
    {
        id: 3,
        titulo: 'Mindset de Sucesso',
        preco: 'R$ 54,90',
        descricao: 'Aprenda como manter o foco e atingir metas com estratégias mentais.',
    },
    {
        id: 4,
        titulo: 'Receitas Fitness Rápidas',
        preco: 'R$ 29,90',
        descricao: 'Receitas saudáveis e fáceis para o dia a dia.',
    },
    {
        id: 5,
        titulo: 'Yoga para Iniciantes',
        preco: 'R$ 44,90',
        descricao: 'Aprenda posturas básicas e técnicas de respiração para reduzir o estresse.',
    },
    {
        id: 6,
        titulo: 'Planejamento e Produtividade',
        preco: 'R$ 59,90',
        descricao: 'Métodos para organizar sua rotina e alcançar mais em menos tempo.',
    },
];

const produtosFitness = [
    {
        id: 1,
        titulo: 'Conjunto Fitness Feminino',
        preco: 'R$ 129,90',
        descricao: 'Top e legging com tecido compressivo e confortável para treinos de alta performance.',
    },
    {
        id: 2,
        titulo: 'Camisa Dry Fit Masculina',
        preco: 'R$ 79,90',
        descricao: 'Camiseta leve e respirável para treinos intensos com proteção UV.',
    },
    {
        id: 3,
        titulo: 'Corda de Pular Profissional',
        preco: 'R$ 59,90',
        descricao: 'Ideal para treino cardiovascular, com regulagem de tamanho e rolamentos de alta rotação.',
    },
    {
        id: 4,
        titulo: 'Mini Band (Kit com 5)',
        preco: 'R$ 39,90',
        descricao: 'Elásticos de resistência para fortalecimento muscular e reabilitação.',
    },
    {
        id: 5,
        titulo: 'Halter Emborrachado 5kg (Par)',
        preco: 'R$ 99,90',
        descricao: 'Par de halteres ideal para treinos de força em casa.',
    },
    {
        id: 6,
        titulo: 'Tapete de Yoga Antiderrapante',
        preco: 'R$ 89,90',
        descricao: 'Superfície aderente e espessura confortável para exercícios de solo e alongamentos.',
    },
];

const ProdutoCard = ({ produto }) => (
    <View className="bg-colorInputs rounded-xl mb-5 p-4 border border-colorDark100">
        <Text className="text-lg font-bold text-colorLight200">{produto.titulo}</Text>
        <Text className="text-gray-300 text-sm mt-1">{produto.descricao}</Text>
        <Text className="text-colorViolet font-bold mt-4">{produto.preco}</Text>
    </View>
);

export default function Produtos() {
    const navigation = useNavigation();

    const handleAbrirLink = () => {
        Linking.openURL('https://google.com');
    };

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            className="flex-1 bg-colorBackground px-5 py-2"
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
                    showsVerticalScrollIndicator={false}
                >
                    <View className="pt-5">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Produtos</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-2xl font-bold text-colorLight200 mt-5 mb-4">Principais E-books</Text>
                    {ebooks.map((ebook) => (
                        <ProdutoCard key={ebook.id} produto={ebook} />
                    ))}

                    <Text className="text-2xl font-bold text-colorLight200 mt-5 mb-4">Principais Produtos Fitness</Text>
                    {produtosFitness.map((produto) => (
                        <ProdutoCard key={produto.id} produto={produto} />
                    ))}

                    {/* Botão para ver mais */}
                    <TouchableOpacity
                        onPress={handleAbrirLink}
                        className="bg-indigo-600 mt-6 mb-10 mx-auto px-6 py-3 rounded-xl"
                    >
                        <Text className="text-white font-semibold text-base text-center">Ver todos os produtos</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
