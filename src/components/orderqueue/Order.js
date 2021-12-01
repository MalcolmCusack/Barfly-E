import React, {useState, useEffect} from 'react';
import { Text, View } from '../../../components/Themed';
import {Card, Title, Paragraph, Caption, Button, Subheading, Divider} from 'react-native-paper';
import { getUser } from '../../graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import { List, Colors } from 'react-native-paper';
import {updateOrder} from '../../graphql/mutations';



const Order = ({ order }) => {

    const [orderItems, setOrderItems] = useState(JSON.parse(order.items))
    const [user, setUser] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [expanded, setExpanded] = useState(false)

    

    const updateCurrentOrder = async () => {


        try {
            const update = API.graphql(graphqlOperation(updateOrder, {
                input: payload
            }))
            const updateResponse = await update
            console.log(updateResponse)
        } catch (err) {
            console.log(err)
        }
        
    }

    const startOrder = async () => {
        const payload = {
            id: order.id,
            orderStatus: "progress",
            _version: order._version
    
        }

        try {
            const update = API.graphql(graphqlOperation(updateOrder, {
                input: payload
            }))
            const updateResponse = await update
            console.log(updateResponse)
        } catch (err) {
            console.log(err)
        }
        
    }

    const completeOrder = async () => {
        const payload = {
            id: order.id,
            completed: !order.completed,
            orderStatus: "complete",
            _version: order._version

        }

        try {
            const update = API.graphql({query: updateOrder, variables: {
                input: payload
            }});
            const updateResponse = await update
            console.log(updateResponse)
        } catch (err) {
            console.log(err)
        }
        
    }

    useEffect(() => {

        const gatherUser = async () => {
            try { 
                console.log(order)
                const data = API.graphql( {query: getUser, 
                    variables: {
                        id: order.userID
                    }
                })
                const response =  await data
                console.log(response)
                setUser(response.data.getUser)
                setIsLoading(false)
    
            } catch (err) {
                console.log(err)
            }
        }

        gatherUser()

        
    }, [])

    const handlePress = () => {
        setExpanded(!expanded)
    }

     const renderOrder = () => {
        <List.Section>
        <List.Accordion
           title={user.name + "'s Order"}
           expanded={expanded}
           onPress={handlePress}
       >
           {orderItems.map(item => {
              return <List.Item key={item.id} 
                title={item.name} 
                description={item.id} 
                left={props => {<List.Icon color={Colors.blue500} icon='check'/>}}
                right={props => {<List.Icon icon='check'/>}}
                >
              </List.Item>
             
           })
           }
       </List.Accordion>
    </List.Section>
     }

    const getTime = () => {
        const orderDate = new Date(order.createdAt);
        const time = orderDate.getHours() + ':' +  orderDate.getMinutes() + ':' + orderDate.getSeconds();
        return time
    }
    
    return (

        <View>
            {!isLoading ? (
                   <Card key={order.id}>
                       <Card.Title title={user.name.charAt(0).toUpperCase() + user.name.slice(1) + "'s Order"} />
                       <Caption>Placed: {getTime()}</Caption>
                       <Divider />
                       
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
            
            ) : null}
            
            

        </View>
    )
}


export default Order
