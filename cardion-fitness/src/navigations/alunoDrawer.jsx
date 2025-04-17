import { createDrawerNavigator } from '@react-navigation/drawer';
import AlunoTabs from './alunoTabs';
import Perfil from '~/screens/aluno/perfil';
import CustomDrawerContent from './customDrawerContent';

const Drawer = createDrawerNavigator();

export default function AlunoDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Inicio" component={AlunoTabs} />
      <Drawer.Screen name="Meu Perfil" component={Perfil} />
    </Drawer.Navigator>
  );
}
