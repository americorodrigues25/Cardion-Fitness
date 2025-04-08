import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './authStack';
import AlunoStack from './alunoStack';
import PersonalStack from './personalStack';

const AppNavigation = () => {
  // Podemos fazer desse jeito o controle de navegação e tipo de usuario né
  const isLogged = false;
  const userType = ''; 


  return (
    <NavigationContainer>
      {!isLogged && <AuthStack />}
      {isLogged && userType === 'aluno' && <AlunoStack />}
      {isLogged && userType === 'personal' && <PersonalStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
