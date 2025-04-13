import { createDrawerNavigator } from '@react-navigation/drawer';
import PersonalTabs from './personalTabs';

const Drawer = createDrawerNavigator();

export default function PersonalDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="Inicio" component={PersonalTabs} />

    </Drawer.Navigator>
  );
}
