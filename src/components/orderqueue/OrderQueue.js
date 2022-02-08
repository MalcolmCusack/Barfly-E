import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {onCreateOrder} from '../../graphql/subscriptions';
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

const OrderQueue = () => {

    const [orderItems, setOrderItems] = useState([])
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const orderTest = [
        {
    
             id :  'c3d52efa-84b1-44c3-8bf6-813fcc19f84d' ,
             timestamp : null,
             items : [
                "[{\"price\":16,\"name\":\"Bison Burger\",\"id\":\"05c28679-14c8-4a06-9261-c739f4f4f262\"},{\"price\":69.69,\"name\":\"Can of whoop ass\",\"id\":\"ca27fa30-54ac-4d0e-92a8-f5d216360289\"},{\"price\":23.5203409626507,\"name\":\"minim ex adipisici\",\"id\":\"5dde62ff-f2df-45fe-ae3c-0d3ff1d99bc1\"}]"
            ],
             completed : false,
             userID : "7b91aced-aa0f-44f8-b436-9dbe35862c8e",
             barID : null,
             employeeID : null,
             _version : 1,
             _deleted : null,
             _lastChangedAt : 1638242406472,
             createdAt : "2021-11-30T03:20:06.447Z",
             updatedAt : "2021-11-30T03:20:06.447Z",
             User : null
    
    },
]



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
      
    return subscribe()
      
  }, [])
    console.log(orders)
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Queue</Text>
            <View style={styles.orderQueueContainer}>
                {!isLoading ? orders.map(order => {
                        return <Order key={order.id+Math.random()} order={order} />
                }) : null}
            </View>
            
        </View>
    )
}



export default OrderQueue
