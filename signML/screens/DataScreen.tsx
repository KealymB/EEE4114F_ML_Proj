import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import { MotiView, AnimatePresence } from "moti";
import * as MediaLibrary from "expo-media-library";

import colors from "../utils/theme";
import API from "../utils/API";

interface getStateInterface {
  selectedLetters: string[];
  selectedIndecies: number[];
}

interface LetterProps {
  letter: string;
}

const PracticeScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [letters, setLetters] = useState<string[]>();
  const [imageCount, setImageCount] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<String>();
  const cameraRef = useRef(null);

  const requestPerm = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const fetchPrompt = async () => {
    return fetch(API + "getState")
      .then((response) => response.json())
      .then((json) => {
        setLetters(json.selectedLetters);
        setSelectedLetter(json.selectedLetters[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const saveImage = async () => {
    try {
      if (cameraRef?.current != null) {
        let pic = await cameraRef?.current.takePictureAsync({
          quality: 0.2,
        });
        MediaLibrary.saveToLibraryAsync(pic.uri);
      }
    } catch (e) {
      console.error(e);
    }

    setImageCount(imageCount + 1);
  };

  useEffect(() => {
    requestPerm();
    fetchPrompt();
  }, []);

  const Letter = ({ letter }: { letter: String }) => {
    if (letter == selectedLetter) {
      //if the letter has been guessed correctly
      return (
        <View style={{ borderBottomWidth: 3, borderColor: "white" }}>
          <Text key={letter} style={[styles.baseLetter, styles.pendingLetter]}>
            {letter}
          </Text>
        </View>
      );
    }
    return (
      <Text key={letter} style={[styles.baseLetter]}>
        {letter}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <TouchableOpacity
          onPress={() => {
            makeGuess();
          }}
        >
          <Camera
            style={styles.cameraView}
            type={type}
            ref={cameraRef}
          ></Camera>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.cameraView}>
          <Text>Camera does not have permission, press to open prompt.</Text>
        </TouchableOpacity>
      )}
      <View style={styles.promptContainer}>
        <Text style={{ fontSize: 25, color: "white" }}>SELECTED LETTER</Text>
        <View style={styles.letterContainer}>
          {letters ? (
            letters.map((letter, index) => {
              return (
                <TouchableOpacity onPress={() => setSelectedLetter(letter)}>
                  <Letter key={letter} letter={letter} />
                </TouchableOpacity>
              );
            })
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => saveImage()}>
        <Text style={styles.btnText}>Save Image</Text>
      </TouchableOpacity>
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
