import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
  Image,
  Modal,
  Vibration,
} from "react-native";
import { Camera, Constants } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as Analytics from "expo-firebase-analytics";

import colors from "../utils/theme";
import API from "../utils/API";
import { showMessage } from "react-native-flash-message";
import Letter from "../Components/Letter";
import CustomModal from "../Components/CustomModal";

const PracticeScreen = ({ navigation }) => {
  const THRESHOLD = 30.0;
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();
  const [errorCount, setErrorCount] = useState(0);
  const [letterSet, setLetterSet] = useState<string[] | []>([
    "E",
    "N",
    "G",
    "I",
    "R",
  ]);
  const [selectedLetter, setSelectedLetter] = useState<number>(0);
  const [solvedLetters, setSolvedLetters] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const [helpModalVis, setHelpModalVis] = useState(false);
  const [predictImage, setPrecitImage] = useState();

  const [isActive, setIsActive] = useState(true);
  const isFocused = useIsFocused();

  const E = require("../assets/letters/E.png");
  const N = require("../assets/letters/N.png");
  const G = require("../assets/letters/G.png");
  const I = require("../assets/letters/I.png");
  const R = require("../assets/letters/R.png");

  const E_EXAMPLE = require("../assets/EXAMPLE_LETTERS/E_EXAMPLE.jpg");
  const N_EXAMPLE = require("../assets/EXAMPLE_LETTERS/N_EXAMPLE.jpg");
  const G_EXAMPLE = require("../assets/EXAMPLE_LETTERS/G_EXAMPLE.jpg");
  const I_EXAMPLE = require("../assets/EXAMPLE_LETTERS/I_EXAMPLE.jpg");
  const R_EXAMPLE = require("../assets/EXAMPLE_LETTERS/R_EXAMPLE.jpg");

  const EXAMPLES = [E_EXAMPLE, N_EXAMPLE, G_EXAMPLE, I_EXAMPLE, R_EXAMPLE];

  const LETTERS = [E, N, G, I, R];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => clearGame()}>
          <Text style={{ color: "white" }}>Restart</Text>
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
    return fetch(API + "getLetterSet")
      .then((response) => response.json())
      .then((json) => {
        if (json.letterSet) {
          clearGame();
          setLetterSet(json.letterSet);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const clearGame = async () => {
    setSelectedLetter(0);
    setSolvedLetters([false, false, false, false, false]);
  };

  const makeGuess = async () => {
    setLoading(true);
    if (cameraRef?.current != null) {
      let pic = await cameraRef?.current.takePictureAsync({
        quality: 0.2,
        skipProcessing: true,
        exif: true,
      });
      cameraRef?.current.pausePreview();
      pic = await manipulateAsync(pic.uri, [], {
        compress: 1,
        format: SaveFormat.JPEG,
        base64: true,
      });
      const body = new FormData();
      body.append("base64Image", pic.base64);
      body.append("currLetter", letterSet[selectedLetter]);

      console.log("here");

      fetch(API + "predictLetter", {
        method: "POST",
        body: body,
      })
        .then((response) => response.json())
        .then(async (json) => {
          console.log(
            "letterPredicted: " + json.letterPredicted,
            " | confidence: " + json.confidence
          );
          await Analytics.logEvent("prediction", {
            letterSelected: letterSet[selectedLetter],
            predictedLetter: json.letterPredicted,
            confidence: json.confidence,
          });
          if (
            json.confidence >= THRESHOLD &&
            json.letterPredicted == letterSet[selectedLetter]
          ) {
            let tempSet = solvedLetters;
            tempSet[selectedLetter] = true;
            setSolvedLetters(tempSet);
            setErrorCount(0);
            if (
              solvedLetters.findIndex((letter) => {
                return letter == false;
              }) != -1
            ) {
              let nextLetter = solvedLetters.findIndex((solved, index) => {
                return solved == false && index > selectedLetter;
              });
              if (nextLetter == -1) {
                nextLetter = solvedLetters.findIndex((solved) => {
                  return solved == false;
                });
              }
              setSelectedLetter(nextLetter);
              Vibration.vibrate(1000);
              showMessage({
                message: "Well done!! 🎉",
                type: "success",
                duration: 5000,
              });
            } else {
              Vibration.vibrate(2000);
              showMessage({
                message: "WOOHOO, you learnt 5 ASL letters!! 🎉",
                description: "Go to Practice to test your skills",
                type: "success",
                onPress: () => {
                  navigation.navigate("testScreen");
                },
                duration: 10000,
              });
            }
          } else {
            setErrorCount(errorCount + 1);
            Vibration.vibrate([500, 1000]);
            showMessage({
              message: "Keep trying, You've got this!",
              type: "info",
              duration: 3000,
            });
          }
        })
        .catch(async (error) => {
          console.error(error);
          showMessage({
            message: "Network Error",
            description: "failed to predict letter",
            type: "danger",
          });
          await Analytics.logEvent("error", { type: "network" });
        })
        .finally(() => {
          setLoading(false);
          cameraRef?.current.resumePreview();
        });
    }
  };

  useEffect(() => {
    requestPerm();
    fetchPrompt();
  }, []);

  return (
    <>
      <View style={styles.container}>
        {hasPermission && isActive && isFocused ? (
          <View style={styles.cameraView}>
            <Camera
              style={{ width: "100%", height: "100%" }}
              type={Camera.Constants.Type.back}
              ref={cameraRef}
              ratio={"1:1"}
              flashMode={Constants.FlashMode.on}
            >
              {!loading && (
                <Image
                  source={LETTERS[selectedLetter]}
                  style={{ flex: 1, alignSelf: "center", opacity: 0.7 }}
                />
              )}

              {errorCount > 1 && (
                <TouchableOpacity
                  style={{ position: "absolute", right: 5, top: 5 }}
                  onPress={() => {
                    setHelpModalVis(true);
                  }}
                >
                  <Feather name="help-circle" size={40} color="white" />
                </TouchableOpacity>
              )}
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
            <Text style={{ color: "white" }}>
              Camera does not have permission, press to open prompt.
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.promptContainer}>
          <Text style={{ fontSize: 25, color: "white" }}>Letters to learn</Text>
          <View style={styles.letterContainer}>
            {letterSet.map((letter, index) => {
              return (
                <Letter
                  key={index}
                  letter={letter}
                  id={index}
                  selectedLetter={selectedLetter}
                  setSelectedLetter={(id) => setSelectedLetter(id)}
                  solvedLetters={solvedLetters}
                />
              );
            })}
          </View>
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => makeGuess()}
          disabled={loading}
        >
          {!loading ? (
            <Text style={styles.btnText}>Submit</Text>
          ) : (
            <ActivityIndicator size="large" color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <CustomModal
        onClose={() => setHelpModalVis(false)}
        visable={helpModalVis}
        title={"Example"}
      >
        <Image
          style={{
            aspectRatio: 1,
            height: 250,
            borderRadius: 20,
            overflow: "hidden",
          }}
          source={EXAMPLES[selectedLetter]}
        />
      </CustomModal>
    </>
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
    borderWidth: 2,
    borderColor: colors.primary,
  },
  promptContainer: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 20,
    marginTop: 50,
    margin: 40,
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
    flexDirection: "row",
    height: 100,
    margin: 10,
    alignItems: "center",
  },
  btn: {
    position: "absolute",
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
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
