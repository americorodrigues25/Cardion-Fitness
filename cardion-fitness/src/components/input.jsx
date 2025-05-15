import React from 'react';
import { TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import styled from '@emotion/native';

const StyledInput = styled.TextInput`
  width: 100%;
  padding: 20px 40px;
  background-color: #0E1621;
  border: 1.5px solid #27272A;
  border-radius: 16px;
  margin-bottom: 8px;
  font-size: 15px;
  color: #D4D4D8;
`;

export const Input = ({
  value,
  onChangeText,
  placeholder,
  mask = null,
  type = 'custom',
  options = {},
  ...rest
}) => {
  if (mask) {
    return (
      <StyledInput
        as={TextInputMask}
        type={type}
        options={options}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...rest}
      />
    );
  }

  return (
    <StyledInput
      as={TextInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      {...rest}
    />
  );
};
