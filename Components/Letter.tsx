import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";

interface LetterProps {
  letter: string;
  selectedLetter: number;
  id: number;
  setSelectedLetter?: (id: number) => void;
  solvedLetters: boolean[];
}

const Letter: React.FC<LetterProps> = ({
  selectedLetter,
  id,
  setSelectedLetter,
  solvedLetters,
  letter,
}) => {
  return (
    <TouchableOpacity
      disabled={!setSelectedLetter}
      onPress={() => {
        setSelectedLetter(id);
      }}
    >
      <View
        style={{
          padding: 5,
          borderRadius: 5,
          borderWidth: 2,
          borderColor:
            selectedLetter == id
              ? "white"
              : solvedLetters[id]
              ? "green"
              : "gray",
          margin: 2,
          width: (Dimensions.get("window").width - 80) / solvedLetters.length,
          justifyContent: "center",
          minHeight: 55,
        }}
      >
        {solvedLetters[id] && (
          <Ionicons
            name="checkmark-circle-sharp"
            size={16}
            color="green"
            style={{ position: "absolute", right: 0, zIndex: 2, top: 0 }}
          />
        )}
        <Text
          key={letter}
          style={[
            styles.baseLetter,
            { fontSize: solvedLetters.length > 6 ? 15 : 40 },
          ]}
        >
          {letter}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Letter;

const styles = StyleSheet.create({
  baseLetter: {
    color: "white",
    alignSelf: "center",
  },
});
