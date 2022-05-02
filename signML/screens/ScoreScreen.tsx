import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import * as Analytics from "expo-firebase-analytics";

import colors from "../utils/theme";
import API from "../utils/API";

interface ScoreType {
  name: string;
  score: number;
}

const ScoreScreen = () => {
  const [scores, setScores] = useState<ScoreType[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const resp = await fetch(API + "getScores");
      const json = await resp.json();
      setScores(json.scores);
    } catch (error) {
      console.error(error);
      showMessage({
        message: "Network Error",
        description: "failed to fetch scores",
        type: "danger",
        duration: 2000,
      });
      await Analytics.logEvent("error", { type: "network" });
    } finally {
      setLoading(false);
    }
  };

  const Score: React.FC<ScoreType> = ({ name, score }) => {
    return (
      <View
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: colors.secondary,
          borderRadius: 10,
          borderColor: colors.primary,
          borderWidth: 2,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 30, alignSelf: "center" }}>
          {name} - {score}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: colors.tertiary, flex: 1 }}>
      <ScrollView
        style={{ width: "100%", padding: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchScores()}
            tintColor={colors.primary}
          />
        }
      >
        {scores
          .sort((a, b) => b.score - a.score)
          ?.map((score) => {
            return <Score score={score.score} name={score.name} />;
          })}
        {scores?.length == 0 && (
          <Text
            style={{
              color: colors.primary,
              justifyContent: "center",
              fontSize: 20,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            No scores found
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ScoreScreen;

const styles = StyleSheet.create({});
