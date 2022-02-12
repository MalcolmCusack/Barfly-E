import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Auth } from 'aws-amplify';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify from 'aws-amplify';
import config from './src/aws-exports'
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SignUp from './components/auth/SignUp';

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
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

//   async function signOut() {
//     try {
//         await Auth.signOut();
//         dispatch({ type: "RESET_USER_DATA" });
//     } catch (error) {
//         console.log(error);
//     }
// }

  if (!isLoadingComplete) {
    return null;
  } else {
  
    return (
      <SafeAreaProvider>
        
        <PaperProvider >
          <SignUp/>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
      
        </PaperProvider>
         
        
      </SafeAreaProvider>
    );
  }
}
