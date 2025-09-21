// src/screens/PestDetectionScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";

const PestDetectionScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pestDatabase = [
    {
      name: "Aphid Infestation",
      treatment: "Apply neem oil spray every 3-4 days",
      severity: "Medium",
      color: "#FF9800",
    },
    {
      name: "Leaf Blight",
      treatment: "Use copper-based fungicide spray",
      severity: "High",
      color: "#F44336",
    },
    {
      name: "Healthy Plant",
      treatment: "Continue regular care routine",
      severity: "None",
      color: "#4CAF50",
    },
    {
      name: "Caterpillar Damage",
      treatment: "Manual removal or organic pesticide",
      severity: "Medium",
      color: "#FF9800",
    },
  ];

  const selectImageSource = () => {
    Alert.alert(
      "Select Image Source",
      "Choose how you want to capture the plant image",
      [
        {
          text: "📷 Camera",
          onPress: openCamera,
          style: "default",
        },
        {
          text: "🖼️ Gallery",
          onPress: openGallery,
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const imagePickerOptions = {
    mediaType: "photo",
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  };

  const openCamera = () => {
    launchCamera(imagePickerOptions, (response) => {
      handleImageResponse(response);
    });
  };

  const openGallery = () => {
    launchImageLibrary(imagePickerOptions, (response) => {
      handleImageResponse(response);
    });
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
      return;
    }

    if (response.errorMessage) {
      Alert.alert("Error", response.errorMessage);
      return;
    }

    if (response.assets && response.assets[0]) {
      const imageAsset = response.assets[0];
      setSelectedImage(imageAsset);
      analyzePlantImage();
    }
  };

  const analyzePlantImage = () => {
    setIsAnalyzing(true);
    setDetectionResult("");

    // Simulate AI analysis with random result
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * pestDatabase.length);
      const result = pestDatabase[randomIndex];
      setDetectionResult(result);
      setIsAnalyzing(false);
    }, 2500);
  };

  const retakePhoto = () => {
    setSelectedImage(null);
    setDetectionResult("");
    setIsAnalyzing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐛 Pest Detection</Text>
        <Text style={styles.subtitle}>AI-Powered Plant Health Analysis</Text>
      </View>

      <View style={styles.content}>
        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>📷</Text>
              <Text style={styles.placeholderText}>
                Take or upload a photo of your plant
              </Text>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={selectImageSource}
            >
              <Text style={styles.selectButtonText}>Select Plant Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.analysisSection}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={retakePhoto}
              >
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>

            {isAnalyzing && (
              <View style={styles.analyzingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.analyzingText}>
                  Analyzing plant health...
                </Text>
                <Text style={styles.analyzingSubtext}>
                  This may take a few seconds
                </Text>
              </View>
            )}

            {detectionResult && !isAnalyzing && (
              <View style={styles.resultContainer}>
                <View
                  style={[
                    styles.resultHeader,
                    { backgroundColor: detectionResult.color },
                  ]}
                >
                  <Text style={styles.resultTitle}>Analysis Complete</Text>
                </View>

                <View style={styles.resultContent}>
                  <Text style={styles.detectionTitle}>
                    Detected: {detectionResult.name}
                  </Text>

                  <View style={styles.severityContainer}>
                    <Text style={styles.severityLabel}>Severity Level:</Text>
                    <Text
                      style={[
                        styles.severityValue,
                        { color: detectionResult.color },
                      ]}
                    >
                      {detectionResult.severity}
                    </Text>
                  </View>

                  <View style={styles.treatmentContainer}>
                    <Text style={styles.treatmentLabel}>
                      🔧 Recommended Treatment:
                    </Text>
                    <Text style={styles.treatmentText}>
                      {detectionResult.treatment}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.newAnalysisButton}
                    onPress={retakePhoto}
                  >
                    <Text style={styles.newAnalysisText}>
                      Analyze Another Plant
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8e9",
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#c8e6c9",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    alignItems: "center",
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  selectButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
  },
  selectButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  analysisSection: {
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  selectedImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  retakeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  retakeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  analyzingContainer: {
    alignItems: "center",
    padding: 20,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 15,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  resultContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  resultHeader: {
    padding: 15,
    alignItems: "center",
  },
  resultTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContent: {
    padding: 20,
  },
  detectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
    textAlign: "center",
  },
  severityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  severityLabel: {
    fontSize: 16,
    color: "#666",
  },
  severityValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  treatmentContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  treatmentLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  treatmentText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  newAnalysisButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  newAnalysisText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PestDetectionScreen;
