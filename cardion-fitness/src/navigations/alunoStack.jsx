import { createStackNavigator } from '@react-navigation/stack';
import AlunoDrawer from './alunoDrawer';

const Stack = createStackNavigator();

const AlunoNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="homeAluno"
                component={AlunoDrawer}
                options={{
                    gestureEnabled: false, // esse aqui bloqueia o deslize para voltar no iOS, ver onde aplicar
                }}
            />
        </Stack.Navigator>
    );
};

export default AlunoNavigation;