import { createStackNavigator } from '@react-navigation/stack';
import PersonalDrawer from './personalDrawer';
import UserType from '~/screens/auth/userType';
import Login from '../screens/auth/login';
import SignUp from '../screens/auth/signUp';
import ResetPassword from '~/screens/auth/resetPassword';
import LoginPassword from '~/screens/auth/loginPassword';

const Stack = createStackNavigator();

const PersonalNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="homePersonal"
        component={PersonalDrawer}
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
    </Stack.Navigator>
  );
};

export default PersonalNavigation;