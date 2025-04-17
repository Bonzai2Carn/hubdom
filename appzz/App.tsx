// import React, { useEffect, useState } from 'react';
// import { StatusBar, LogBox } from 'react-native';
// import { Provider as PaperProvider } from 'react-native-paper';
// import { Provider as StoreProvider } from 'react-redux';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { theme } from './utils/theme';
// import store from './redux/store';
// import MainNavigator from './navigation/MainNavigator';
// import * as SplashScreen from 'expo-splash-screen';

// // Keep the splash screen visible until the app is ready
// SplashScreen.preventAutoHideAsync();

// // Ignore specific warnings from libraries
// LogBox.ignoreLogs([
//   'ViewPropTypes will be removed',
//   'ColorPropType will be removed',
//   'AsyncStorage has been extracted from react-native',
// ]);

// export default function App() {
//   const [appIsReady, setAppIsReady] = useState(false);

//   useEffect(() => {
//     // Prepare the app by loading any resources it needs
//     async function prepare() {
//       try {
//         // Add any resource loading here (fonts, assets, etc.)
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         // Tell the application to render
//         setAppIsReady(true);
//       }
//     }

//     prepare();
//   }, []);

//   useEffect(() => {
//     // Once the app is ready, hide the splash screen
//     if (appIsReady) {
//       SplashScreen.hideAsync();
//     }
//   }, [appIsReady]);

//   if (!appIsReady) {
//     return null;
//   }

//   return (
//     <StoreProvider store={store}>
//       <PaperProvider theme={theme}>
//         <SafeAreaProvider>
//           <StatusBar barStyle="light-content" backgroundColor="#1E1E2A" />
//           <MainNavigator />
//         </SafeAreaProvider>
//       </PaperProvider>
//     </StoreProvider>
//   );
// }