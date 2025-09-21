// src/screens/CropAdvisoryScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";

const CropAdvisoryScreen = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedSoil, setSelectedSoil] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [budget, setBudget] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for crop advisory
  const crops = [
    { id: "1", name: "Wheat", icon: "🌾", season: "Rabi" },
    { id: "2", name: "Rice", icon: "🌾", season: "Kharif" },
    { id: "3", name: "Cotton", icon: "☁️", season: "Kharif" },
    { id: "4", name: "Sugarcane", icon: "🎋", season: "Both" },
    { id: "5", name: "Maize", icon: "🌽", season: "Both" },
    { id: "6", name: "Soybean", icon: "🫘", season: "Kharif" },
    { id: "7", name: "Mustard", icon: "🌻", season: "Rabi" },
    { id: "8", name: "Potato", icon: "🥔", season: "Rabi" },
  ];

  const soilTypes = [
    {
      id: "1",
      name: "Black Soil",
      icon: "⚫",
      description: "Rich in nutrients, good for cotton",
    },
    {
      id: "2",
      name: "Red Soil",
      icon: "🔴",
      description: "Good for rice, sugarcane",
    },
    {
      id: "3",
      name: "Alluvial Soil",
      icon: "🟤",
      description: "Best for wheat, rice",
    },
    {
      id: "4",
      name: "Sandy Soil",
      icon: "🟡",
      description: "Good drainage, suitable for groundnut",
    },
    {
      id: "5",
      name: "Clay Soil",
      icon: "🔵",
      description: "Water retention, good for rice",
    },
  ];

  const seasons = [
    { id: "1", name: "Kharif", icon: "🌧️", months: "June - October" },
    { id: "2", name: "Rabi", icon: "❄️", months: "November - April" },
    { id: "3", name: "Zaid", icon: "☀️", months: "April - June" },
  ];

  const advisoryDatabase = {
    "wheat-alluvial-rabi": {
      recommendation: "Excellent Choice!",
      description: "Wheat thrives in alluvial soil during Rabi season",
      steps: [
        "Prepare field in October-November",
        "Sow seeds in November-December",
        "Apply fertilizers: 120kg N, 60kg P, 40kg K per hectare",
        "Irrigate 4-6 times during growing period",
        "Harvest in March-April",
      ],
      expectedYield: "35-40 quintals per hectare",
      estimatedProfit: "₹25,000-30,000 per hectare",
      warnings: ["Monitor for rust disease", "Avoid late sowing"],
    },
    "rice-clay-kharif": {
      recommendation: "Perfect Match!",
      description: "Rice is ideal for clay soil in Kharif season",
      steps: [
        "Prepare nursery in May-June",
        "Transplant in June-July",
        "Apply fertilizers: 100kg N, 50kg P, 50kg K per hectare",
        "Maintain water level 2-5cm",
        "Harvest in October-November",
      ],
      expectedYield: "50-60 quintals per hectare",
      estimatedProfit: "₹35,000-45,000 per hectare",
      warnings: ["Watch for blast disease", "Control weeds early"],
    },
    // Default advisory for other combinations
    default: {
      recommendation: "Good Selection",
      description: "This combination can work with proper care",
      steps: [
        "Prepare soil according to crop requirements",
        "Choose appropriate variety for your region",
        "Follow recommended fertilizer schedule",
        "Monitor for pests and diseases",
        "Harvest at right time for maximum yield",
      ],
      expectedYield: "Varies by management",
      estimatedProfit: "Depends on market prices",
      warnings: ["Consult local experts", "Monitor weather conditions"],
    },
  };

  const generateAdvisory = () => {
    if (!selectedCrop || !selectedSoil || !selectedSeason) {
      Alert.alert(
        "Incomplete Information",
        "Please select crop, soil type, and season"
      );
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const key = `${selectedCrop.name.toLowerCase()}-${selectedSoil.name
        .toLowerCase()
        .replace(" ", "")}-${selectedSeason.name.toLowerCase()}`;
      const advisoryData = advisoryDatabase[key] || advisoryDatabase["default"];

      setAdvisory({
        ...advisoryData,
        crop: selectedCrop,
        soil: selectedSoil,
        season: selectedSeason,
        budget: budget,
      });
      setLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setSelectedCrop(null);
    setSelectedSoil(null);
    setSelectedSeason(null);
    setBudget("");
    setAdvisory(null);
  };

  const renderCropItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedCrop(item);
        setShowCropModal(false);
      }}
    >
      <Text style={styles.modalItemIcon}>{item.icon}</Text>
      <View style={styles.modalItemText}>
        <Text style={styles.modalItemName}>{item.name}</Text>
        <Text style={styles.modalItemDescription}>Season: {item.season}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSoilItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedSoil(item);
        setShowSoilModal(false);
      }}
    >
      <Text style={styles.modalItemIcon}>{item.icon}</Text>
      <View style={styles.modalItemText}>
        <Text style={styles.modalItemName}>{item.name}</Text>
        <Text style={styles.modalItemDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSeasonItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedSeason(item);
        setShowSeasonModal(false);
      }}
    >
      <Text style={styles.modalItemIcon}>{item.icon}</Text>
      <View style={styles.modalItemText}>
        <Text style={styles.modalItemName}>{item.name}</Text>
        <Text style={styles.modalItemDescription}>{item.months}</Text>
      </View>
    </TouchableOpacity>
  );

  if (advisory) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🌾 Crop Advisory</Text>
          <Text style={styles.subtitle}>
            Personalized Farming Recommendations
          </Text>
        </View>

        <View style={styles.advisoryContainer}>
          {/* Selection Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Selection</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Crop:</Text>
              <Text style={styles.summaryValue}>
                {advisory.crop.icon} {advisory.crop.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Soil:</Text>
              <Text style={styles.summaryValue}>
                {advisory.soil.icon} {advisory.soil.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Season:</Text>
              <Text style={styles.summaryValue}>
                {advisory.season.icon} {advisory.season.name}
              </Text>
            </View>
            {budget && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Budget:</Text>
                <Text style={styles.summaryValue}>₹{budget}</Text>
              </View>
            )}
          </View>

          {/* Recommendation */}
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>
              ✅ {advisory.recommendation}
            </Text>
            <Text style={styles.recommendationDescription}>
              {advisory.description}
            </Text>
          </View>

          {/* Steps */}
          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>📋 Step-by-Step Guide</Text>
            {advisory.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Yield & Profit */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>📊</Text>
              <Text style={styles.metricLabel}>Expected Yield</Text>
              <Text style={styles.metricValue}>{advisory.expectedYield}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>💰</Text>
              <Text style={styles.metricLabel}>Estimated Profit</Text>
              <Text style={styles.metricValue}>{advisory.estimatedProfit}</Text>
            </View>
          </View>

          {/* Warnings */}
          {advisory.warnings.length > 0 && (
            <View style={styles.warningsCard}>
              <Text style={styles.warningsTitle}>⚠️ Important Warnings</Text>
              {advisory.warnings.map((warning, index) => (
                <Text key={index} style={styles.warningText}>
                  • {warning}
                </Text>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.newAdvisoryButton}
              onPress={resetForm}
            >
              <Text style={styles.newAdvisoryText}>Get New Advisory</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌾 Crop Advisory</Text>
        <Text style={styles.subtitle}>Get Expert Farming Recommendations</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Crop Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Crop *</Text>
          <TouchableOpacity
            style={[styles.selector, selectedCrop && styles.selectorSelected]}
            onPress={() => setShowCropModal(true)}
          >
            <Text
              style={[
                styles.selectorText,
                selectedCrop && styles.selectorTextSelected,
              ]}
            >
              {selectedCrop
                ? `${selectedCrop.icon} ${selectedCrop.name}`
                : "Choose your crop"}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Soil Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Soil Type *</Text>
          <TouchableOpacity
            style={[styles.selector, selectedSoil && styles.selectorSelected]}
            onPress={() => setShowSoilModal(true)}
          >
            <Text
              style={[
                styles.selectorText,
                selectedSoil && styles.selectorTextSelected,
              ]}
            >
              {selectedSoil
                ? `${selectedSoil.icon} ${selectedSoil.name}`
                : "Choose soil type"}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Season Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Season *</Text>
          <TouchableOpacity
            style={[styles.selector, selectedSeason && styles.selectorSelected]}
            onPress={() => setShowSeasonModal(true)}
          >
            <Text
              style={[
                styles.selectorText,
                selectedSeason && styles.selectorTextSelected,
              ]}
            >
              {selectedSeason
                ? `${selectedSeason.icon} ${selectedSeason.name}`
                : "Choose season"}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Budget Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Budget (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={budget}
            onChangeText={setBudget}
            placeholder="Enter budget in rupees"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Generate Advisory Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            loading && styles.generateButtonDisabled,
          ]}
          onPress={generateAdvisory}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.generateButtonText}>Get Crop Advisory</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Crop Modal */}
      <Modal visible={showCropModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Crop</Text>
              <TouchableOpacity onPress={() => setShowCropModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={crops}
              renderItem={renderCropItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Soil Modal */}
      <Modal visible={showSoilModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Soil Type</Text>
              <TouchableOpacity onPress={() => setShowSoilModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={soilTypes}
              renderItem={renderSoilItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Season Modal */}
      <Modal visible={showSeasonModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Season</Text>
              <TouchableOpacity onPress={() => setShowSeasonModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={seasons}
              renderItem={renderSeasonItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f8e9" },
  header: { backgroundColor: "#4CAF50", padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#c8e6c9" },
  formContainer: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  selector: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    elevation: 2,
  },
  selectorSelected: { borderColor: "#4CAF50" },
  selectorText: { fontSize: 16, color: "#999", flex: 1 },
  selectorTextSelected: { color: "#2E7D32", fontWeight: "600" },
  selectorArrow: { fontSize: 16, color: "#666" },
  textInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    elevation: 2,
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    padding: 18,
    alignItems: "center",
    elevation: 3,
    marginTop: 10,
  },
  generateButtonDisabled: { backgroundColor: "#ccc" },
  generateButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#2E7D32" },
  modalClose: { fontSize: 24, color: "#666" },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 10,
  },
  modalItemIcon: { fontSize: 24, marginRight: 15 },
  modalItemText: { flex: 1 },
  modalItemName: { fontSize: 16, fontWeight: "bold", color: "#2E7D32" },
  modalItemDescription: { fontSize: 14, color: "#666", marginTop: 2 },

  // Advisory Result Styles
  advisoryContainer: { padding: 20 },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 16, color: "#666" },
  summaryValue: { fontSize: 16, fontWeight: "600", color: "#2E7D32" },

  recommendationCard: {
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  recommendationDescription: { fontSize: 16, color: "#558B2F", lineHeight: 22 },

  stepsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    backgroundColor: "#4CAF50",
    color: "white",
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: { fontSize: 15, color: "#666", flex: 1, lineHeight: 22 },

  metricsContainer: { flexDirection: "row", marginBottom: 20 },
  metricCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    elevation: 3,
    marginHorizontal: 5,
  },
  metricIcon: { fontSize: 32, marginBottom: 8 },
  metricLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },

  warningsCard: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#FFC107",
  },
  warningsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    marginBottom: 5,
    lineHeight: 20,
  },

  actionButtons: { alignItems: "center" },
  newAdvisoryButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
    elevation: 3,
  },
  newAdvisoryText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default CropAdvisoryScreen;
