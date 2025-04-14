import { createStackNavigator } from '@react-navigation/stack';
import PersonalDrawer from './personalDrawer';

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
    </Stack.Navigator>
  );
};

export default PersonalNavigation;