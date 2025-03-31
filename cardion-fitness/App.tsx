// App.js
import { View, Text, Alert } from 'react-native';
import { Button, ButtonText } from './src/components/button';

import './global.css';

export default function App() {
  return (
    <View className="bg-neutral-900 flex-1 justify-center items-center">
      <Text className="text-neutral-400 text-9xl font-bold text-center">Teste</Text>

      {/* Usando o componente estilizado importado */}
      <Button onPress={() => Alert.alert('Você clicou no botão')}>
        <ButtonText>Entrar</ButtonText>
      </Button>
    </View>
  );
}