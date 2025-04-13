import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/personal/home';

const Tab = createBottomTabNavigator();

export default function PersonalTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Início" component={Home} />
        </Tab.Navigator>
    );
}
