import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Auth, Hub } from 'aws-amplify';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify from 'aws-amplify';
import config from './src/aws-exports'
import {Button, DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import AuthTabs from './components/auth/AuthTabs'
import { StateProvider, useStateValue } from './src/state/StateProvider'
import reducer, { initialState } from './src/state/reducer';

export const ActionsContext = React.createContext(
  {} as { fetchData: () => void; signOut: () => Promise<void> }
);

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

  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [triggerFetch, setTriggerFetch] = React.useState(false);


  function fetchData() {
    setTriggerFetch(true);
}

  const { user , dispatch} = useStateValue();

  //console.log(user)
  async function signOut() {
    try {
        await Auth.signOut();
        dispatch({ type: "RESET_USER_DATA" });
    } catch (error) {
        console.log(error);
    }
}

  React.useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
        if (isMounted) {
            dispatch({ type: "FETCH_USER_DATA_INIT" });
        }
        try {
            if (isMounted) {
                const data = await Auth.currentAuthenticatedUser();
                if (data) {
                    dispatch({
                        type: "FETCH_USER_DATA_SUCCESS",
                        payload: { user: data },
                    });
                }
            }
        } catch (error) {
            if (isMounted) {
                dispatch({ type: "FETCH_USER_DATA_FAULURE" });
            }
        }
    };

    const HubListener = () => {
        Hub.listen("auth", (data) => {
            const { payload } = data;
            onAuthEvent(payload);
        });
    };

    const onAuthEvent = (payload : any) => {
        switch (payload.event) {
            case "signIn":
                if (isMounted) {
                    setTriggerFetch(true);
                }
                break;
            default:
                return;
        }
    };

    HubListener();
    fetchUserData()

    return () => {
        Hub.remove("auth", () => {});
        isMounted = false;
    };
}, [triggerFetch]);

  function authenticate() {
    setIsAuthenticated(!isAuthenticated)
  }

  
    return (
  
      <SafeAreaProvider>
        <StateProvider initialState={initialState} reducer={reducer} >
          <ActionsContext.Provider value={{ fetchData, signOut}}>
          <PaperProvider >
            <>
            <Navigation colorScheme={colorScheme} />
            <Button  onPress={signOut}>Log Out</Button>

            <StatusBar />
            </>
          </PaperProvider>

          </ActionsContext.Provider>

        </StateProvider>
        
         
      </SafeAreaProvider>
    );
  }

