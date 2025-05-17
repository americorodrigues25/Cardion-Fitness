import { createStackNavigator } from '@react-navigation/stack';
import PersonalDrawer from './personalDrawer';
import UserType from '~/screens/auth/userType';
import SignUp from '../screens/auth/signUp';
import ResetPassword from '~/screens/auth/resetPassword';
import LoginPassword from '~/screens/auth/loginPassword';
import UpdatePassword from '~/screens/auth/updatePassword';
import AdicionarAluno from '~/screens/personal/adicionarAlunos';
import DetalhesAlunos from '~/screens/personal/detalhesAlunos';
import CriarTreino from '~/screens/personal/criarTreinos';
import NovoTreino from '~/screens/personal/novoTreino';
import Avaliacoes from '~/screens/personal/avaliacoes';
import CriarAvaliacao from '~/screens/personal/criarAvaliacao';
import DetalhesAvaliacao from '~/screens/personal/detalhesAvaliacao';
import EditarAvaliacao from '~/screens/personal/editarAvaliacao';
import CriarTreinoAluno from '~/screens/personal/criarTreinoAluno';

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
        name='updatePassword'
        options={{ headerShown: false }}
        component={UpdatePassword}
      />
      <Stack.Screen
        name='VincularAluno'
        options={{ headerShown: false }}
        component={AdicionarAluno}
      />
      <Stack.Screen
        name='detalhesAlunos'
        options={{ headerShown: false }}
        component={DetalhesAlunos}
      />
      <Stack.Screen
        name='criarTreinos'
        options={{ headerShown: false }}
        component={CriarTreino}
      />
      <Stack.Screen
        name='novoTreino'
        options={{ headerShown: false }}
        component={NovoTreino}
      />
      <Stack.Screen
        name='Avaliacoes'
        options={{ headerShown: false }}
        component={Avaliacoes}
      />
      <Stack.Screen
        name="CriarAvaliacao"
        options={{ headerShown: false }}
        component={CriarAvaliacao}
      />
      <Stack.Screen
        name="DetalhesAvaliacao"
        options={{ headerShown: false }}
        component={DetalhesAvaliacao}
      />
      <Stack.Screen
        name='EditarAvaliacao'
        options={{ headerShown: false }}
        component={EditarAvaliacao}
      />
      <Stack.Screen
        name='CriarTreinoAluno'
        options={{ headerShown: false }}
        component={CriarTreinoAluno}
      />
    </Stack.Navigator>
  );
};

export default PersonalNavigation;