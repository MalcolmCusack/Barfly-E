import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {onCreateOrder} from '../../graphql/subscriptions';
import { listOrders } from '../../graphql/queries';
import { Text, View } from '../../../components/Themed';
import Order from './Order';

const OrderQueue = () => {

    const [orderItems, setOrderItems] = useState([])
    const [orders, setOrders] = useState([])
    const [allOrders, setAllOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    


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
                    console.log('full order data: ', orderData.value.data.onCreateOrder)
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
      
  }, [])

    console.log(orderItems)
    console.log(orders)

    orders.map(order => {
        console.log('order: ', order)
    })
  
    return (
        <View >

            {!isLoading ? orders.map(order => {
                    return <Order key={order.id} order={order} />
            }) : null}
        </View>
    )
}

export default OrderQueue
