import React from "react";
import { Text, View } from "../../../components/Themed";
import { Button, TextInput, Headline } from "react-native-paper";
import { API, graphqlOperation } from "aws-amplify";
import { createBar, createMenu } from "../../graphql/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UploadImageToS3WithReactS3 from "./UploadImageToS3WithReactS3";


function CreateCommon(props: any) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [bio, setBio] = React.useState("");

  const storeBar = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("bar", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  async function CreateBar() {
    const payload = {
      name: name,
      email: email,
      // Have to change schema from AWSPhone to just a string
      //phone: phone,,
      bio: bio,
    };
    try {
      const res = API.graphql(
        graphqlOperation(createBar, {
          input: payload,
        })
      );

      const barPromise:any = await res;

      storeBar(barPromise.data.createBar)

      var payload2 = {
        barID: barPromise.data.createBar.id
      }
  
      try {
        const res = API.graphql(
          graphqlOperation(createMenu, {
            input: payload2,
          })
        );
       const menuPromise =  await res;
       console.log(menuPromise)
       props.SetMenu(menuPromise.data.createMenu.id)
      } catch (err) {
        console.log(err);
      }
      
    } catch (err) {
      console.log(err);
    }
    props.nextStep();
  }
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      
      <UploadImageToS3WithReactS3/>
    
    </View>
  );
}

export default CreateCommon;
