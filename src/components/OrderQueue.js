import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {onCreateOrder} from '../graphql/subscriptions';
import { listOrders } from '../graphql/queries';
import { Text } from '../../components/Themed';

const OrderQueue = () => {

    const [orders, setOrders] = useState([])
    const [allOrders, setAllOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function subscribe() {

        try {
        const ordersPromise = API.graphql(graphqlOperation(listOrders))
        const response = await ordersPromise
        setAllOrders([...allOrders, response.data.listOrders.items])
        //console.log(response.data.listOrders.items)
        } catch (err) {
        console.log(err)
        }

        try {
            const orderResponse = API.graphql(graphqlOperation(onCreateOrder)
            ).subscribe({
                next: (orderData) => {
                    
                    const orderItems = JSON.parse(orderData.value.data.onCreateOrder.items)
                    setOrders(orders => [...orders, orderItems])
                }
            })
  
            setIsLoading(false)

        } catch (err) {
            console.log(err)
        }
        
}


  useEffect(() => {
      subscribe()
      
  }, [])

    console.log(orders)
  
    return (
        <div style={{height: '200px'}}>

            {!isLoading ? orders.map(order => {
                return order.map(element => {
                    {console.log(element.name)}
                    return <div key={element.id}>{element.name}</div>
                })
            }) : null}
        </div>
    )
}

export default OrderQueue
