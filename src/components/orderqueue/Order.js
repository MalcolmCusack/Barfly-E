import React, {useState, useEffect} from 'react';
import { Text, View } from '../../../components/Themed';
import {Card, Snackbar, Caption, Button, Subheading, Divider} from 'react-native-paper';
import { getUser } from '../../graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import { List, Colors } from 'react-native-paper';
import {updateOrder} from '../../graphql/mutations';
import { StyleSheet } from 'react-native';

const Order = ({ order }) => {

    const [orderItems, setOrderItems] = useState(JSON.parse(order.items))
    const [user, setUser] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [expanded, setExpanded] = useState(false)
    const [visible, setVisable] = useState(false)

    const onToggleSnackBar = () => setVisable(!visible);

    const onDismissSnackBar = () => setVisable(false);


    const startOrder = async () => {
        const payload = {
            id: order.id,
            orderStatus: "in-progress",
            _version: order._version
    
        }

        try {
            const update = API.graphql(graphqlOperation(updateOrder, {
                input: payload
            }))
            const updateResponse = await update
            //console.log(updateResponse)
            //onToggleSnackBar()
        } catch (err) {
            console.log(err)
        }
        
    }

    const completeOrder = async () => {
        const payload = {
            id: order.id,
            orderStatus: "complete",
            _version: order._version
        }

        try {
            const update = API.graphql({query: updateOrder, variables: {
                input: payload
            }});
            const updateResponse = await update
            //console.log(updateResponse)
        } catch (err) {
            console.log(err)
        }
        
    }

    useEffect(() => {

        const gatherUser = async () => {
            try { 
                //console.log(order)
                const data = API.graphql( {query: getUser, 
                    variables: {
                        id: order.userID
                    }
                })
                const response =  await data
                //console.log(response)
                setUser(response.data.getUser)
                setIsLoading(false)
    
            } catch (err) {
                console.log(err)
            }
        }

        gatherUser()

        
    }, [])


    const getTime = () => {
        const orderDate = new Date(order.createdAt);
        const time = orderDate.getHours() + ':' +  orderDate.getMinutes() + ':' + orderDate.getSeconds();
        return time
    }

    const styles = StyleSheet.create({
        orderContainer: {
          margin: 10,
        },
        orderQueueContainer: {
        flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'row'
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
    
    return (

        <View style={styles.orderContainer}>
            {!isLoading ? (
                <>
                <Card key={order.id}>
                       <Card.Title title={user.name.charAt(0).toUpperCase() + user.name.slice(1) + "'s Order"} />
                       <Caption style={styles.time} > Placed: {getTime()}</Caption>
                       <Divider style={styles.divider} />
                       
                       <Card.Content>
                           {orderItems.map(item => {
                              return (
                                <Subheading key={item.id}>
                                    {item.name}
                               </Subheading>
                              ) 
                           })}
                        
                       </Card.Content>
                       <Card.Actions>
                           <Button onPress={startOrder}>Start</Button>
                           <Button onPress={completeOrder}>Complete</Button>
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
