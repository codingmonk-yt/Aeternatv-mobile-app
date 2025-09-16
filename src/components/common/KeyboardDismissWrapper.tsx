import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

interface KeyboardDismissWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * A wrapper component that dismisses the keyboard when tapping outside of text inputs
 * This should wrap the main content of screens that contain TextInput components
 */
export default function KeyboardDismissWrapper({ children, style }: KeyboardDismissWrapperProps) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={[{ flex: 1 }, style]}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
}
