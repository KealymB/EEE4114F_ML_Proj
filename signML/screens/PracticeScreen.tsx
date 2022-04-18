import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

import colors from "../utils/theme";
import API from "../utils/API";

interface getStateInterface {
  selectedLetters: string[];
  selectedIndecies: number[];
}

type LetterInterface = {
  letter: string;
  state: number;
};

const PracticeScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [promptState, setPromptState] = useState<getStateInterface>();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  const [isActive, setIsActive] = useState(true);
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
    setLoading(true);
    if (cameraRef?.current != null) {
      let pic = await cameraRef?.current.takePictureAsync({
        base64: true,
        quality: 0.2,
      });
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
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    requestPerm();
    fetchPrompt();
  }, []);

  const Letter = ({ letter, state }: LetterInterface) => {
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
        <View style={{ borderBottomWidth: 3, borderColor: "white" }}>
          <Text key={letter} style={[styles.baseLetter, styles.pendingLetter]}>
            {letter}
          </Text>
        </View>
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
      {hasPermission && isActive && isFocused ? (
        <View style={styles.cameraView}>
          <Camera
            style={{ width: "100%", height: "100%" }}
            type={type}
            ref={cameraRef}
            ratio={"1:1"}
          >
            <Image
              source={LETTERS[2]}
              style={{ flex: 1, alignSelf: "center" }}
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
        <Text style={{ fontSize: 25, color: "white" }}>PROMPT</Text>
        <View style={styles.letterContainer}>
          {promptState ? (
            promptState.selectedLetters.map((letter, index) => {
              return (
                <Letter
                  key={letter}
                  letter={letter}
                  state={promptState.selectedIndecies[index]}
                />
              );
            })
          ) : (
            <ActivityIndicator size="large" color="#000" />
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => makeGuess()}>
        {!loading ? (
          <Text style={styles.btnText}>Submit</Text>
        ) : (
          <ActivityIndicator size="large" color="#000" />
        )}
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
