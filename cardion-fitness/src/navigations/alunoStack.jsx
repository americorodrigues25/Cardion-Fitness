import { createStackNavigator } from '@react-navigation/stack';
import AlunoDrawer from './alunoDrawer';
import UserType from '~/screens/auth/userType';
import SignUp from '../screens/auth/signUp';
import ResetPassword from '~/screens/auth/resetPassword';
import LoginPassword from '~/screens/auth/loginPassword';
import UpdatePassword from '~/screens/auth/updatePassword';

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
            <Stack.Screen
                name="userType"
                options={{ headerShown: false }}
                component={UserType}
            />
            <Stack.Screen
                name='signUp'
                options={{ headerShown: false }}
                component={SignUp}
            />
            <Stack.Screen
                name='loginPassword'
                options={{ headerShown: false }}
                component={LoginPassword}
            />
            <Stack.Screen
                name='resetPassword'
                options={{ headerShown: false }}
                component={ResetPassword}
            />
            <Stack.Screen
                name='updatePassword'
                options={{ headerShown: false }}
                component={UpdatePassword}
            />
        </Stack.Navigator>
    );
};

export default AlunoNavigation;