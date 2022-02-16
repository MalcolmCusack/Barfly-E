import React, {useState, useEffect} from 'react';
import { Text, View } from '../../../components/Themed';
import {Card, Snackbar, Caption, Button, Subheading, Divider, TextInput} from 'react-native-paper';
import { getUser } from '../../graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import { List, Colors } from 'react-native-paper';
import {updateFood, updateBeer, updateCocktail, updateShot} from '../../graphql/mutations';
import { StyleSheet, TouchableHighlight } from 'react-native';

const MenuItem = ({ item, type }) => {
    //console.log(item)

    const [itemPrice, SetPrice] = useState(item.price.toFixed(2))
    const [itemName, SetName] = useState(item.name)
    const [isLoading, setIsLoading] = useState(true)
    const [visible, setVisable] = useState(false)

    const onToggleSnackBar = () => setVisable(!visible);

    const onDismissSnackBar = () => setVisable(false);
    


        

    const updateItem = async () => {
       // onChangeName("Bison")
       // onChangeName(itemName)
      //  onChangePrice(item.price)
        console.debug(itemName)
        console.debug(item.name)
        const payload = {
            id: item.id,
            name: itemName,
            price: itemPrice,
            _version: item._version
    
        }

        console.debug(payload)
        try {
            var update 
            var updateResponse 

            if(type=="Food"){
                update = API.graphql(graphqlOperation(updateFood, {
                    input: payload
                }))
                updateResponse = await update
            }
            else if(type=="Beer"){
                update = API.graphql(graphqlOperation(updateBeer, {
                    input: payload
                }))
                updateResponse = await update
            }
            else if(type=="Cocktail"){
                update = API.graphql(graphqlOperation(updateCocktail, {
                    input: payload
                }))
                updateResponse = await update
            }
           // setIsLoading(false)
            console.log(updateResponse)
            //onToggleSnackBar()
        } catch (err) {
            console.log(err)
        }
        
    }
    
    const OnChangeName = (newName) => {
        SetName(newName);
    }

    const OnChangePrice = (newPrice) => {
        SetPrice(newPrice);
    }


    const styles = StyleSheet.create({
        orderContainer: {
          margin: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          
        },
        orderQueueContainer: {
        flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column'
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

        input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
          },

      });
    
    return (

        <View style={styles.orderContainer}>
            
            <TextInput
                style={styles.input}
                onChange={(e) => OnChangeName(e.target.value)}
                value={itemName}
            />

            <TextInput
                style={styles.input}
                onChange={(e) => OnChangePrice(e.target.value)}
                value={itemPrice}
                
            />
            <Button onPress={updateItem}>Save</Button>
            
            <View style={styles.snackbar}>
                        <Snackbar
                            visible={visible}
                            onDismiss={onDismissSnackBar}
                            >
                            Item Updated
                        </Snackbar>
                    </View>
            
            

        </View>
    )
}


export default MenuItem
