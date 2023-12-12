import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { ClerkProvider, SignedIn } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native';
import AccessPage from './pages/access';
import * as SecureStore from 'expo-secure-store'
import AppContextProvider from './resources/AppContext';
import AppScreen from './pages/app';
import type { TokenCache } from '@clerk/clerk-expo/dist/cache';
import { Text, View } from 'react-native-ui-lib';

const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      return SecureStore.setItemAsync(key, token);
    } catch (err) {
      return
    }
  },
  async clearToken(key: string) {
    try {
      return SecureStore.deleteItemAsync(key)
    } catch(err) {
      return
    }
  }
};

export default function App() {
  
  if(!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) return (
    <View flex center>
      <Text>Missing publishable clerk key</Text>
    </View>
  )

  return (
    <ClerkProvider 
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <StatusBar style='auto'/>
      <SafeAreaView style={{ flex: 1 }}>
        <SignedIn>
            <AppScreen/>
        </SignedIn>
        <AccessPage/>
      </SafeAreaView>
    </ClerkProvider>
  );
}


