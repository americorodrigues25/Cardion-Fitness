import { createStackNavigator } from '@react-navigation/stack';

import Splash from '../screens/shared/splash';
import UserType from '../screens/auth/userType';
import Login from '../screens/auth/login';
import SignUp from '../screens/auth/signUp';
import ResetPassword from '~/screens/auth/resetPassword';
import LoginPassword from '~/screens/auth/loginPassword';
import HomeAluno from '~/screens/aluno/home';
import HomePersonal from '~/screens/personal/home';

const Stack = createStackNavigator();

const AuthNavigation = () => {
    return (
        <Stack.Navigator initialRouteName='splash'>
            <Stack.Screen
                name="splash"
                options={{ headerShown: false }}
                component={Splash}
            />
            <Stack.Screen
                name="userType"
                options={{ headerShown: false }}
                component={UserType}
            />
            <Stack.Screen
                name='login'
                options={{ headerShown: false }}
                component={Login}
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
                name='homeAluno'
                options={{ headerShown: false }}
                component={HomeAluno}
            />
            <Stack.Screen
                name='homePersonal'
                options={{ headerShown: false }}
                component={HomePersonal}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigation;