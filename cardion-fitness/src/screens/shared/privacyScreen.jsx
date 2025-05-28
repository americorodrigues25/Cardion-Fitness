import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";

export default function Privacy() {

    const navigation = useNavigation();

    return (
        < SafeAreaView edges={['top']} className="flex-1 bg-colorBackground" >
            <ScrollView
                bounces={false}
                overScrollMode='never'
                contentContainerStyle={{ flexGrow: 1 }}
            >

                <View className="pt-5 px-5">
                    <TouchableOpacity onPress={() => navigation.openDrawer()} className="flex-row">
                        <Image source={require('~/assets/img/btnVoltar.png')} className='w-4 h-5' />
                        <Text className="ml-2 text-colorLight200">Política de privacidade</Text>
                    </TouchableOpacity>
                </View>

                <View className="px-5 py-10">
                    <Text className="text-base text-justify">
                        <Text className="text-colorViolet text-lg font-semibold">Política de privacidade</Text>
                        <Text className="text-colorLight200 text-lg font-semibold"> - Cardio Fitness</Text>
                    </Text>
                    <Text className="text-colorLight200 text-lg font-semibold text-justify">Data da última atualização: 18/04/2025</Text>
                    <Text className="text-base text-colorLight200 text-justify">Esta Política de Privacidade descreve como o aplicativo Cardion Fitness coleta, utiliza, armazena, compartilha e protege os dados dos usuários. Nosso compromisso é com a transparência, segurança e privacidade das informações, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).</Text>
                    <Text className="text-colorViolet text-lg font-semibold mt-3 text-justify">1. Coleta de dados</Text>
                    <Text className="text-base text-colorLight200 text-justify">Ao utilizar o Cardion Fitness, podemos coletar os seguintes dados:</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Dados Pessoais: Nome, e-mail, idade, sexo, peso, altura, cidade e senha de acesso. </Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Dados de Saúde e Treino: Informações sobre treinos realizados, metas, avaliações físicas, frequência e preferências.</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Dados de Uso: Informações sobre como o app é utilizado, como tempo de uso, interações e sessões ativas.</Text>

                    <Text className="text-colorViolet text-lg font-semibold mt-3 text-justify">2. Uso das Informações</Text>
                    <Text className="text-base text-colorLight200 text-justify">As informações coletadas serão utilizadas para:</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Personalizar planos de treino e recomendações com base no perfil individual;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Monitorar a evolução do usuário e gerar relatórios de desempenho;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Enviar notificações motivacionais, lembretes de treino e atualizações importantes;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Melhorar a experiência de uso e funcionalidades do app;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Apoiar análises acadêmicas e estatísticas do projeto, sem identificar o usuário.</Text>
                    <Text className="text-colorViolet text-lg font-semibold mt-3 text-justify">3. Compartilhamento de Dados</Text>
                    <Text className="text-base text-colorLight200 text-justify">Não compartilhamos os dados dos usuários com terceiros, exceto:</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Quando exigido por obrigações legais ou judiciais;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Com serviços técnicos de suporte ao funcionamento do app (ex: servidores), sob cláusulas de sigilo;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Para fins acadêmicos no contexto do TCC, de forma anonimizada.</Text>
                    <Text className="text-colorViolet text-lg font-semibold mt-3 text-justify">4. Segurança e Armazenamento</Text>
                    <Text className="text-base text-colorLight200 text-justify">Todos os dados são armazenados em ambiente seguro, com uso de criptografia e boas práticas de proteção digital. Trabalhamos para garantir que seus dados estejam sempre protegidos contra acessos indevidos ou vazamentos.</Text>
                    <Text className="text-colorViolet text-lg font-semibold mt-3 text-justify">5. Seus Direitos</Text>
                    <Text className="text-base text-colorLight200 text-justify">Você pode, a qualquer momento:</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Consultar quais dados armazenamos sobre você;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Corrigir ou atualizar informações incorretas;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Solicitar a exclusão dos seus dados;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Revogar o consentimento para uso dos dados;</Text>
                    <Text className="text-base text-colorLight200 text-justify"><Text className="text-colorViolet text-base font-bold ">-</Text> Para isso, envie um e-mail para: [seu e-mail acadêmico ou de contato do app].</Text>
                    <Text className="text-colorViolet text-lg font-semibold mt-3 text-justify">6. Consentimento</Text>
                    <Text className="text-base text-colorLight200 text-justify">Ao utilizar o Cardion Fitness, você concorda com esta Política de Privacidade e com o tratamento dos seus dados conforme aqui descrito.</Text>
                    <Text className="text-colorViolet text-lg font-semibold mt-3 text-justify">7. Atualizações</Text>
                    <Text className="text-base text-colorLight200 text-justify">Esta política poderá ser modificada a qualquer momento, sempre com aviso prévio no app. Recomendamos a leitura periódica para se manter atualizado.</Text>
                </View>

            </ScrollView>
        </SafeAreaView >
    )
}
