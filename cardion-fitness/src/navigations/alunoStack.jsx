import { createStackNavigator } from '@react-navigation/stack';
import AlunoDrawer from './alunoDrawer';

const Stack = createStackNavigator();

const AlunoNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="homeAluno"
                component={AlunoDrawer}
            />
        </Stack.Navigator>
    );
};

export default AlunoNavigation;