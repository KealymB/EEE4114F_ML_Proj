import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashMessage from "react-native-flash-message";
import { LogBox } from "react-native";
import * as Sentry from "sentry-expo";

import WelcomeScreen from "./screens/WelcomeScreen";
import PracticeScreen from "./screens/PracticeScreen";
import ScoreScreen from "./screens/ScoreScreen";
import TestScreen from "./screens/TestScreen";
import DataScreen from "./screens/DataScreen";
import Constants from "expo-constants";
import colors from "./utils/theme";
import DSN from "./services/sentryInfo";

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs(); // not for final
  LogBox.ignoreLogs([
    "Modal with 'pageSheet' presentation style and 'transparent' value is not supported.",
  ]);

  Sentry.init({
    dsn: DSN,
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
              headerStyle: { backgroundColor: colors.secondary },
            }}
          />
          <Stack.Screen
            name="practiceScreen"
            component={PracticeScreen}
            options={{
              title: "Learn",
              headerStyle: {
                backgroundColor: colors.secondary,
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
                backgroundColor: colors.secondary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "regular",
              },
            }}
          />
          <Stack.Screen
            name="scoreScreen"
            component={ScoreScreen}
            options={{
              title: "Scores",
              headerStyle: {
                backgroundColor: colors.secondary,
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
                backgroundColor: colors.secondary,
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
