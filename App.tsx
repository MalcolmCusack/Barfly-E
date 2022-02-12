import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Auth } from 'aws-amplify';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify from 'aws-amplify';
import config from './src/aws-exports'
import {Button, DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import AuthTabs from './components/auth/AuthTabs'

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

  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  function authenticate() {
    setIsAuthenticated(!isAuthenticated)
  }

   function signOut() {
     Auth.signOut()
     .then(res => console.log(res))
     .catch(err => console.log(err));
       // dispatch({ type: "RESET_USER_DATA" });
   }

   console.log(Auth)

  if (!isLoadingComplete) {
    return null;
  } else {
  
    return (
      <SafeAreaProvider>
        
        <PaperProvider >

          {isAuthenticated ? (
            <>
             <Navigation colorScheme={colorScheme} />
             <Button  onPress={signOut}>Log Out</Button>

             <StatusBar />
            </>
            
          ) : (
            <AuthTabs />
          )}
          
         

      
        </PaperProvider>
         
        
      </SafeAreaProvider>
    );
  }
}
