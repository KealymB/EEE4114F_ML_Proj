import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashMessage from "react-native-flash-message";
import { LogBox } from "react-native";
import * as Sentry from "sentry-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import WelcomeScreen from "./screens/WelcomeScreen";
import PracticeScreen from "./screens/PracticeScreen";
import ScoreScreen from "./screens/ScoreScreen";
import TestScreen from "./screens/TestScreen";
import DataScreen from "./screens/DataScreen";
import Onboarding from "./screens/Onboarding";

import colors from "./utils/theme";
import DSN from "./services/sentryInfo";

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs(); // not for final
  LogBox.ignoreLogs([
    "Modal with 'pageSheet' presentation style and 'transparent' value is not supported.",
  ]);

  const [newUser, setNewUser] = useState(true);

  Sentry.init({
    dsn: DSN,
    enableInExpoDevelopment: true,
    debug: false,
  });

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("newUser");
      if (value !== null) {
        console.log("Value: ", value == "true");
        setNewUser(value == "true");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          defaultScreenOptions={{
            headerStyle: { backgroundColor: colors.primary },
          }}
        >
          {newUser ? (
            <Stack.Screen
              name="onboarding"
              component={Onboarding}
              initialParams={{
                getAsyncData: () => getData(),
              }}
              options={{
                title: "Introduction",
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "regular",
                },
              }}
            />
          ) : (
            <>
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
                name="testScreen"
                component={TestScreen}
                options={{
                  title: "Assess",
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
            </>
          )}
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
