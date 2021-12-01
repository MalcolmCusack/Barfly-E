import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import OrderQueue from '../src/components/orderqueue/OrderQueue';

export default function TabOneScreen({ navigation }) {

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Order Queue</Text>
      

      <OrderQueue />
      
  
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
