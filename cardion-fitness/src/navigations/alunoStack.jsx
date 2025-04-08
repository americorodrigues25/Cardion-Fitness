import { createStackNavigator } from '@react-navigation/stack';
import HomeAluno from '~/screens/aluno/home';

const Stack = createStackNavigator();

const AlunoNavigation = () => {
    return (


            <Stack.Screen
                name="homeAluno"
                component={HomeAluno}
            />
   


    );
};

export default AlunoNavigation;