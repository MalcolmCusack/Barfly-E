
import React, { useState} from 'react';
import { View } from "../../../components/Themed";
import { Button, TextInput, Chip } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { API, graphqlOperation } from "aws-amplify";
import { createFood, createCocktail, createBeer, createShot } from "../../graphql/mutations";

function CreateMenu(props:any) {
  const [itemPrice, SetPrice] = useState("")
  const [itemName, SetName] = useState("")
  const [type, SetType] = useState("")
  const [menuID, setMenuID] = useState()
  const [open, SetOpen] = React.useState(false)
  const [items, SetItems] = React.useState([]);
  const [typelist, setTypeList] = React.useState([
    {label: 'Beer', value: 'Beer'},
    {label: 'Shot', value: 'Shot'},
    {label: 'Cocktail', value: 'Cocktail'},
    {label: 'Food', value: 'Food'},
  ])

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
        <DropDownPicker 
          placeholder='Select Item Type'
          setValue={SetType}
          setItems={setTypeList}
          setOpen={SetOpen}
          value={type}
          items={typelist}
          open={open}
          style={{ width: "50%", margin: 10, alignSelf:"flex-end", backgroundColor: 'rgb(187, 134, 252)' }}
          />

      <TextInput
          value={itemName}
          onChangeText={(e) => SetName(e)} 
          label="Item Name"
          autoComplete={null} 
          style={{ width: "50%", margin: 10, alignSelf:"flex-end"  }}
      />
      <TextInput
        onChangeText={(e) => SetPrice(e)}
        value={itemPrice}
        keyboardType="numeric"
        label="Item Price"
        autoComplete={null}
        style={{ width: "50%", margin: 10,  alignSelf:"flex-end" }}
       />
      
      <Button onPress={createItem} style={{alignSelf:"flex-end"}}>Create</Button>
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