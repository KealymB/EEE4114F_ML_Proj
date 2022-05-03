import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OB from "react-native-onboarding-swiper";

import Button from "../Components/Button";
import colors from "../utils/theme";

const Onboarding: React.FC = ({ route }) => {
  const { getAsyncData } = route.params;

  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify(false);
      await AsyncStorage.setItem("newUser", jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <OB
        titleStyles={{ color: "red" }}
        showSkip={false}
        onDone={() => {
          storeData();
          getAsyncData();
        }}
        pages={[
          {
            backgroundColor: colors.secondary,
            image: <Image source={require("../assets/favicon.png")} />,
            title: "test",
            subtitle: "Done with React Native Onboarding Swiper",
          },
          {
            backgroundColor: colors.secondary,
            image: <Image source={require("../assets/favicon.png")} />,
            title: "test",
            subtitle: "Done with React Native Onboarding Swiper",
          },
        ]}
      />
    </View>
  );
};

export default Onboarding;
