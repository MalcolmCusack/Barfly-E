/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
          TabThree: {
            screens: {
              TabThreeScreen: 'three',
            },
          },
        },
      },
      Settings: {
        screens: {
          CreateEmployees: {
            screens: {
              CreateEmployeeScreen: 'four',
            }
          },
          CreateMenu: {
            screens: {
              CreateMenu: 'five',
            },
          },
          QRCode: {
            screens: {
              QRCodeGenerator: 'six',
            },
          },
          EditCommon: {
            screens: {
              EditCommon: 'seven',
            },
          },
          SignOut: {
            screens: {
              SignOut: 'eight',
            },
          },
          ForgotPassword: {
            screens: {
              ForgotPassword: 'nine',
            },
          },
          EditMenu: {
            screens: {
              EditMenu:'ten',
            },
          },
        }
      },
      Auth: {
        screens: {
          SignIn: {
            screens: {
              SignIn: 'elevin',
            },
          },
          SignUp: {
            screens: {
              SignUp: 'twelve',
            },
          },
          BarInitiation: {
            screens: {
              MultiStepForm: 'thirteen',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;
