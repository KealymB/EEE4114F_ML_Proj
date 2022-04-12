import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { MotiView, AnimatePresence } from "moti";

import colors from "../utils/theme";
import API from "../utils/API";

interface getStateInterface {
  selectedLetters: string[];
  selectedIndecies: number[];
}

interface LetterInterface {
  letter: string;
  state: string;
}

const PracticeScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [promptState, setPromptState] = useState<getStateInterface>();
  const [loading, setLoading] = useState(true);
  const cameraRef = useRef(null);

  const requestPerm = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const fetchPrompt = async () => {
    return fetch(API + "getState")
      .then((response) => response.json())
      .then((json) => {
        setPromptState(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const makeGuess = async () => {
    if (cameraRef?.current != null) {
      let pic = await cameraRef?.current.takePictureAsync({
        base64: true,
        quality: 0.2,
      });
      console.log(pic);
      const body = new FormData();
      body.append("base64Image", pic.base64);
      fetch(API + "makeGuess", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then((response) => response.json())
        .then((json) => {
          setPromptState(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    requestPerm();
    fetchPrompt();
  }, []);

  const Letter = ({ letter, state }) => {
    if (state == 0) {
      //if the letter has been guessed correctly
      return (
        <Text key={letter} style={[styles.baseLetter, styles.falseLetter]}>
          {letter}
        </Text>
      );
    }
    if (state == 2) {
      //if the letter has been guessed correctly
      return (
        <MotiView
          from={{
            scale: 1.2,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            loop: true,
            type: "timing",
            duration: 1500,
            delay: 100,
          }}
        >
          <Text key={letter} style={[styles.baseLetter, styles.pendingLetter]}>
            {letter}
          </Text>
        </MotiView>
      );
    }
    return (
      <Text key={letter} style={[styles.baseLetter, styles.trueLetter]}>
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
        <Text style={{ fontSize: 25, color: "white" }}>PROMPT</Text>
        <View style={styles.letterContainer}>
          {promptState ? (
            promptState.selectedLetters.map((letter, index) => {
              return (
                <Letter
                  letter={letter}
                  state={promptState.selectedIndecies[index]}
                />
              );
            })
          ) : (
            <Text>None found</Text>
          )}
        </View>
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
});
