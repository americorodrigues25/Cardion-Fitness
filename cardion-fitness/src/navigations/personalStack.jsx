import { createStackNavigator } from '@react-navigation/stack';
import PersonalDrawer from './personalDrawer';
import UserType from '~/screens/auth/userType';
import SignUp from '../screens/auth/signUp';
import ResetPassword from '~/screens/auth/resetPassword';
import LoginPassword from '~/screens/auth/loginPassword';
import AdicionarAluno from '~/screens/personal/adicionarAlunos';

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
      name='VincularAluno'
      options={{headerShown: false}}
      component={AdicionarAluno}
      />
    </Stack.Navigator>
  );
};

export default PersonalNavigation;