import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/aluno/home';
import Treino from '../screens/aluno/treino';

const Tab = createBottomTabNavigator();

export default function AlunoTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Início" component={Home} />
      <Tab.Screen name="Treino" component={Treino} />
    </Tab.Navigator>
  );
}
