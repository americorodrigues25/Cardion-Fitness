import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Home from '../screens/aluno/home';
import { SafeAreaView, Platform, StatusBar } from 'react-native';

import { BlurView } from 'expo-blur';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ajustes from '~/screens/personal/ajustes';
import Desafio from '../screens/aluno/desafios';
import Conquistas from '~/screens/aluno/conquistas';

const Tab = createBottomTabNavigator();

export default function AlunoTabs() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6943FF',
        tabBarInactiveTintColor: '#E4E4E7',
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: '#10131A',
          elevation: 0,
          overflow: 'hidden',
          paddingBottom: Platform.OS === 'android' ? 10 : 0,
          height: Platform.OS === 'android' ? 60 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          marginTop: 4,
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={0}
            style={{
              flex: 1,
              overflow: 'hidden',
            }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="INICIO"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="DESAFIOS"
        component={Desafio}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bullseye-arrow" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="CONQUISTAS"
        component={Conquistas}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="trophy" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="AJUSTES"
        component={Ajustes}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.openDrawer();
          },
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" color={color} size={22} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}
