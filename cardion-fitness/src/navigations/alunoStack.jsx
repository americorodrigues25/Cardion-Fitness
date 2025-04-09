import { createStackNavigator } from '@react-navigation/stack';
import HomeAluno from '~/screens/aluno/home';

const Stack = createStackNavigator();

const AlunoNavigation = () => {
    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="homeAluno"
                component={HomeAluno}
            />
        </Stack.Navigator>



    );
};

export default AlunoNavigation;