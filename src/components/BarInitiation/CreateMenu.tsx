import { View, Text } from 'react-native';
import { Button, TextInput, Headline } from "react-native-paper";
import React from 'react';

export default function CreateMenu(props) {
  const [name, setName] = React.useState("");

  function createMenu() {

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
      <Button
        style={{ width: "50%", margin: 20 }}
        mode="contained"
        onPress={props.nextStep}
      >
        Next
      </Button>
      <Button
        style={{ width: "50%", margin: 20 }}
        mode="contained"
        onPress={props.prevStep}
      >
        Back
      </Button>
    </View>
  );
}
