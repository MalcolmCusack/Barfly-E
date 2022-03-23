
import React, { useState} from 'react';
import { View } from "../../../components/Themed";
import { Button, TextInput, Chip } from "react-native-paper";
import { API, graphqlOperation } from "aws-amplify";
import { createFood, createCocktail, createBeer, createShot } from "../../graphql/mutations";

function CreateMenu(props:any) {
  const [itemPrice, SetPrice] = useState("")
  const [itemName, SetName] = useState("")
  const [type, SetType] = useState("")
  const [items, SetItems] = React.useState([]);

  // TODO Delete 
  // async function DeleteMenuItem(item: any) {
  //   const payload = {
  //     id: item.id,
  //     _version: item._version,
  //   };
  //   const res = API.graphql({
  //     query: ,
  //     variables: { input: payload },
  //   });
  //   const deletePromise: any = await res;

  //   setEmployees(employees.filter((item) => item.id !== employee.id));
  //   return deletePromise;
  // }
  
  const createItem = async () => {
    
      var payload = {
         name: itemName,
         price: itemPrice,
         menuID: props.menu
 
     }

     console.debug(payload)
     try {
         var update
         var updateResponse

         if(type=="Food"){
             update = API.graphql(graphqlOperation(createFood, {
                 input: payload
             }))
             updateResponse = await update
             if (updateResponse.data) {
              SetItems([...items, updateResponse.data.createFood]);
             }
         }
         else if(type=="Beer"){
             update = API.graphql(graphqlOperation(createBeer, {
                 input: payload
             }))
             updateResponse = await update
             if (updateResponse.data) {
              SetItems([...items, updateResponse.data.createBeer]);
             }
         }
         else if(type=="Cocktail"){
             update = API.graphql(graphqlOperation(createCocktail, {
                 input: payload
             }))
             updateResponse = await update
             if (updateResponse.data) {
              SetItems([...items, updateResponse.data.createCocktail]);
             }
         }
         else if(type=="Shot"){
             update = API.graphql(graphqlOperation(createShot, {
                 input: payload
             }))
             updateResponse = await update
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
         console.log(err)
     }
     
 }

  return (
    <View style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    }}>
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
        <TextInput
          value={type}
          label="Item Type"
          onChangeText={(e) => SetType(e)} 
          autoComplete={null} 
      />

      <TextInput
          value={itemName}
          onChangeText={(e) => SetName(e)} 
          label="Item Name"
          autoComplete={null} 
      />
      <TextInput
        onChangeText={(e) => SetPrice(e)}
        value={itemPrice}
        keyboardType="numeric"
        label="Item Price"
        autoComplete={null}
       />
      
      <Button onPress={createItem}>Create</Button>
      </View>
    </View>
    <Button
      style={{ width: "50%", margin: 10 }}
      mode="contained"
      onPress={props.nextStep}
      disabled={itemPrice === "" || itemName === "" || type === ""}
    >
      Finish
    </Button>
    <Button
      style={{ width: "50%", margin: 10 }}
      mode="contained"
      onPress={props.prevStep}
    >
      Back
    </Button>
  </View>
  );
}

export default CreateMenu;