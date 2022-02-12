import { View } from "react-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";
import { Auth } from "aws-amplify";

const SignIn = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // screen props
  
    function signIn() {
      const data = Auth.signIn(email, password)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  
    
  
    return (
     <View>
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
        
        <Button onPress={signIn}>Sign In</Button>

      </View>
  );
};

export default SignIn;
