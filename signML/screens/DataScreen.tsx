import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { showMessage, hideMessage } from "react-native-flash-message";

import colors from "../utils/theme";

interface HOWTOTYPE {
  headerText: string;
  subText: string;
}

const PracticeScreen: React.FC = () => {
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
        <View style={{ marginTop: 10 }}>{children}</View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: colors.tertiary, flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <HowTo headerText="What is Sign Tutor">
          <Text style={{ color: "white" }}>
            Sign Tutor is a proof of concept. The motivation of the app was to
            see if machine learning could be leveraged to teach signed
            languages. As Sign Tutor is only a proof of concept it only teaches
            5 ASL static letters, but if effective the goal would be to teach
            and gamify the rest of the alphabet and possibly non-static signs.
          </Text>
        </HowTo>
        <HowTo headerText="Basic Usage">
          <Text style={{ color: "white" }}>
            Learning happens within the "Practice" screen. The
          </Text>
        </HowTo>
      </ScrollView>
    </View>
  );
};

export default PracticeScreen;

const styles = StyleSheet.create({});
