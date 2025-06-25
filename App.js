import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import InventoryListScreen from './screens/InventoryListScreen';
import BarcodeSelectionScreen from './screens/BarcodeSelectionScreen';
import CameraBarcodeScreen from './screens/CameraBarcodeScreen';
import ManualBarcodeScreen from './screens/ManualBarcodeScreen';
import ProductManagementScreen from './screens/ProductManagementScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="InventoryList"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="InventoryList"
            component={InventoryListScreen}
          />
          <Stack.Screen
            name="BarcodeSelection"
            component={BarcodeSelectionScreen}
          />
          <Stack.Screen
            name="CameraBarcode"
            component={CameraBarcodeScreen}
          />
          <Stack.Screen
            name="ManualBarcode"
            component={ManualBarcodeScreen}
          />
          <Stack.Screen
            name="ProductManagement"
            component={ProductManagementScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
