import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './authStack';
import AlunoNavigation from './alunoStack';
import PersonalNavigation from './personalStack';

const AppNavigation = () => {

  const [isLogged, setIsLogged] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const logged = await AsyncStorage.getItem('userLoggedIn');
      const role = await AsyncStorage.getItem('role');


      setIsLogged(logged === 'true');
      setUserType(role);
      setloading(false);
    };

    checkLogin();
  }, []);

  if (loading || isLogged  === null ) return null;


  return (
    <NavigationContainer>
      {!isLogged && <AuthStack />}
      {isLogged && userType === 'aluno' && <AlunoNavigation />}
      {isLogged && userType === 'personal' && <PersonalNavigation />}
    </NavigationContainer>
  );
};

export default AppNavigation;
