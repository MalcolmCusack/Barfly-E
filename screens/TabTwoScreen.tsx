import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View} from '../components/Themed';
import NightlySummary from '../src/components/orderqueue/NightlySummary';


export default function TabTwoScreen({  }) {

  return (
    
      <View style={styles.container}>
        <NightlySummary />
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
  scrollView: {
    marginHorizontal: 10,
  }
});
