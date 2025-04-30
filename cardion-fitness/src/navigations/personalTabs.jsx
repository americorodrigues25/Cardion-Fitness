import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Home from '../screens/personal/home';
import Alunos from '~/screens/personal/listaAlunos';
import Ajustes from '~/screens/personal/ajustes';

import { BlurView } from 'expo-blur';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo'

const Tab = createBottomTabNavigator();

export default function PersonalTabs() {
    const navigation = useNavigation();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#6943FF',
                tabBarInactiveTintColor: '#E4E4E7',
                tabBarStyle: {
                    borderTopWidth: 0.5,
                    borderTopColor: '#27272A',
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    elevation: 0, 
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    marginTop: 4,
                },
                tabBarBackground: () => (
                    <BlurView
                        tint="dark" 
                        intensity={30}
                        style={{ flex: 1 }}
                    />
                ),
            }}
        >
            <Tab.Screen
                name="INICIO"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="home" color={color} size={28} />
                    ),
                }}
            />
            <Tab.Screen
                name="ALUNOS"
                component={Alunos}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="users" color={color} size={size} />
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
                        <Ionicons name="settings-sharp" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
