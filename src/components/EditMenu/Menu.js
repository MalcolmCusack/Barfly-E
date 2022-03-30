import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  listFoods,
  listBeers,
  listCocktails,
  listShots,
  listMenus,
} from "../../graphql/queries";
import {
  createFood,
  createCocktail,
  createBeer,
  createShot,
} from "../../graphql/mutations";
import { Text, View } from "../../../components/Themed";
import MenuItem from "./MenuItem";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import { Button, TextInput, Chip } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  box: {
    width: "100%",
  },
  orderQueueContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    // flexWrap: 'wrap'
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 20,
  },
  subtitle: {
    fontSize: 23,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

const Menu = () => {
  const [menuID, setMenuID] = useState("");
  const [FoodItems, setFoodItems] = useState([]);
  const [BeerItems, setBeerItems] = useState([]);
  const [ShotItems, setShotItems] = useState([]);
  const [CocktailItems, setCocktailItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemName, SetName] = useState("");
  const [itemPrice, SetPrice] = useState("");
  const [open, SetOpen] = React.useState(false);
  const [items, SetItems] = React.useState([]);
  const [type, SetType] = useState("");
  const [typelist, setTypeList] = React.useState([
    { label: "Beer", value: "Beer" },
    { label: "Shot", value: "Shot" },
    { label: "Cocktail", value: "Cocktail" },
    { label: "Food", value: "Food" },
  ]);

  const getBar = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("bar");

      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      } else {
        console.log("bar not found");
        return null;
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    const listMenu = async () => {
      try {
        var menuPromise = API.graphql(
          graphqlOperation(listFoods, { filter: { menuID: { eq: menuID } } })
        );
        var response = await menuPromise;
        setFoodItems(response.data.listFoods.items);

        menuPromise = API.graphql(
          graphqlOperation(listBeers, { filter: { menuID: { eq: menuID } } })
        );
        response = await menuPromise;
        setBeerItems(response.data.listBeers.items);

        menuPromise = API.graphql(
          graphqlOperation(listCocktails, {
            filter: { menuID: { eq: menuID } },
          })
        );
        response = await menuPromise;
        setCocktailItems(response.data.listCocktails.items);

        menuPromise = API.graphql(
          graphqlOperation(listShots, { filter: { menuID: { eq: menuID } } })
        );
        response = await menuPromise;
        setShotItems(response.data.listShots.items);

        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    return listMenu();
  }, [menuID]);

  useEffect(() => {
    const getMenuID = async () => {
      const bar = await getBar();

      try {
        var menuPromise = API.graphql(
          graphqlOperation(listMenus, { filter: { barID: { eq: bar.id } } })
        );
        var response = await menuPromise;
        setMenuID(response.data.listMenus.items[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    getMenuID();
  }, []);

  const createItem = async () => {
    var payload = {
      name: itemName,
      price: itemPrice,
      menuID: menuID,
    };

    console.debug(payload);
    try {
      var update;
      var updateResponse;

      if (type == "Food") {
        update = API.graphql(
          graphqlOperation(createFood, {
            input: payload,
          })
        );
        updateResponse = await update;
        if (updateResponse.data) {
          SetItems([...items, updateResponse.data.createFood]);
        }
      } else if (type == "Beer") {
        update = API.graphql(
          graphqlOperation(createBeer, {
            input: payload,
          })
        );
        updateResponse = await update;
        if (updateResponse.data) {
          SetItems([...items, updateResponse.data.createBeer]);
        }
      } else if (type == "Cocktail") {
        update = API.graphql(
          graphqlOperation(createCocktail, {
            input: payload,
          })
        );
        updateResponse = await update;
        if (updateResponse.data) {
          SetItems([...items, updateResponse.data.createCocktail]);
        }
      } else if (type == "Shot") {
        update = API.graphql(
          graphqlOperation(createShot, {
            input: payload,
          })
        );
        updateResponse = await update;
        if (updateResponse.data) {
          SetItems([...items, updateResponse.data.createShot]);
        }
      }

      if (updateResponse.data) {
        SetName("");
        SetPrice("");
        SetType("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
       <Text style={styles.title}>Add Menu Items</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
       
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "20%",
          }}
        >
          {items.map((item) => {
            return (
              <Chip
                style={{ margin: 10 }}
                icon="delete"
                key={Math.random() + ""}
                //onPress={() => DeleteItem(item)}
              >
                {item.name}
              </Chip>
            );
          })}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
          }}
        >
          <DropDownPicker
            placeholder="Select Item Type"
            setValue={SetType}
            setItems={setTypeList}
            setOpen={SetOpen}
            value={type}
            items={typelist}
            open={open}
            style={{
              width: "50%",
              margin: 10,
              alignSelf: "flex-end",
              backgroundColor: "rgb(187, 134, 252)",
            }}
          />

          <TextInput
            value={itemName}
            onChangeText={(e) => SetName(e)}
            label="Item Name"
            autoComplete={null}
            style={{ width: "50%", margin: 10, alignSelf: "flex-end" }}
          />
          <TextInput
            onChangeText={(e) => SetPrice(e)}
            value={itemPrice}
            keyboardType="numeric"
            label="Item Price"
            autoComplete={null}
            style={{ width: "50%", margin: 10, alignSelf: "flex-end" }}
          />

          <Button onPress={createItem} style={{ alignSelf: "flex-end" }}>
            Create
          </Button>
        </View>
      </View>

      <Text style={styles.title}>Edit Menu</Text>

      <View style={styles.box}>
        <Text style={[styles.subtitle, { marginBottom: 100 }]}>Beers</Text>
        <View style={styles.orderQueueContainer}>
          {!isLoading
            ? BeerItems.map((item) => {
                return (
                  <MenuItem
                    key={item.id + Math.random()}
                    item={item}
                    type="Beer"
                  />
                );
              })
            : null}
        </View>

        <Text style={[styles.subtitle, { marginTop: 100 }]}>Cocktails</Text>
        <View style={styles.orderQueueContainer}>
          {!isLoading
            ? CocktailItems.map((item) => {
                return (
                  <MenuItem
                    key={item.id + Math.random()}
                    item={item}
                    type="Cocktail"
                  />
                );
              })
            : null}
        </View>

        <Text style={styles.subtitle}>Food</Text>
        <View style={styles.orderQueueContainer}>
          {!isLoading
            ? FoodItems.map((item) => {
                return (
                  <MenuItem
                    key={item.id + Math.random()}
                    item={item}
                    type="Food"
                  />
                );
              })
            : null}
        </View>

        <Text style={styles.subtitle}>Shots</Text>
        <View style={styles.orderQueueContainer}>
          {!isLoading
            ? ShotItems.map((item) => {
                return (
                  <MenuItem
                    key={item.id + Math.random()}
                    item={item}
                    type="Shots"
                  />
                );
              })
            : null}
        </View>
      </View>
    </View>
  );
};

export default Menu;
