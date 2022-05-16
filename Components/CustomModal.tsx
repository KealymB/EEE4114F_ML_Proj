import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Component } from "react";
import { Feather } from "@expo/vector-icons";
import colors from "../utils/theme";

interface CustomModalType {
  onClose?: () => void;
  title: string;
  visable: boolean;
  children: JSX.Element;
}

const CustomModal: React.FC<CustomModalType> = ({
  onClose,
  title,
  visable,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visable}
      onRequestClose={onClose}
      presentationStyle={"pageSheet"}
    >
      <View style={styles.modalWrapper}>
        {onClose ? (
          <TouchableOpacity
            style={{ justifyContent: "flex-end", flexDirection: "row" }}
            onPress={onClose}
          >
            <Feather name="x-circle" size={30} color="white" />
          </TouchableOpacity>
        ) : (
          <></>
        )}

        <View style={{ justifyContent: "center" }}>
          <Text
            style={{
              color: "white",
              fontSize: 40,
              alignSelf: "center",
            }}
          >
            {title}
          </Text>
          <View style={{ alignSelf: "center", marginTop: 10 }}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalWrapper: {
    marginBottom: 160,
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
    alignSelf: "center",
    position: "absolute",
    top: "25%",
  },
  modalHeader: {
    color: "white",
    fontSize: 40,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
});
