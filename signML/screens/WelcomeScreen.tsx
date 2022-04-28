import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../utils/theme";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.tertiary }}>
      <View style={{ marginTop: 90, marginBottom: 150 }}>
        <Text style={styles.headerText}>SIGN TUTOR</Text>
      </View>
      <View style={styles.wrapper}>
        <View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("practiceScreen")}
          >
            <Text style={styles.btnText}>Learn</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("testScreen")}
          >
            <Text style={styles.btnText}>Practice</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("dataScreen")}>
          <View style={{ alignItems: "center", marginBottom: 50 }}>
            <Text style={{ color: colors.primary }}>How to play?</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    flex: 1,
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
