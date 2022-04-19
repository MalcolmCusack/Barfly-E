import React from "react";
import  {  useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Button, TextInput, Headline } from "react-native-paper";
import { View, Text } from "../Themed";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);
    const [message, setMessage] = useState("");
    const [passwordIssue, setPasswordIssue_raw] = useState("");

    function setPasswordIssue(value) {
        setPasswordIssue_raw(value);
        setMessage(value);
    }

    useEffect(() => {
        if (password === null || password2 === null) {
            setPasswordIssue("");
        } else if (password !== password2) {
            setPasswordIssue("Passwords Do Not Match");
        } else if (password === "") {
            setPasswordIssue("Password is Blank");
        } else {
            setPasswordIssue(null);
        }
    }, [password, password2]);

    const [resetingPassword, setResetingPassword] = useState(false);

    async function resetPassword() {
        try {
            if (passwordIssue !== null) {
                return;
            }
            setResetingPassword(true);
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(
                currentUser,
                oldPassword,
                password
            );
            setMessage("Password Changed")
        } catch (err) {
            setMessage(err.message);
        } finally {
            setResetingPassword(false);
        }
    }

    async function signOut() {
      try {
          await Auth.signOut();
      } catch (error) {
          console.log(error);
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
        <Headline style={{ margin: 10 }}>Change Password </Headline>
        <TextInput
          autoComplete={null}
          label="Old Password"
          secureTextEntry={true}
          placeholder="Email"
          value={oldPassword ?? ""}
          onChangeText={(text) => setOldPassword(text)}
          style={{ width: "50%", margin: 10 }}
        />
        <TextInput
          autoComplete={null}
          secureTextEntry={true}
          value={password ?? ""}
          label="New Password"
          placeholder="Password"
          style={{ width: "50%" }}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          autoComplete={null}
          secureTextEntry={true}
          value={password ?? ""}
          label="Confirm New Password"
          placeholder="Password"
          style={{ width: "50%" }}
          onChangeText={(text) => setPassword2(text)}
        />
        <Text>{message}</Text>
        <Button
          style={{ width: "50%", margin: 20 }}
          mode="contained"
          disabled={passwordIssue != null}
          onPress={resetPassword}
        >
          Change Password
        </Button>

        <Button onPress={signOut}>Log Out</Button>
      </View>
    );
}
