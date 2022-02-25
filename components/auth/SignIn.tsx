import { View } from "react-native";
import React from "react";
import { Button, Headline, TextInput } from "react-native-paper";
import { Auth } from "aws-amplify";
import { margin } from "@mui/system";

const SignIn = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
  
    function signIn() {
      const data = Auth.signIn(email, password)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  
    return (
     <View style={{ display: 'flex', flexDirection:'column', alignItems:'center', width: '100%'}}>
        <Headline style={{margin: 10}}>Sign In</Headline>
        <TextInput
          autoComplete={null}
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{width: '50%', margin: 10}}
        />
        <TextInput
        
          autoComplete={null}
          secureTextEntry={true}
          value={password}
          label="Password"
          placeholder="Password"
          style={{width: '50%'}}
          onChangeText={(text) => setPassword(text)}
        />
        
        <Button  style={{width: '50%', margin: 20}} mode="contained" onPress={signIn}>Sign In</Button>
       

      </View>
  );
};

export default SignIn;
