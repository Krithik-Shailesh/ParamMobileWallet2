import * as React from 'react';
import { AppRegistry } from 'react-native';
import {configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './src/App';

const fontConfig = {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-ExtraLight',
      fontWeight: 'normal',
    }
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);