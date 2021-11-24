import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {API, graphqlOperation} from 'aws-amplify';
import {onCreateOrder} from '../src/graphql/subscriptions';

export default function TabOneScreen({ navigation }) {

  const [orders, setOrders] = React.useState([])

  function subscribe() {
    API.graphql(graphqlOperation(onCreateOrder)
    ).subscribe({
        next: (orderData) => {
            console.log("orderData: ", orderData)
            setOrders([...orders, orderData.value.data.items])
        }
    })
}


  React.useEffect(() => {
      console.log('work')
      subscribe()
      
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text>What up</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
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
