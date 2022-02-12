import { View } from "react-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";
import { Auth } from "aws-amplify";

const SignUp = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  function signUp() {
    const data = Auth.signUp(name.replace(" ", ""), password, email)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  function confirmSignUp() {
    Auth.confirmSignUp(name.replace(" ", ""), code)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <View>
      <TextInput
        autoComplete={null}
        label="Name"
        placeholder="Name"
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        autoComplete={null}
        label="Email"
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        autoComplete={null}
        secureTextEntry={true}
        label="Password"
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        autoComplete={null}
        label="Phone"
        placeholder="Phone"
        onChangeText={(text) => setPhone(text)}
      />

      <Button onPress={signUp}>Sign Up</Button>

      <TextInput
        autoComplete={null}
        label="Code"
        placeholder="Code"
        onChangeText={(text) => setCode(text)}
      />

      <Button onPress={confirmSignUp}>Confirm</Button>
    </View>
  );
};

export default SignUp;
