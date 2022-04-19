import React from "react";
import { Text, View } from "../../../components/Themed";
import { Button, TextInput, Headline } from "react-native-paper";
import { API, graphqlOperation } from "aws-amplify";
import { updateBar } from "../../graphql/mutations";
import UploadImageToS3WithReactS3 from "./UploadImageToS3WithReactS3";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EditBar() {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [bio, setBio] = React.useState("");

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

  React.useEffect(() => {
    let isMounted = true
    setBarValues();

    return () => {
      isMounted = false
    }
    
  }, []);

  async function setBarValues() {
    const bar = await getBar();
    setName(bar.name)
    setEmail(bar.email)
    setPhone(bar.phone)
    setBio(bar.bio)
  }


  async function editBar() {
    const barr = await getBar();

    const payload = {
      id: barr.id,
      _version: barr._version,
      name: name,
      email: email,
      // Have to change schema from AWSPhone to just a string
      //phone: phone,
      bio: bio,
    };
    try {
      const res = API.graphql(
        graphqlOperation(updateBar, {
          input: payload,
        })
      );

      const barPromise: any = await res;
    } catch (err) {
      console.log(err);
    }
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
      <Headline style={{ margin: 10 }}>Update Bar's Details</Headline>
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

      <UploadImageToS3WithReactS3 />

      <Button
        style={{ width: "50%", margin: 20 }}
        mode="contained"
        onPress={editBar}
        disabled={name === "" || email === "" || phone === "" || bio === ""}
      >
        Next
      </Button>
    </View>
  );
}

export default EditBar;
