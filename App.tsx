import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Auth } from 'aws-amplify';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify from 'aws-amplify';
import config from './src/aws-exports'
import {Button, DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

Amplify.configure(config);

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      myColor: '#fff'
    }

    interface Theme {
      
    }
  }

}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    myColor: '#fff',
  }
}


export default function App() {


  const colorScheme = useColorScheme();

  //console.log(user)
  async function signOut() {
    try {
        await Auth.signOut();
        //dispatch({ type: "RESET_USER_DATA" });
    } catch (error) {
        console.log(error);
    }
}



 

  
    return (
        <SafeAreaProvider>
          
      
          <PaperProvider >
              <>
              <Navigation colorScheme={colorScheme} />
              <Button  onPress={signOut}>Log Out</Button>

              <StatusBar />
              </>
            </PaperProvider>

      
        </SafeAreaProvider>

      );
  }

