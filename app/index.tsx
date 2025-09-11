import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function IndexPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Index
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter',
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
