/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Auth: undefined;
  Settings: undefined;
  Menu: undefined;
  Drawer: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  TabThree: undefined;

};

export type AuthTabParamList = {
  SignUp: undefined;
  SignIn: undefined;
  ForgotPass: undefined
  BarInitiation: undefined
};

export type SettingsTabParamList = {
  EditEmployees: undefined;
  CreateMenu: undefined;
  QRCode: undefined;
  BarInitiation: undefined;
  EditBar: undefined;
  ChangePassword: undefined;
  EditMenu: undefined;
  OrderSummary: undefined;
  SignOut: undefined;
  EditCommon: undefined;
};

export type DrawerNav = {
  ForgotPass: undefined;
  Settings: undefined;

};



export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  
  NativeStackScreenProps<RootStackParamList>
>;


export type Orders = {
  items: any[]
}
