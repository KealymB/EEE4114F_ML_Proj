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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../utils/theme";
import API from "../utils/API";

const PracticeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [letterSet, setLetterSet] = useState<string[] | []>([
    "E",
    "N",
    "G",
    "I",
    "R",
  ]);
  const [currLetter, setCurrLetter] = useState<number>(0);
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
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => clearGame()}>
          <MaterialCommunityIcons name="restart" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
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
        console.log(json.letterSet);
        if (json.letterSet) {
          setCurrLetter(json.currLetter);
          setLetterSet(json.letterSet);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const clearGame = async () => {
    return fetch(API + "clearState", { method: "POST" })
      .then((response) => response.json())
      .then((json) => {
        if (json.letterSet) {
          setCurrLetter(json.currLetter);
          setLetterSet(json.letterSet);
        }
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
          console.log("made guess");
          setCurrLetter(json.currLetter);
          console.log("LEtter: " + json.currLetter);
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

  const Letter = ({ letter, id }) => {
    let state = 0;
    if (currLetter < id) {
      // letter guessed correctly
      state = 2;
    } else if (currLetter > id) {
      // letter still to be guessed
      state = 1;
    } else if (currLetter == id) {
      //this is the current letter
      state = 0;
    }
    if (state == 0) {
      //this is the current letter
      return (
        <View
          style={{
            padding: 5,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "white",
            margin: 2,
          }}
        >
          <Text key={letter} style={styles.baseLetter}>
            {letter}
          </Text>
        </View>
      );
    }
    if (state == 2) {
      // letter still to be guessed
      return (
        <View
          style={{
            padding: 5,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "grey",
            margin: 2,
            width: 70,
            alignItems: "center",
          }}
        >
          <Text key={letter} style={[styles.baseLetter, { color: "gray" }]}>
            {letter}
          </Text>
        </View>
      );
    }
    // letter guessed correctly
    return (
      <View
        style={{
          padding: 5,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: "green",
          margin: 2,
          width: 70,
          alignItems: "center",
        }}
      >
        <Ionicons
          name="checkmark-circle-sharp"
          size={16}
          color="green"
          style={{ position: "absolute", right: 0 }}
        />
        <Text key={letter} style={[styles.baseLetter, { color: "green" }]}>
          {letter}
        </Text>
      </View>
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
              source={LETTERS[currLetter]}
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
          {letterSet.map((letter, index) => {
            return <Letter key={index} letter={letter} id={index} />;
          })}
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
    fontSize: 60,
    color: "white",
    fontWeight: "500",
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
