import { createStackNavigator } from '@react-navigation/stack';
import HomePersonal from '~/screens/personal/home';

const Stack = createStackNavigator();

const PersonalNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homePersonal" component={HomePersonal} />
      {/* outras telas do personal */}
    </Stack.Navigator>
  );
};

export default PersonalNavigation;
