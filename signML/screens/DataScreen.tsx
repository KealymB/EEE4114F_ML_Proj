import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
  Alert,
  Image,
  Vibration,
} from "react-native";
import { Camera } from "expo-camera";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import { useIsFocused } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as Brightness from "expo-brightness";

import colors from "../utils/theme";
import API from "../utils/API";

const PracticeScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();
  const [letters, setLetters] = useState<string[]>();
  const [imageCount, setImageCount] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<number>(0);
  const cameraRef = useRef(null);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isFocused = useIsFocused();

  const E = require("../assets/letters/E.png");
  const N = require("../assets/letters/N.png");
  const G = require("../assets/letters/G.png");
  const I = require("../assets/letters/I.png");
  const R = require("../assets/letters/R.png");

  const LETTERS = [E, N, G, I, R];

  useLayoutEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setIsActive(nextAppState === "active");
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (imageCount >= 10) {
      Vibration.vibrate(); //vibrate over image count
      showMessage({
        message: "All images for this letter done, please move to next letter!",
        type: "success",
      });
    }
  }, [imageCount, selectedLetter]);

  const requestPerm = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync(); //request cam permission

    const permission = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);
    if (!permission.canAskAgain) {
      Alert.alert("Allow camera permissions");
      Linking.openSettings();
    }
    if (permission.status !== "granted") {
      const newPermission = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY
      );
      if (newPermission.status === "granted") {
        setHasPermission(true);
      }
    } else {
      setHasPermission(true);
    }
  };

  const fetchPrompt = async () => {
    return fetch(API + "getState")
      .then((response) => response.json())
      .then((json) => {
        setLetters(json.selectedLetters);
        setSelectedLetter(0);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const saveImage = async () => {
    try {
      setIsSaving(true);
      if (cameraRef?.current != null) {
        let pic = await cameraRef?.current.takePictureAsync({
          quality: 0.2,
        });
        MediaLibrary.saveToLibraryAsync(pic.uri);
        setImageCount(imageCount + 1); // increase count
        showMessage({
          message: "Image saved successfully!",
          type: "success",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    requestPerm();
    fetchPrompt();
  }, []);

  const Letter = ({ letter, index }: { letter: String; index: number }) => {
    if (index == selectedLetter) {
      //if the letter has been guessed correctly
      return (
        <View style={{ borderBottomWidth: 3, borderColor: "white" }}>
          <Text style={[styles.baseLetter, styles.pendingLetter]}>
            {letter}
          </Text>
        </View>
      );
    }
    return <Text style={[styles.baseLetter]}>{letter}</Text>;
  };

  return (
    <View style={styles.container}>
      {hasPermission && isActive && isFocused ? (
        <View style={styles.cameraView}>
          <Camera
            type={Camera.Constants.Type.back}
            ref={cameraRef}
            ratio={"1:1"}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              source={LETTERS[selectedLetter]}
              style={{
                width: "100%",
                height: "100%",
                alignSelf: "center",
                opacity: 0.6,
              }}
            />
          </Camera>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.cameraView,
            {
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() => {
            requestPerm();
          }}
        >
          <Text>Camera does not have permission, press to open prompt.</Text>
        </TouchableOpacity>
      )}
      <View style={styles.promptContainer}>
        <Text style={{ fontSize: 25, color: "white" }}>SELECTED LETTER</Text>
        <View style={styles.letterContainer}>
          {letters ? (
            letters.map((letter, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedLetter(index);
                    setImageCount(0);
                  }}
                  key={letter}
                >
                  <Letter letter={letter} index={index} />
                </TouchableOpacity>
              );
            })
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
      </View>
      <View style={styles.countContainer}>
        <Text>{imageCount}/10</Text>
      </View>
      {!isSaving ? (
        <>
          <TouchableOpacity style={styles.btn} onPress={() => saveImage()}>
            <Text style={styles.btnText}>Save Image</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => saveImage()}
            disabled={true}
          >
            <ActivityIndicator size={"large"} color="#000" />
          </TouchableOpacity>
        </>
      )}
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
  promptContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    marginTop: 50,
    alignItems: "center",
    padding: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  countContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    padding: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  letterContainer: {
    margin: 25,
    flexDirection: "row",
  },
  baseLetter: {
    fontSize: 80,
  },
  pendingLetter: {
    color: "white",
  },
  falseLetter: {
    color: "red",
    fontWeight: "bold",
  },
  trueLetter: {
    color: "green",
    fontWeight: "bold",
  },
  btn: {
    position: "absolute",
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    bottom: 20,
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
