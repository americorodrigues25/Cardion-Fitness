import { createDrawerNavigator } from '@react-navigation/drawer';
import AlunoTabs from './alunoTabs';
import Perfil from '~/screens/aluno/perfil';
import CustomDrawerContent from './customDrawerContent';

const Drawer = createDrawerNavigator();

export default function AlunoDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        headerTitle: '',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          backgroundColor: '#f2f2f2',
        },
        drawerStyle: {
          backgroundColor: '#10131A',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Inicio"
        component={AlunoTabs}
      />
      <Drawer.Screen
        name="Meu Perfil"
        component={Perfil}
      />
    </Drawer.Navigator>
  );
}
