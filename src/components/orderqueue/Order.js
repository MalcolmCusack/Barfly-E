import React, {useState, useEffect} from 'react';
import { View } from '../../../components/Themed';
import {Card, Snackbar, Caption, Button, Subheading, Divider} from 'react-native-paper';
import { getUser } from '../../graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import {updateOrder, deleteOrder} from '../../graphql/mutations';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    orderContainer: {
      margin: 10,
      width: "100%",
      height: "auto",
      //maxHeight: 1000,
    },
    orderQueueContainer: {
    flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row',
      height:10
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

    time: {
        marginLeft: 15,
    },

    divider: {
        margin: 5
    },

  });

const Order = ({ order, index, employee, setOrders, orders}) => {
   
    const [orderItems, setOrderItems] = useState(JSON.parse(order.items))
    const [customer, setcustomer] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [visible, setVisable] = useState(false)

    const onDismissSnackBar = () => setVisable(false);

    const startOrder = async () => {
        const payload = {
            id: order.id,
            orderStatus: "in-progress",
            employeeID: employee.attributes.sub,
            _version: order._version
    
        }

        try {
            const update = API.graphql(graphqlOperation(updateOrder, {
                input: payload
            }))
            const updateResponse = await update
     
            let newOrders = [...orders]
            newOrders[index] = updateResponse.data.updateOrder
            setOrders(newOrders)
        } catch (err) {
            console.log(err)
        }
        
    }

    const completeOrder = async () => {
        const payload = {
            id: order.id,
            orderStatus: "complete",
            completed: true,
            employeeID: employee.attributes.sub,
            _version: order._version
        }

        try {
            const update = API.graphql({query: updateOrder, variables: {
                input: payload
            }});
            const updateResponse = await update
            let newOrders = [...orders]
            newOrders[index] = updateResponse.data.updateOrder
            setOrders(newOrders)
        } catch (err) {
            console.log(err)
        }
        
    }

    const dismissOrder = async () => {
        const payload = {
            id: order.id,
            _version: order._version
    
        }

        try {
            const update = API.graphql(graphqlOperation(deleteOrder, {
                input: payload
            }))
            const deleteResponse = await update
            let newOrders = [...orders]
            setOrders(newOrders.filter((item) => item!== order))
        } catch (err) {
            console.log(err)
        }
        
    }

    useEffect(() => {

        const gatherCustomer = async () => {
            try { 
                const data = API.graphql( {query: getUser, 
                    variables: {
                        id: order.userID
                    }
                })
                const response =  await data

                setcustomer(response.data.getUser)
                setIsLoading(false)
    
            } catch (err) {
                console.log(err)
            }
        }

        gatherCustomer()

        return () => {
            setcustomer();
          };        

        
    }, [])


    const getTime = () => {
        const orderDate = new Date(order.createdAt);
        const time = orderDate.getHours() + ':' +  orderDate.getMinutes() + ':' + orderDate.getSeconds();
        return time
    }
    
    return (

        <View style={styles.orderContainer}>
            {!isLoading ? (
                <>
                <Card key={order.id}>
                       <Card.Title title={customer.name.charAt(0).toUpperCase() + customer.name.slice(1) + "'s Order"} />
                       <Caption style={styles.time} > Placed: {getTime()}</Caption>
                       <Caption style={styles.time} > Code: {order.id.substring(0,5)}</Caption>
                       {order.employeeID ? (
                            <>
                            <Caption style={styles.time} > Employee: {order.employeeID.substring(0,5)}</Caption>
                            </>
                       ) : null}
                       <Divider style={styles.divider} />
                       
                       <Card.Content>
                           {orderItems.map(item => {
                              return (
                                <Subheading key={item.id+Math.random()}>
                                    {item.name}
                               </Subheading>
                              ) 
                           })}
                        
                       </Card.Content>
                       <Card.Actions>
                           <Button disabled={order.orderStatus === "complete" || order.orderStatus === "in-progress"} onPress={startOrder}>Start</Button>
                           <Button  disabled={!(order.orderStatus === "in-progress")} onPress={completeOrder}>Complete</Button>
                           <Button  disabled={!(order.orderStatus === "complete")} onPress={dismissOrder}>Dismiss</Button>
                       </Card.Actions>
                    
                   </Card>
                    <View style={styles.snackbar}>
                        <Snackbar
                            visible={visible}
                            onDismiss={onDismissSnackBar}
                            action={{
                            label: 'Undo',
                            onPress: () => {
                                // Do something
                            },
                            }}>
                            Click to Undo
                        </Snackbar>
                    </View>
                   
                </>
                           
            ) : null}
            
        </View>
    )
}


export default Order
