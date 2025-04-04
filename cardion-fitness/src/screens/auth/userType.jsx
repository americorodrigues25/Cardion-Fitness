import { useNavigation } from '@react-navigation/native';
import { View, Image, SafeAreaView } from 'react-native';
import { ButtonViolet, ButtonTextViolet } from '~/components/button';
import BackgroundWrapper from '~/components/loadingBackgroundImage';

export default function UserType() {
    const navigation = useNavigation();
    return (
        <BackgroundWrapper
            source={require('../../assets/img/imagemFundo2.png')}
            style={{ resizeMode: 'contain' }}
        >

            <SafeAreaView className='w-full items-center'>
                <Image
                    source={require('../../assets/img/Logo1.png')}
                    className='w-6/12' style={{ resizeMode: 'contain' }}
                />

                <View className='w-full items-center mt-12 px-10'>
                    <ButtonViolet
                        onPress={() => navigation.navigate('login')}
                        style={{
                            shadowColor: '#6943FF',
                            shadowOffset: 0,
                            shadowOpacity: 0.7,
                            shadowRadius: 7,
                            elevation: 12,
                        }}>
                        <ButtonTextViolet >SOU ALUNO</ButtonTextViolet>
                    </ButtonViolet>

                    <ButtonViolet
                        onPress={() => navigation.navigate('login')}
                        style={{
                            shadowColor: '#6943FF',
                            shadowOffset: 0,
                            shadowOpacity: 0.7,
                            shadowRadius: 7,
                            elevation: 12,
                        }}>
                        <ButtonTextViolet>SOU PROFESSOR</ButtonTextViolet>
                    </ButtonViolet>
                </View>

            </SafeAreaView>
        </BackgroundWrapper>
    );
}
