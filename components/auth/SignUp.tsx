import { View } from "react-native";
import React from "react";
import { Button, TextInput, Headline, Divider} from "react-native-paper";
import { Auth, graphqlOperation, API} from "aws-amplify";
import { listEmployees, getBar} from '../../src/graphql/queries';
import { useStateValue } from "../../src/state/StateProvider"
import { Typography } from "@mui/material";

const SignUp = ({navigation}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [notAdded, setNotAdded] = React.useState(false);
  const [{ bar }, dispatch] = useStateValue();

  async function signUp() {
    const response_promise = API.graphql(
      graphqlOperation(listEmployees, {
          filter: { email: { eq: email } },
      })
    );

    const response = await response_promise;
    if(response.data.listEmployees.items[0]){
      try{const res = API.graphql(
        graphqlOperation(getBar, {
          id: String(response.data.listEmployees.items[0].barID)
        })
      );
      const barPromise = await res;
      
      dispatch({
        type: "SET_BAR",
        bar : barPromise.data.getBar
    })
    }
      catch(e){
        console.log(e)
      }
      const data = Auth.signUp(name.replace(" ", ""), password, email)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      }
      else{
        setNotAdded(true);
      }
  }

  function confirmSignUp() {
    Auth.confirmSignUp(name.replace(" ", ""), code)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <View style={{ display: 'flex', flexDirection:'column', alignItems:'center', width: '100%'}}>
      <Headline style={{margin: 10}}>Sign Up</Headline>

      <TextInput
        autoComplete={null}
        label="Name"
        value={name}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        style={{width: '50%', margin: 10}}
      />
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
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{width: '50%', margin: 10}}
      />
      <TextInput
        autoComplete={null}
        label="Phone"
        placeholder="Phone"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        style={{width: '50%', margin: 10}}
      />
      {notAdded ? <Typography> You have not been added as an employee with Barfly</Typography> : null}
      <Button  style={{width: '50%', margin: 20}} mode="contained" onPress={signUp}>Sign Up</Button>
      <Divider/>
      <TextInput
        autoComplete={null}
        label="Code"
        placeholder="Code"
        value={code}
        onChangeText={(text) => setCode(text)}
        style={{width: '25%', margin: 10}}
      />

      <Button  style={{width: '25%', margin: 10}} mode="contained" onPress={confirmSignUp}>Confirm</Button>
    </View>
  );
};

export default SignUp;
