// src/screens/MarketScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";

const MarketScreen = () => {
  const [prices, setPrices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = () => {
    // Mock market data - replace with real API
    const mockData = [
      {
        id: "1",
        crop: "Wheat",
        price: "₹2,500/quintal",
        trend: "📈",
        changePercent: "+2.5%",
      },
      {
        id: "2",
        crop: "Rice",
        price: "₹3,200/quintal",
        trend: "📉",
        changePercent: "-1.2%",
      },
      {
        id: "3",
        crop: "Sugarcane",
        price: "₹350/quintal",
        trend: "📈",
        changePercent: "+0.8%",
      },
      {
        id: "4",
        crop: "Cotton",
        price: "₹6,800/quintal",
        trend: "📈",
        changePercent: "+3.1%",
      },
    ];
    setPrices(mockData);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadMarketData();
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.priceCard}>
      <View style={styles.leftSection}>
        <Text style={styles.cropName}>{item.crop}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.trend}>{item.trend}</Text>
        {item.changePercent && (
          <Text
            style={[
              styles.changePercent,
              { color: item.trend === "📈" ? "#4CAF50" : "#F44336" },
            ]}
          >
            {item.changePercent}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌾 Savior Market</Text>
        <Text style={styles.subtitle}>Today's Crop Prices</Text>
      </View>

      <FlatList
        data={prices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  listContainer: {
    padding: 16,
  },
  priceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  cropName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  trend: {
    fontSize: 24,
    marginBottom: 4,
  },
  changePercent: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default MarketScreen;
