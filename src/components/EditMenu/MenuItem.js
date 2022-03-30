import React, {useState, useEffect} from 'react';
import { Text, View } from '../../../components/Themed';
import {Button,TextInput} from 'react-native-paper';
import {API, graphqlOperation} from 'aws-amplify';
import {updateFood, updateBeer, updateCocktail, updateShot, deleteFood, deleteBeer, deleteCocktail, deleteShot} from '../../graphql/mutations';
import { StyleSheet } from 'react-native';

const MenuItem = ({ item, type }) => {

    const [itemPrice, SetPrice] = useState(item.price.toFixed(2))
    const [itemName, SetName] = useState(item.name)    

    message: "The variables input contains a field name 'name' that is not defined for input object type 'DeleteBeerInput' "


    async function deleteItem() {
        const payload = {
            id: item.id,
            _version: item._version
    
        }
        try {
            var update 
            var updateResponse 

            if(type=="Food"){
                update = API.graphql(graphqlOperation(deleteFood, {
                    input: payload
                }))
                updateResponse = await update
            }
            else if(type=="Beer"){
                update = API.graphql(graphqlOperation(deleteBeer, {
                    input: payload
                }))
                updateResponse = await update
            }
            else if(type=="Cocktail"){
                update = API.graphql(graphqlOperation(deleteCocktail, {
                    input: payload
                }))
                updateResponse = await update
            }
            else if(type=="Shot"){
                update = API.graphql(graphqlOperation(deleteShot, {
                    input: payload
                }))
                updateResponse = await update
            }
        
        } catch (err) {
            console.log(err)
        }

    }
        

    const updateItem = async () => {
        const payload = {
            id: item.id,
            name: itemName,
            price: itemPrice,
            _version: item._version
    
        }
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
            else if(type=="Shot"){
                update = API.graphql(graphqlOperation(updateShot, {
                    input: payload
                }))
                updateResponse = await update
            }
        
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
            width:'50%'
          },
          inputNum: {
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
                onChangeText={(e) => OnChangeName(e)}
                value={itemName}
            />

            <TextInput
                style={styles.inputNum}
                onChangeText={(e) => OnChangePrice(e)}
                value={itemPrice}
                keyboardType="numeric"
            />
            <Button onPress={updateItem}>Save</Button>
            <Button onPress={deleteItem}>Delete</Button>
            
            
            

        </View>
    )
}


export default MenuItem
