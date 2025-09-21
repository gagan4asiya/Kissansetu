// src/components/VoiceSupport.js
import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Voice from "@react-native-voice/voice";
import Tts from "react-native-tts";

const VoiceSupport = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  React.useEffect(() => {
    Voice.onSpeechResults = (e) => {
      setTranscript(e.value[0]);
      speakResponse(e.value[0]);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await Voice.start("en-US");
    } catch (error) {
      console.error("Voice recording error:", error);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await Voice.stop();
    } catch (error) {
      console.error("Voice stop error:", error);
    }
  };

  const speakResponse = (text) => {
    const response = `You asked about ${text}. Here's farming advice...`;
    Tts.speak(response);
  };

  return (
    <TouchableOpacity
      style={[styles.voiceButton, isRecording && styles.recording]}
      onPress={isRecording ? stopRecording : startRecording}
    >
      <Text style={styles.voiceText}>
        {isRecording ? "🔴 Stop" : "🎤 Voice Query"}
      </Text>
    </TouchableOpacity>
  );
};
