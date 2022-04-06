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
      <Headline style={{ margin: 10 }}>
        Enter Your Establishment's Details
      </Headline>
      <TextInput
        onChangeText={(value) => setName(value)}
        value={name}
        label="Establishment's Name"
        style={{ width: "50%", margin: 10 }}
        autoComplete={null}
      />
      <TextInput
        onChangeText={(value) => setEmail(value)}
        value={email}
        label="Email"
        placeholder="bar@barfly.llc"
        style={{ width: "50%", margin: 10 }}
        autoComplete={null}
      />
      <TextInput
        onChangeText={(value) => setPhone(value)}
        value={phone}
        label="Phone"
        placeholder="(123) 456-7890"
        style={{ width: "50%", margin: 10 }}
        autoComplete={null}
      />
      <TextInput
        onChangeText={(value) => setBio(value)}
        value={bio}
        label="Establishment's Description"
        style={{ width: "50%", height: 150, margin: 10 }}
        autoComplete={null}
        multiline={true}
      />

      <Button
        style={{ width: "50%", margin: 20 }}
        mode="contained"
        onPress={CreateBar}
        disabled={name === "" || email === "" || phone === "" || bio === ""}
      >
        Next
      </Button>

      <UploadImageToS3WithReactS3 />
    </View>
  );
}

export default CreateCommon;
