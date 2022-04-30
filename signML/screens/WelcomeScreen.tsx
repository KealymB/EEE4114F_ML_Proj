import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../Components/Button";
import colors from "../utils/theme";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.tertiary }}>
      <View
        style={{
          paddingTop: 90,
          paddingBottom: 20,
          marginBottom: 120,
          backgroundColor: colors.secondary,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <Text style={styles.headerText}>SIGN TUTOR</Text>
      </View>
      <View style={styles.wrapper}>
        <Button
          onPress={() => navigation.navigate("practiceScreen")}
          text="Learn"
        />
        <Button
          onPress={() => navigation.navigate("testScreen")}
          text="Practice"
        />
        <Button
          onPress={() => navigation.navigate("scoreScreen")}
          text="Scores"
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("dataScreen")}
        style={{ position: "absolute", bottom: 20, alignSelf: "center" }}
      >
        <View style={{ alignItems: "center", marginBottom: 50 }}>
          <Text style={{ color: colors.primary }}>How to play?</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  headerCont: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    height: 200,
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  headerText: {
    color: colors.primary,
    fontSize: 40,
    alignSelf: "center",
  },
  wrapper: {
    padding: 8,
    justifyContent: "center",
  },
  btn: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  btnText: {
    fontSize: 28,
    color: "white",
  },
});
