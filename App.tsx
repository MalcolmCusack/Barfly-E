import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import Amplify from "aws-amplify";
import config from "./src/aws-exports";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import reducer, { initialState } from "./src/state/reducer";
import { StateProvider } from "./src/state/StateProvider";

Amplify.configure(config);

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      myColor: "#fff";
    }

    interface Theme {}
  }
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    myColor: "#fff",
  },
};



export default function App() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StateProvider initialState={initialState} reducer={reducer}>
        <PaperProvider>
          <>
            <Navigation colorScheme={colorScheme} />

            <StatusBar />
          </>
        </PaperProvider>
      </StateProvider>
    </SafeAreaProvider>
  );
}
