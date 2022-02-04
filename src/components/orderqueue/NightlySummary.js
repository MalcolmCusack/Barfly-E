import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import { listOrders } from '../../graphql/queries';
import { Text, View } from '../../../components/Themed';
import Order from './Order';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    },
    orderQueueContainer: {
    flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      margin: 20,
      
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
  });

const NightlySummary = () => {

    const [orderItems, setOrderItems] = useState([])
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)


/*
  useEffect(() => {
    const subscribe = async () => {

        try {
        const ordersPromise = API.graphql(graphqlOperation(listOrders))
        const response = await ordersPromise
        //setAllOrders([...allOrders, response.data.listOrders.items])
        //console.log(response.data.listOrders.items)
        } catch (err) {
        console.log(err)
        }

        try {
            const orderResponse = API.graphql(graphqlOperation(onCreateOrder)
            ).subscribe({
                next: (orderData) => {
                   // console.log('full order data: ', orderData.value.data.onCreateOrder)
                    const items = JSON.parse(orderData.value.data.onCreateOrder.items)
                    setOrderItems(orderItems => [...orderItems, items])
                    setOrders(orders => [...orders, orderData.value.data.onCreateOrder])

                }
            })

  
            setIsLoading(false)

        } catch (err) {
            console.log(err)
        }

    }
      
    subscribe()
      
  }, [])*/
  useEffect(() => {


    const listOrdersBy = async () => {
        try {
            const response_promise = API.graphql(graphqlOperation(listOrders, {filter: {orderStatus: {eq: "received"}}}))
            const response = await response_promise
            //setOrders(response.data.listOrders.items)received
            //const items = JSON.parse(response.data.listOrders)
            setOrders(response.data.listOrders.items)
            console.debug("nbnbb")
            console.debug(response)
            setIsLoading(false)
        } catch (err) {
            console.log(err)
        }
    }
    
    listOrdersBy()
    
    },[])
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Income Summary</Text>
            <View style={styles.orderQueueContainer}>
                {!isLoading ? orders.map(order => {
                        return <Order key={order.id+Math.random(100000)} order={order} />
                }) : null}
            </View>
            
        </View>
    )
}

export default NightlySummary