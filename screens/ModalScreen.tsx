import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import {Auth} from 'aws-amplify'
import QRCode from "react-native-qrcode-svg";
import { Text, View } from '../components/Themed';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModalScreen() {

  const [showCode, setShowCode] = React.useState(false);
  const [bar, setBar] = React.useState();

  async function signOut() {
        try {
            await Auth.signOut();
        } catch (error) {
            console.log(error);
        }
      } 

      const getBar = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem("bar");
      
          if (jsonValue !== null) {
              return JSON.parse(jsonValue)
          } else {
              console.log("bar not found")
              return null
          }
        } catch (e) {
          console.log(e)
        }
      };

useEffect(() => {
  const fetchBar = async () => {
    const barr = await getBar()
    setBar(barr);
  }
  fetchBar()
}, [])   
  

  function toggleQR(){
    setShowCode(!showCode)
  }

  function showQR(){
  //  
    let logoFromFile = require('../BarflyLogo.png');
    let website = "www.barfly.llc/"
    let link = website + bar.id +"/menu"
    return <QRCode value={link} logo={logoFromFile} logoSize={100} size={300}/>
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button onPress={signOut}>Log Out</Button>
      <Button onPress={toggleQR}>{showCode ? "Hide" : "Show"} QR code</Button>
      {showCode ? showQR() : null}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
