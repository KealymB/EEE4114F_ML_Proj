import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../utils/theme";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.tertiary }}>
      <View style={styles.headerCont}>
        <Text style={styles.headerText}>SIGN TUTOR</Text>
      </View>
      <View style={styles.wrapper}>
        {/* <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("practiceScreen")}
        >
          <Text style={styles.btnText}>Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("testScreen")}
        >
          <Text style={styles.btnText}>Test</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("dataScreen")}
        >
          <Text style={styles.btnText}>Data collect</Text>
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
    color: "white",
    fontSize: 40,
    alignSelf: "center",
  },
  wrapper: {
    padding: 8,
    justifyContent: "center",
    flex: 1,
  },
  btn: {
    backgroundColor: colors.primary,
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
