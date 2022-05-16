import React, { Component, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OB from "react-native-onboarding-swiper";
import { Video, AVPlaybackStatus, VideoState, VideoProps } from "expo-av";

import colors from "../utils/theme";

interface VideoPlayerProps {
  path: string;
  id: number;
}

const Onboarding: React.FC = ({ route }) => {
  const { getAsyncData } = route.params;
  const [pageIndex, setPageIndex] = useState(0);

  const LOGO = require("../assets/onboarding/00_LOGO.png");
  const WELCOME = require("../assets/onboarding/01_WELCOME.mp4");
  const ALIGN = require("../assets/onboarding/02_ALIGN.mp4");
  const HINT = require("../assets/onboarding/03_HINT.mp4");
  const ASSESS = require("../assets/onboarding/04_ASSESS.mp4");
  const WIN = require("../assets/onboarding/05_WIN.mp4");

  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify(false);
      await AsyncStorage.setItem("newUser", jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  const VideoPlayer: React.FC<VideoPlayerProps> = ({ path, id }) => {
    const video = useRef(null);
    const [status, setStatus] = useState({});

    useEffect(() => {
      if (id == pageIndex) {
        StartVideo();
      } else {
        StopVideo();
      }
    }, [id]);

    const StartVideo = () => {
      if (video) {
        video.current.playAsync();
      }
    };

    const StopVideo = () => {
      if (video) {
        video.current.pauseAsync();
      }
    };

    return (
      <View style={styles.container}>
        <Video
          ref={video}
          style={styles.video}
          source={path}
          useNativeControls={false}
          isLooping
          resizeMode="cover"
          onPlaybackStatusUpdate={(status) => setStatus(status)}
        />
      </View>
    );
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
        pageIndexCallback={(index) => setPageIndex(index)}
        pages={[
          {
            backgroundColor: colors.secondary,
            image: <Image style={styles.container} source={LOGO} />,
            title: "Sign Tutor",
            subtitle:
              "Sign Tutor is a proof of concept. To see if AI can assist in non-verbal communication",
          },
          {
            backgroundColor: colors.secondary,
            image: <VideoPlayer path={WELCOME} id={1} key={1} />,
            title: "Learn how to sign",
            subtitle:
              "To learn the 5 currently available ASL letters go to the practice screen",
          },
          {
            backgroundColor: colors.secondary,
            image: <VideoPlayer path={ALIGN} id={2} key={2} />,
            title: "How to sign",
            subtitle:
              "Align your hand within the overlay and when you are ready submit your sign",
          },
          {
            backgroundColor: colors.secondary,
            image: <VideoPlayer path={HINT} id={3} key={3} />,
            title: "How to get help",
            subtitle:
              "If you are struggling with a sign. Click on the hint in the top right to see an example",
          },
          {
            backgroundColor: colors.secondary,
            image: <VideoPlayer path={ASSESS} id={4} key={4} />,
            title: "Assess your skills",
            subtitle:
              "See how well you can sign by signing a word without an overlay. Pick a harder difficuly for more letters",
          },
          {
            backgroundColor: colors.secondary,
            image: <VideoPlayer path={WIN} id={5} key={5} />,
            title: "Add your name to the leaderboard",
            subtitle:
              "Show off how well you can sign by adding your name to the global leaderboard!",
          },
        ]}
      />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: 300,
    width: 300,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
    marginTop: -200,
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
