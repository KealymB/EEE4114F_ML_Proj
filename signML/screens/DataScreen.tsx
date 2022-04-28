import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { showMessage, hideMessage } from "react-native-flash-message";

import colors from "../utils/theme";
import API from "../utils/API";

interface HOWTOTYPE {
  headerText: string;
  subText: string;
}

const PracticeScreen = () => {
  const [howTos, setHowTos] = useState<HOWTOTYPE[]>();
  const [isLoading, setLoading] = useState(true);

  const fetchHowTo = async () => {
    setLoading(true);
    return fetch(API + "getHowTos")
      .then((response) => response.json())
      .then((json) => {
        setHowTos(json.howTos);
      })
      .catch((error) => {
        showMessage({
          description: "Error reaching server",
          message: "Error#166",
          type: "danger",
        });
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHowTo();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%" }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchHowTo}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <Text style={{ color: "white" }}>Stop</Text>
      </ScrollView>
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
