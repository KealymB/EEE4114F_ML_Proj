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

  const HowTo = ({
    headerText,
    children,
  }: {
    headerText: string;
    children: JSX.Element;
  }) => {
    return (
      <View
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: colors.secondary,
          borderRadius: 10,
          borderColor: colors.primary,
          borderWidth: 2,
          marginTop: 10,
        }}
      >
        <View>
          <Text style={{ color: "white", fontSize: 30 }}>{headerText}</Text>
        </View>
        <View>{children}</View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: colors.tertiary, flex: 1 }}>
      <ScrollView style={{ width: "100%" }}>
        <HowTo headerText="What is the game">
          <Text>test</Text>
        </HowTo>
      </ScrollView>
    </View>
  );
};

export default PracticeScreen;

const styles = StyleSheet.create({});
