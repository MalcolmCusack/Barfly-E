import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { Text, View} from '../components/Themed';
import Menu from '../src/components/EditMenu/Menu';


export default function TabThreeScreen({  }) {

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Menu />
      </View> 
      </ScrollView>
    
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
