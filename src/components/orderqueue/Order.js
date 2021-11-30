import React, {useState, useEffect} from 'react';
import { Text, View } from '../../../components/Themed';
import {Card, Title, Paragraph, Button} from 'react-native-paper';
import { getUser } from '../../graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import { List, Colors } from 'react-native-paper';
import {updateOrder} from '../../graphql/mutations';



const Order = ({ order }) => {

    const [orderItems, setOrderItems] = useState(JSON.parse(order.items))
    const [user, setUser] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [expanded, setExpanded] = useState(false)

    const payload = {
        id: order.id,
        completed: !order.completed,
        items: order.items,
        userID: order.userID

    }

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



    return (

        <View>
            {!isLoading ? orderItems.map(item => {
               return  (
                   <Card key={item.id}>
                       <Card.Title title={item.name} />
                       <Card.Content>
                           <Paragraph>{user.name}</Paragraph>
                        
                       </Card.Content>
                       <Card.Actions>
                           <Button onPress={updateCurrentOrder}>Start</Button>
                           <Button onPress={updateCurrentOrder}>Complete</Button>
                       </Card.Actions>

                   </Card>
               )
            }) : null}
            
            

        </View>
    )
}


export default Order
