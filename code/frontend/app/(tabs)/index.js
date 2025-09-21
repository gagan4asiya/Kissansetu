// app/(tabs)/index.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // AI Response Database
  const aiResponses = {
    "pest control":
      "For natural pest control, I recommend:\n\n🌿 Neem oil spray (10ml per liter water)\n🐞 Introduce beneficial insects like ladybugs\n⏰ Apply early morning or evening\n🚫 Avoid spraying during flowering to protect pollinators",

    fertilizer:
      "For healthy crop growth:\n\n🌱 Organic: Use compost (2-3 tons/hectare)\n🪱 Vermicompost (1 ton/hectare)\n🌾 Green manure crops\n⚗️ Chemical: Follow soil test - typically 120:60:40 NPK for wheat",

    irrigation:
      "Water management tips:\n\n🌾 Rice: Maintain 2-5cm standing water\n🌾 Wheat: 4-6 irrigations during season\n💧 Drip irrigation saves 30-50% water\n⏰ Water early morning or evening",

    disease:
      "Disease management:\n\n🔍 Weekly plant inspection\n🛡️ Use resistant varieties\n🔄 Practice crop rotation\n🧪 Copper-based fungicides for fungal diseases\n📞 Contact agricultural officer for severe cases",

    weather:
      "Weather-based farming:\n\n📱 Check forecasts daily\n☔ Avoid spraying before rains\n🧊 Use nets to protect from hail\n🌡️ Adjust irrigation based on rainfall",

    "market price":
      "Market guidance:\n\n📊 Check eNAM portal daily\n💰 Sell during peak demand\n📈 Consider value addition\n🏪 Connect with local mandis\n📱 Use market price apps",

    "soil health":
      "Soil health tips:\n\n🧪 Test soil pH (ideal: 6.5-7.5)\n🌱 Maintain organic matter >1.5%\n🧊 Add lime for acidic soils\n⚪ Use gypsum for alkaline soils\n📅 Test annually",

    "crop rotation":
      "Rotation benefits:\n\n1️⃣ Legumes (nitrogen fixation)\n2️⃣ Cereals (main crop)\n3️⃣ Cash crops (income)\n4️⃣ Fodder crops (livestock)\n\nThis improves soil fertility and breaks pest cycles.",
  };

  const quickQuestions = [
    "🌱 Best crops for this season?",
    "🐛 How to control pests naturally?",
    "💧 When should I irrigate?",
    "🌡️ Weather impact on crops?",
    "💰 Current market prices?",
    "🌾 Soil health improvement?",
  ];

  React.useEffect(() => {
    if (showAIAssistant && messages.length === 0) {
      setMessages([
        {
          id: "1",
          text: "🌾 Welcome to Savior AI Assistant! 🤖\n\nI can help you with:\n• Crop selection & planning\n• Pest & disease management\n• Irrigation scheduling\n• Weather guidance\n• Market price updates\n• Soil health tips\n• Fertilizer recommendations\n\nWhat farming question do you have today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [showAIAssistant]);

  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    // Check for specific keywords
    for (const [keyword, response] of Object.entries(aiResponses)) {
      if (
        lowerQuery.includes(keyword) ||
        lowerQuery.includes(keyword.replace(" ", ""))
      ) {
        return response;
      }
    }

    // General farming responses
    if (lowerQuery.includes("crop") || lowerQuery.includes("plant")) {
      return "🌱 For crop selection, consider:\n\n• Local climate conditions\n• Soil type and pH\n• Market demand\n• Water availability\n• Your experience level\n\nWhich specific crop are you interested in?";
    }

    if (lowerQuery.includes("help") || lowerQuery.includes("assist")) {
      return "🤝 I'm here to help! I can assist with:\n\n• Farming techniques\n• Problem diagnosis\n• Best practices\n• Seasonal advice\n• Resource management\n\nPlease describe your specific farming challenge.";
    }

    if (lowerQuery.includes("profit") || lowerQuery.includes("income")) {
      return "💰 To increase farm profits:\n\n• Choose high-value crops\n• Reduce input costs\n• Improve yield quality\n• Direct marketing\n• Value addition\n• Crop insurance\n\nWhat's your current farming situation?";
    }

    // Default response
    return `🤔 I understand you're asking about "${query}". \n\nCould you be more specific? I can help with:\n\n🌾 Crop management\n🐛 Pest control\n💧 Irrigation\n🌡️ Weather planning\n💰 Market guidance\n🌱 Soil health\n\nOr tap one of the quick questions below!`;
  };

  const handleAIQuery = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setAiLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateAIResponse(message);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setAiLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    handleAIQuery(question);
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Mock voice input - in real app, integrate with speech-to-text
    setTimeout(() => {
      setIsListening(false);
      Alert.alert(
        "Voice Input",
        "Voice feature coming soon! For now, please type your question."
      );
    }, 2000);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {item.sender === "ai" && <Text style={styles.aiIcon}>🤖</Text>}
      <Text
        style={[
          styles.messageText,
          item.sender === "user"
            ? styles.userMessageText
            : styles.aiMessageText,
        ]}
      >
        {item.text}
      </Text>
      {item.sender === "user" && <Text style={styles.userIcon}>👨‍🌾</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌾 Savior</Text>
        <Text style={styles.subtitle}>Your Farming Companion</Text>
      </View>

      <View style={styles.featuresGrid}>
        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => router.push("/(tabs)/weather")}
        >
          <Text style={styles.featureIcon}>🌤️</Text>
          <Text style={styles.featureText}>Weather</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => router.push("/(tabs)/market")}
        >
          <Text style={styles.featureIcon}>💰</Text>
          <Text style={styles.featureText}>Market</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => router.push("/(tabs)/pest")}
        >
          <Text style={styles.featureIcon}>🐛</Text>
          <Text style={styles.featureText}>Pest Detection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => router.push("/(tabs)/advisory")}
        >
          <Text style={styles.featureIcon}>🌾</Text>
          <Text style={styles.featureText}>Crop Advisory</Text>
        </TouchableOpacity>
      </View>

      {/* AI Assistant Button */}
      <TouchableOpacity
        style={styles.aiAssistantButton}
        onPress={() => setShowAIAssistant(true)}
      >
        <Text style={styles.aiAssistantIcon}>🤖</Text>
        <Text style={styles.aiAssistantText}>Ask AI Assistant</Text>
        <Text style={styles.aiAssistantSubtext}>
          Get instant farming advice
        </Text>
      </TouchableOpacity>

      {/* AI Assistant Modal */}
      <Modal
        visible={showAIAssistant}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.aiModalContainer}>
          {/* AI Modal Header */}
          <View style={styles.aiModalHeader}>
            <View style={styles.aiHeaderLeft}>
              <Text style={styles.aiModalTitle}>🤖 Savior AI Assistant</Text>
              <Text style={styles.aiModalSubtitle}>
                Your Smart Farming Advisor
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAIAssistant(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Questions */}
          <View style={styles.quickQuestionsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question)}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* AI Loading */}
          {aiLoading && (
            <View style={styles.aiLoadingContainer}>
              <ActivityIndicator color="#4CAF50" />
              <Text style={styles.aiLoadingText}>AI is thinking... 🤔</Text>
            </View>
          )}

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Ask anything about farming..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={startVoiceInput}
            >
              <Text style={styles.voiceButtonText}>
                {isListening ? "🔴" : "🎤"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleAIQuery(inputMessage)}
              disabled={!inputMessage.trim()}
            >
              <Text style={styles.sendButtonText}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f8e9" },
  header: { backgroundColor: "#4CAF50", padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "white" },
  subtitle: { fontSize: 16, color: "#c8e6c9", marginTop: 5 },
  featuresGrid: { flexDirection: "row", flexWrap: "wrap", padding: 20 },
  featureButton: {
    width: "45%",
    height: 120,
    backgroundColor: "white",
    margin: "2.5%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  featureIcon: { fontSize: 40, marginBottom: 8 },
  featureText: { fontSize: 16, fontWeight: "bold", color: "#2E7D32" },

  // AI Assistant Button
  aiAssistantButton: {
    backgroundColor: "linear-gradient(45deg, #4CAF50, #8BC34A)",
    backgroundColor: "#4CAF50",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  aiAssistantIcon: { fontSize: 32, marginBottom: 8 },
  aiAssistantText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  aiAssistantSubtext: {
    color: "#c8e6c9",
    fontSize: 14,
  },

  // AI Modal Styles
  aiModalContainer: { flex: 1, backgroundColor: "#f1f8e9" },
  aiModalHeader: {
    backgroundColor: "#4CAF50",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
  },
  aiHeaderLeft: { flex: 1 },
  aiModalTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  aiModalSubtitle: { fontSize: 14, color: "#c8e6c9", marginTop: 2 },
  closeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: { fontSize: 18, color: "white", fontWeight: "bold" },

  // Quick Questions
  quickQuestionsContainer: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  quickQuestionButton: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  quickQuestionText: { fontSize: 12, color: "#2E7D32", fontWeight: "500" },

  // Messages
  messagesContainer: { flex: 1, paddingHorizontal: 15, paddingVertical: 10 },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8,
    maxWidth: "85%",
  },
  userMessage: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  aiMessage: { alignSelf: "flex-start" },
  messageText: {
    padding: 12,
    borderRadius: 15,
    fontSize: 15,
    lineHeight: 20,
    flex: 1,
  },
  userMessageText: {
    backgroundColor: "#4CAF50",
    color: "white",
    marginRight: 8,
  },
  aiMessageText: {
    backgroundColor: "white",
    color: "#333",
    marginLeft: 8,
    elevation: 1,
  },
  aiIcon: { fontSize: 24, marginTop: 8 },
  userIcon: { fontSize: 24, marginTop: 8 },

  // AI Loading
  aiLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  aiLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  voiceButton: {
    backgroundColor: "#FF5722",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  voiceButtonText: { fontSize: 16 },
  sendButton: {
    backgroundColor: "#4CAF50",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: { fontSize: 16 },
});
