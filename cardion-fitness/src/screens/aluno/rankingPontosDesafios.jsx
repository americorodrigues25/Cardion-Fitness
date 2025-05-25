import { View, Text, KeyboardAvoidingView, Platform, Image, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import GraficoPontosAlunos from "~/components/dashboardPontosDesafios"
import { useNavigation } from '@react-navigation/native';

export default function DashboardPontosDesafios() {
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

                    <View className="pt-5 px-5">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row">
                            <Image source={require('~/assets/img/btnVoltar.png')} className="w-4 h-5" />
                            <Text className="ml-2 text-colorLight200">Ranking Desafios</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-6 px-5">
                        <Text className="text-2xl font-extrabold text-colorLight300 text-center">
                            🥇 Top 3 ou nada!
                        </Text>
                        <Text className="text-base text-center text-gray-400 mt-3">
                            Suba no ranking, conquiste seu lugar e ganhe prêmios incríveis todo mês dos nossos parceiros. Bora vencer? 🔥
                        </Text>
                    </View>

                    <View className="py-5">
                        <GraficoPontosAlunos />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};