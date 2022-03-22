import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import { listFoods, listBeers, listCocktails, listShots, listMenus } from '../../graphql/queries';
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
    box: {
      width: '100%',
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
      
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
  });

const Menu = () => {
    const [menuID, setMenuID] = useState("")
    const [FoodItems, setFoodItems] = useState([])
    const [BeerItems, setBeerItems] = useState([])
    const [ShotItems, setShotItems] = useState([])
    const [CocktailItems, setCocktailItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getBar = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("bar");
    
        if (jsonValue !== null) {
            return JSON.parse(jsonValue)
        } else {
            console.log("bar not found")
            return null
        }
      } catch (e) {
        // error reading value
      }
    };

  useEffect(() => {
    const listMenu = async () => {

        const bar = await getBar()
        console.log(bar)

        try {
        var menuPromise = API.graphql(graphqlOperation(listMenus, {filter: {barID: {eq: bar.id}}}))
        var response = await menuPromise
        setMenuID(response.data.listMenus.items[0].id)

        menuPromise = API.graphql(graphqlOperation(listFoods, {filter: {menuID: {eq: menuID}}}))
        response = await menuPromise
        setFoodItems(response.data.listFoods.items)

        menuPromise = API.graphql(graphqlOperation(listBeers, {filter: {menuID: {eq: menuID}}}))
        response = await menuPromise
        setBeerItems(response.data.listBeers.items)

        menuPromise = API.graphql(graphqlOperation(listCocktails, {filter: {menuID: {eq: menuID}}}))
        response = await menuPromise
        setCocktailItems(response.data.listCocktails.items)

        menuPromise = API.graphql(graphqlOperation(listShots, {filter: {menuID: {eq: menuID}}}))
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
            
            <View style={styles.box}>
           
            <Text style={[styles.subtitle, {marginBottom: 100}]}>Beers</Text>
            <View style={styles.orderQueueContainer}>
            
                {!isLoading ? BeerItems.map(item => {
                        return <MenuItem key={item.id+Math.random()} item={item} type="Beer" />
                }) : null}
            </View>            
            
            <Text style={[styles.subtitle, {marginTop: 100}]}>Cocktails</Text>
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
        </View>
    )
}



export default Menu
