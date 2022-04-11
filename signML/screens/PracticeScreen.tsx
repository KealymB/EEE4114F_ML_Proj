import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

import colors from "../utils/theme";

const PracticeScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();
  const [type, setType] = useState(Camera.Constants.Type.front);

  const requestPerm = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    requestPerm();
  }, []);

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <Camera style={styles.cameraView} type={type}></Camera>
      ) : (
        <TouchableOpacity style={styles.cameraView}>
          <Text>Camera does not have permission, press to open prompt.</Text>
        </TouchableOpacity>
      )}
      <View style={styles.proptContainer}>
        <Text style={{ fontSize: 25, color: "white" }}>PROMPT</Text>
      </View>
    </View>
  );
};

export default PracticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
    padding: 8,
    alignItems: "center",
  },
  cameraView: {
    marginTop: 20,
    height: 250,
    width: 250,
    borderRadius: 20,
    overflow: "hidden",
  },
  proptContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    width: "100%",
    height: 150,
    marginTop: 50,
    alignItems: "center",
    padding: 8,
  },
});
