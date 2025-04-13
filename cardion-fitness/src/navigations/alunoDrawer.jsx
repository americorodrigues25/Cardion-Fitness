import { createDrawerNavigator } from '@react-navigation/drawer';
import AlunoTabs from './alunoTabs';
import Perfil from '~/screens/aluno/perfil';

const Drawer = createDrawerNavigator();

export default function AlunoDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="Inicio" component={AlunoTabs} />
      <Drawer.Screen name="Meu Perfil" component={Perfil} />
    </Drawer.Navigator>
  );
}
