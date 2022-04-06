/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
 import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react' ;
import { ColorSchemeName, Pressable, View } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { AuthTabParamList, SettingsTabParamList, RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import TabThreeScreen from '../screens/TabThreeScreen';
import LinkingConfiguration from './LinkingConfiguration';
import SignUp from '../components/auth/SignUp';
import SignIn from '../components/auth/SignIn';
import { Auth, Hub } from 'aws-amplify';
import { ActivityIndicator } from 'react-native-paper';
import MultiStepForm from '../src/components/BarInitiation/MultiStepForm';
import CreateEmployees from '../src/components/BarInitiation/CreateEmployees';
import CreateMenu from '../src/components/BarInitiation/CreateMenu';
import QRCodeGenerator from '../src/components/BarInitiation/QRCodeGenerator';
import CreateCommon from '../src/components/BarInitiation/CreateCommon';
import ChangePassword from '../components/auth/ChangePassword';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  return (
  
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>

  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();


function RootNavigator() {

  const [user, setUser] = React.useState(undefined)
  
  const checkUser = async () => {
    try { 
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(authUser)
    } catch(err) {
      setUser(null)
    }
    
  }

  React.useEffect(() => {
    checkUser();
  }, [])

  React.useEffect(() => {
    const listener = (data) => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut' || data.payload.event === 'signUp') {
        checkUser()
      }
    }

    Hub.listen('auth', listener)

    return () => {
      Hub.remove('auth', listener)
    }
  }, [])

  if (user === undefined) {
      return (
        <View>
          <ActivityIndicator/>
        </View>
      )
  } else {
  return (
    

    <Stack.Navigator>
      { user ? (
        <>
          <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
          <Stack.Screen name="Settings" component={SettingsTabNav} />
          {/* <Stack.Screen name="Menu" component={Drawer} /> */}
        </>
        
      ) : (
        <>

          <Stack.Screen name="Auth" component={AuthTabNav} options={{ headerShown: false }}/>
          
        </>
        
      )}
      
    </Stack.Navigator>
  );
}
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();
const AuthBottomTab = createBottomTabNavigator<AuthTabParamList>();
const SettingBottomTab = createBottomTabNavigator<SettingsTabParamList>();

// the drawer import issn't working

// const DrawerNav = createDrawerNavigator()

// function Drawer() {

//   const colorScheme = useColorScheme()
//    async function signOut() {
//     try {
//         await Auth.signOut();
//     } catch (error) {
//         console.log(error);
//     }
//   } 

//   return (
//     <DrawerNav.Navigator>
//       <Button  onPress={signOut}>Log Out</Button>
//     </DrawerNav.Navigator>
//   )
// }

function AuthTabNav() {
  const colorScheme = useColorScheme()

  return (
    <AuthBottomTab.Navigator>
            <AuthBottomTab.Screen name="BarInitiation" component={MultiStepForm} />
            <AuthBottomTab.Screen name="SignIn" component={SignIn}  />
            <AuthBottomTab.Screen name="SignUp" component={SignUp}  />
            
    </AuthBottomTab.Navigator>
  )
}

function SettingsTabNav() {
  const colorScheme = useColorScheme()

  return (
    <SettingBottomTab.Navigator>
            {/* <SettingBottomTab.Screen name="SignOut" /> */}
            <SettingBottomTab.Screen name="CreateEmployees" component={CreateEmployees} />
            <SettingBottomTab.Screen name="QRCode" component={QRCodeGenerator}  />
            <SettingBottomTab.Screen name="EditCommon"  component={CreateCommon}/>
            <SettingBottomTab.Screen name="ChangePassword" component={ChangePassword} />

    </SettingBottomTab.Navigator>
  )
}


function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Order Queue',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <Ionicons name="menu" size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }} />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={({ navigation }: RootTabScreenProps<'TabTwo'>) => ({
          title: 'Income Summary',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
      
              <Ionicons name="menu" size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }} />
            </Pressable>
          ),
        })}
      /> 
      <BottomTab.Screen
        name ="TabThree"
        component={TabThreeScreen}
        options={({ navigation }: RootTabScreenProps<'TabThree'>) => ({
          title: 'Edit Menu',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
      
              <Ionicons name="menu" size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }} />
            </Pressable>
          ),
        })}
    />
</BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}


