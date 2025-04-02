import { View, Text, Image } from 'react-native';
import { ButtonGreen, ButtonTextGreen, ButtonViolet, ButtonTextViolet } from '~/components/button';

export default function UserType() {
    return (
        <View className='flex-1 justify-center items-center bg-colorDark400'>
            <View className='w-full items-center'>

                <Image
                    source={require('../../assets/img/Logo1.png')}
                    className='w-10/12 h-2/5'
                />

                <Text className='text-lg font-semibold text-colorLight300 mt-2'>O seu app</Text>

                <View className='w-full items-center mt-2'>
                    <ButtonGreen className='w-10/12'>
                        <ButtonTextGreen>Sou aluno</ButtonTextGreen>
                    </ButtonGreen>
                    <ButtonViolet className='w-10/12'>
                        <ButtonTextViolet>Sou personal trainer</ButtonTextViolet>
                    </ButtonViolet>
                </View>
            </View>
        </View>
    );
}
