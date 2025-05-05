import { createDrawerNavigator } from '@react-navigation/drawer';
import PersonalTabs from './personalTabs';
import Perfil from '~/screens/personal/perfil';
import HelSupport from '~/screens/shared/helpSupport';
import Privacy from '~/screens/shared/privacyScreen';
import CustomDrawerContent from './customDrawerContent';

const Drawer = createDrawerNavigator();

export default function PersonalDrawer() {
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
        component={PersonalTabs}
      />
      <Drawer.Screen
        name="Meu Perfil"
        component={Perfil}
      />
      <Drawer.Screen
        name="Ajuda e Suporte"
        component={HelSupport}
      />
      <Drawer.Screen
        name="Politica de privacidade"
        component={Privacy}
      />

    </Drawer.Navigator>
  );
}
