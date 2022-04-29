import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashMessage from "react-native-flash-message";
import { LogBox } from "react-native";
import * as Sentry from "sentry-expo";

import WelcomeScreen from "./screens/WelcomeScreen";
import PracticeScreen from "./screens/PracticeScreen";
import TestScreen from "./screens/TestScreen";
import DataScreen from "./screens/DataScreen";
import Constants from "expo-constants";
import colors from "./utils/theme";

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs(); // not for final

  Sentry.init({
    dsn: "https://28ac5803fc2f4b6fb65cd1852dff5e55@o511887.ingest.sentry.io/6371146",
    enableInExpoDevelopment: true,
    debug: false,
  });

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          defaultScreenOptions={{
            headerStyle: { backgroundColor: colors.primary },
          }}
        >
          <Stack.Screen
            name="welcomeScreen"
            component={WelcomeScreen}
            options={{
              headerShown: false,
              headerStyle: { backgroundColor: colors.primary },
            }}
          />
          <Stack.Screen
            name="practiceScreen"
            component={PracticeScreen}
            options={{
              title: "Learn",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "regular",
              },
            }}
          />
          <Stack.Screen
            name="testScreen"
            component={TestScreen}
            options={{
              title: "Practice",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "regular",
              },
            }}
          />
          <Stack.Screen
            name="dataScreen"
            component={DataScreen}
            options={{
              title: "How to",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "regular",
              },
            }}
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
