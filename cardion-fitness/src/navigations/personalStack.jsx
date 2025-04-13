import { createStackNavigator } from '@react-navigation/stack';
import PersonalDrawer from './personalDrawer';

const Stack = createStackNavigator();

const PersonalNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="homePersonal"
        component={PersonalDrawer}
      />
    </Stack.Navigator>
  );
};

export default PersonalNavigation;