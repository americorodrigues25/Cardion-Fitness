// src/components/inputPassword.js
import { useState } from 'react';
import { TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from '@emotion/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #171c26;
  border: 1.5px solid #27272A;
  border-radius: 16px;
  padding: 25px 40px;
  margin-bottom: 16px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  color: white;
  font-size: 16px;
`;

const ToggleButton = styled.TouchableOpacity`
  padding-left: 8px;
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
