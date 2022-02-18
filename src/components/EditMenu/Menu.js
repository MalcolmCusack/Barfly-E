import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import { listFoods, listBeers, listCocktails, listShots } from '../../graphql/queries';
import { Text, View } from '../../../components/Themed';
import MenuItem from './MenuItem';
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
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
     // flexWrap: 'wrap'
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      margin: 20,
      
    },
    subtitle: {
      fontSize: 23,
      fontWeight: 'bold',
      //margin: 10,
      justifyContent:'flex-end'
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
  });

const Menu = () => {

    const [FoodItems, setFoodItems] = useState([])
    const [BeerItems, setBeerItems] = useState([])
    const [ShotItems, setShotItems] = useState([])
    const [CocktailItems, setCocktailItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const listMenu = async () => {

        try {
        var menuPromise = API.graphql(graphqlOperation(listFoods))
        var response = await menuPromise
        setFoodItems(response.data.listFoods.items)

        menuPromise = API.graphql(graphqlOperation(listBeers))
        response = await menuPromise
        setBeerItems(response.data.listBeers.items)

        menuPromise = API.graphql(graphqlOperation(listCocktails))
        response = await menuPromise
        setCocktailItems(response.data.listCocktails.items)

        menuPromise = API.graphql(graphqlOperation(listShots))
        response = await menuPromise
        setShotItems(response.data.listShots.items)

        setIsLoading(false)
        } catch (err) {
        console.log(err)
        }
    }
      
    return listMenu()
      
  }, [])

  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Menu</Text>
            
            <Text style={styles.subtitle}>Beers</Text>
            <View style={styles.orderQueueContainer}>
                {!isLoading ? BeerItems.map(item => {
                        return <MenuItem key={item.id+Math.random()} item={item} type="Beer" />
                }) : null}
            </View>            
            
            <Text style={styles.subtitle}>Cocktails</Text>
            <View style={styles.orderQueueContainer}>
                {!isLoading ? CocktailItems.map(item => {
                        return <MenuItem key={item.id+Math.random()} item={item} type="Cocktail"/>
                }) : null}
            </View>           
            
            <Text style={styles.subtitle}>Food</Text>
            <View style={styles.orderQueueContainer}>
                {!isLoading ? FoodItems.map(item => {
                        return <MenuItem key={item.id+Math.random()} item={item} type="Food" />
                }) : null}
            </View>
            
            <Text style={styles.subtitle}>Shots</Text>
            <View style={styles.orderQueueContainer}>
                {!isLoading ? ShotItems.map(item => {
                        return <MenuItem key={item.id+Math.random()} item={item} type="Shots" />
                }) : null}
            </View>
            
        </View>
    )
}



export default Menu
