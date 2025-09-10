import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SearchPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Search
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
