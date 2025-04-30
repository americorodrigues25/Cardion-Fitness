import { View, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function Alunos() {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView
                edges={['top', 'bottom']}
                className='flex-1 bg-colorBackground pl-5 py-2'
            >

                <ScrollView
                    bounces={false}
                    overScrollMode="never"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className='flex-row items-center justify-between pr-5'>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('~/assets/img/logo/Logo1.png')} className="w-24 h-12" resizeMode="contain" />
                        </View>

                        <View className='flex-row items-center gap-5'>
                            <TouchableOpacity >
                                <FontAwesome name="bell-o" size={23} color="#e4e4e7" />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <MaterialCommunityIcons name="message-reply-text-outline" size={23} color="#e4e4e7" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='py-20 px-10'>

                        <View className="flex-row justify-between items-center border-b border-colorDark100 px-4 pb-1">
                            <TextInput
                                placeholder="pesquisar"
                                placeholderTextColor="#5d5d5d"
                                returnKeyType="search"
                                autoCapitalize="words"
                                className="flex-1 text-colorLight200 text-lg h-10"
                            />
                            <TouchableOpacity>
                                <Ionicons name="search" size={25} color="#E4E4E7" />
                            </TouchableOpacity>
                        </View>

                        <View className="pt-20">
                            {/*aqui para os nomes vinculados aparecer*/}
                            <TouchableOpacity>
                                <Text className="text-colorLight200 text-base bg-colorInputs px-10 py-5 mb-2 rounded-xl border-colorDark100 border">
                                    Américo Rodrigues
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}