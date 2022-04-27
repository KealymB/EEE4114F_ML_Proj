import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashMessage from "react-native-flash-message";
import { LogBox } from "react-native";

import WelcomeScreen from "./screens/WelcomeScreen";
import PracticeScreen from "./screens/PracticeScreen";
import TestScreen from "./screens/TestScreen";
import DataScreen from "./screens/DataScreen";
import Constants from "expo-constants";

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs(); // not for final
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="welcomeScreen"
            component={WelcomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="practiceScreen"
            component={PracticeScreen}
            options={{
              title: "Practice",
            }}
          />
          <Stack.Screen
            name="testScreen"
            component={TestScreen}
            options={{ title: "Test" }}
          />
          <Stack.Screen
            name="dataScreen"
            component={DataScreen}
            options={{ title: "Data Collect" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage
        position="top"
        statusBarHeight={Constants.statusBarHeight}
        floating
      />
    </View>
  );
}
