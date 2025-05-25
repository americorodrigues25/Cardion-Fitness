import { View, Text, KeyboardAvoidingView, Platform, Image, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import DashboardGraficoAlunos from "~/components/dashboardAlunoPontos";
import { useNavigation } from '@react-navigation/native';

export default function RankingPontosGeral() {
    const navigation = useNavigation();

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
                            <Text className="ml-2 text-colorLight200">Ranking</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-6 px-5">
                        <Text className="text-2xl font-extrabold text-colorLight300 text-center">
                            🥇 Desafie-se e fique no topo!
                        </Text>

                        <Text className="text-base text-center text-gray-400 mt-3">
                            Este ranking mostra sua pontuação nos <Text className=" text-colorViolet">desafios</Text> e <Text className=" text-colorViolet">conquistas</Text> do aplicativo.
                        </Text>

                        <Text className="text-base text-center text-gray-400 mt-2">
                            Participe, suba de nível e concorra a <Text className=" text-colorViolet">vouchers de desconto</Text> com nossos parceiros todo mês.
                        </Text>

                        <Text className="text-base text-center text-gray-400 mt-2">
                            <Text className="font-bold">Mostre do que você é capaz!</Text> 🚀
                        </Text>
                    </View>

                    <View className="py-5">
                        <DashboardGraficoAlunos />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};