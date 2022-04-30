import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Component } from "react";
import colors from "../utils/theme";

interface ButtonProps {
  onPress: () => void;
  text: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onPress, text, loading }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn} disabled={loading}>
      {!loading ? (
        <Text style={styles.btnText}>{text}</Text>
      ) : (
        <ActivityIndicator size="large" color="#fff" />
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
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
  btnText: {
    fontSize: 28,
    color: "white",
  },
});
