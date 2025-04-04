import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from '../screens/shared/splash';
import UserType from '../screens/auth/userType';
import Login from '../screens/auth/login';
import SignUp from '../screens/auth/signUp';

const Stack = createStackNavigator();

const AuthNavigation = () => {
    return (
        <NavigationContainer>
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
                    name='signup'
                    options={{ headerShown: false }}
                    component={SignUp}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AuthNavigation;