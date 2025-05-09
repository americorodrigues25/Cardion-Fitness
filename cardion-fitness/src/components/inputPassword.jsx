import { useState } from 'react';
import { TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from '@emotion/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #0E1621;
  border: 1.5px solid #27272A;
  border-radius: 15px;
  margin-bottom: 8px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #e4e4e7;
  padding: 22px 40px;
`;

const ToggleButton = styled.TouchableOpacity`
  padding-right: 25px;
`;

export function InputPassword({ value, onChangeText, placeholder, placeholderTextColor = '#5d5d5d' }) {
  const [secure, setSecure] = useState(true);

  return (
    <Container>
      <StyledInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
      />
      <ToggleButton onPress={() => setSecure(prev => !prev)}>
        <Icon name={secure ? 'visibility-off' : 'visibility'} size={20} color="#ccc" />
      </ToggleButton>
    </Container>
  );
}
