import React, {useState} from 'react';
import { Text, View } from '../../../components/Themed';
import {Card, Title, Paragraph, Button} from 'react-native-paper';


const Order = ({ order }) => {

    const [orderItems, setOrderItems] = useState(JSON.parse(order.items))

    //const items = JSON.parse(order.items)
    //setOrderItems(orderItems => [...orderItems, items])

    /*const fakeOrder = {
        {
            id: "b723b404-cf4a-43a9-813e-9433d7ace619",
            completed: false,
            userID: "7dbc2a86-e62d-4f7f-9678-8315a3d1220e",
            createdAt: "2021-11-27T04:25:32.084Z",
            "items": [
                "[{\"price\":6,\"name\":\"Mac n Cheese\",\"id\":\"ef750631-340d-4b8a-9dc2-75bd685893e0\"},{\"price\":69.69,\"name\":\"Can of whoop ass\",\"id\":\"ca27fa30-54ac-4d0e-92a8-f5d216360289\"}]"
            ],
            
        }
    }*/

    return (

        <View>
            {orderItems.map(item => {
               return  (
                   <Card>
                       <Card.Title title={item.name} />
                       <Card.Content>
                           <Paragraph>For Malcolm Cusack</Paragraph>
                        
                       </Card.Content>
                       <Card.Actions>
                           <Button>Start</Button>
                           <Button>Complete</Button>
                       </Card.Actions>

                   </Card>
               )
            })}
            
            

        </View>
    )
}


export default Order
