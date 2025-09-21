// src/screens/CommunityScreen.js
import React, { useState, useEffect } from "react";
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
  RefreshControl,
} from "react-native";
import { LocationService } from "../utils/LocationService";

const CommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [userLocation, setUserLocation] = useState("Location Loading...");
  const [refreshing, setRefreshing] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [newComment, setNewComment] = useState("");

  const categories = [
    { id: "general", name: "General", icon: "💬", color: "#4CAF50" },
    { id: "crops", name: "Crop Issues", icon: "🌾", color: "#FF9800" },
    { id: "pests", name: "Pest Control", icon: "🐛", color: "#F44336" },
    { id: "weather", name: "Weather", icon: "🌤️", color: "#2196F3" },
    { id: "market", name: "Market Prices", icon: "💰", color: "#9C27B0" },
    { id: "equipment", name: "Equipment", icon: "🚜", color: "#795548" },
  ];

  // Mock community posts data
  const mockPosts = [
    {
      id: "1",
      title: "Best time to plant wheat in North India?",
      content:
        "I'm planning to plant wheat this season. What's the optimal time for sowing in Punjab region?",
      author: "Rajesh Kumar",
      location: "Punjab, India",
      category: "crops",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      comments: [
        {
          id: "1",
          author: "Suresh Patel",
          content:
            "November 15 to December 15 is ideal for Punjab. Make sure soil temperature is below 25°C.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 5,
        },
        {
          id: "2",
          author: "Priya Singh",
          content:
            "I planted on November 20 last year and got excellent yield. Follow meteorological department advice.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          likes: 3,
        },
      ],
      solved: false,
    },
    {
      id: "2",
      title: "Aphid attack on mustard crop - need urgent help!",
      content:
        "My mustard crop is heavily infested with aphids. Tried neem oil but not effective. Any other organic solutions?",
      author: "Amit Sharma",
      location: "Rajasthan, India",
      category: "pests",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 8,
      comments: [
        {
          id: "3",
          author: "Dr. Ravi Agrawal",
          content:
            "Try soap water spray (1 tsp dish soap in 1 liter water) early morning. Repeat every 3 days.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 15,
          isBestAnswer: true,
        },
      ],
      solved: true,
    },
    {
      id: "3",
      title: "Cotton prices dropping - what to do?",
      content:
        "Cotton prices have dropped by 20% in last month. Should I hold my stock or sell now?",
      author: "Vikram Jadav",
      location: "Gujarat, India",
      category: "market",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 25,
      comments: [],
      solved: false,
    },
  ];

  useEffect(() => {
    loadCommunityData();
    getUserLocation();
  }, []);

  const loadCommunityData = () => {
    // Simulate loading community posts
    setTimeout(() => {
      setPosts(mockPosts);
    }, 1000);
  };

  const getUserLocation = async () => {
    const location = await LocationService.getCurrentLocation();
    if (location && location.address) {
      setUserLocation(location.address);
    } else {
      setUserLocation("Location not available");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadCommunityData();
    getUserLocation();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const createPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert(
        "Missing Information",
        "Please provide both title and content for your post."
      );
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      author: "You",
      location: userLocation,
      category: selectedCategory.toLowerCase(),
      timestamp: new Date(),
      likes: 0,
      comments: [],
      solved: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostTitle("");
    setNewPostContent("");
    setShowCreatePost(false);
    Alert.alert("Success", "Your post has been shared with the community!");
  };

  const likePost = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = (postId) => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: "You",
      content: newComment,
      timestamp: new Date(),
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );

    setNewComment("");
    Alert.alert("Success", "Your comment has been added!");
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0];
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const renderPost = ({ item }) => {
    const category = getCategoryInfo(item.category);

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.postMeta}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: category.color },
              ]}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
            {item.solved && <Text style={styles.solvedBadge}>✅ Solved</Text>}
          </View>
          <Text style={styles.postTime}>{formatTime(item.timestamp)}</Text>
        </View>

        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.content}</Text>

        <View style={styles.postAuthor}>
          <Text style={styles.authorName}>👨‍🌾 {item.author}</Text>
          <Text style={styles.authorLocation}>📍 {item.location}</Text>
        </View>

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => likePost(item.id)}
          >
            <Text style={styles.actionText}>👍 {item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              setShowComments(showComments === item.id ? null : item.id)
            }
          >
            <Text style={styles.actionText}>💬 {item.comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>🔄 Share</Text>
          </TouchableOpacity>
        </View>

        {showComments === item.id && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Comments ({item.comments.length})
            </Text>

            {item.comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                {comment.isBestAnswer && (
                  <Text style={styles.bestAnswerBadge}>⭐ Best Answer</Text>
                )}
                <Text style={styles.commentAuthor}>👤 {comment.author}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
                <View style={styles.commentActions}>
                  <Text style={styles.commentTime}>
                    {formatTime(comment.timestamp)}
                  </Text>
                  <Text style={styles.commentLikes}>👍 {comment.likes}</Text>
                </View>
              </View>
            ))}

            <View style={styles.addCommentSection}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Share your knowledge..."
                multiline
              />
              <TouchableOpacity
                style={styles.commentSubmit}
                onPress={() => addComment(item.id)}
              >
                <Text style={styles.commentSubmitText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤝 Community Forum</Text>
        <Text style={styles.subtitle}>
          Share knowledge, solve problems together
        </Text>
        <Text style={styles.locationText}>📍 {userLocation}</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreatePost(true)}
      >
        <Text style={styles.createButtonText}>✏️ Ask Question</Text>
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.fieldLabel}>Category *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categorySelector,
                    selectedCategory === category.name &&
                      styles.categorySelected,
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Text style={styles.categorySelectorIcon}>
                    {category.icon}
                  </Text>
                  <Text style={styles.categorySelectorText}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Title *</Text>
            <TextInput
              style={styles.titleInput}
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              placeholder="What's your farming question or issue?"
              placeholderTextColor="#999"
            />

            <Text style={styles.fieldLabel}>Description *</Text>
            <TextInput
              style={styles.contentInput}
              value={newPostContent}
              onChangeText={setNewPostContent}
              placeholder="Provide details about your question or problem..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
            />

            <Text style={styles.locationInfo}>
              📍 Your post will be tagged with: {userLocation}
            </Text>

            <TouchableOpacity style={styles.submitButton} onPress={createPost}>
              <Text style={styles.submitButtonText}>Share with Community</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f8e9" },
  header: { backgroundColor: "#4CAF50", padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#c8e6c9", marginBottom: 8 },
  locationText: { fontSize: 14, color: "#c8e6c9", fontStyle: "italic" },

  listContainer: { padding: 15, paddingBottom: 80 },
  postCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  postMeta: { flexDirection: "row", alignItems: "center" },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryIcon: { fontSize: 12, marginRight: 4 },
  categoryText: { fontSize: 12, color: "white", fontWeight: "bold" },
  solvedBadge: { fontSize: 12, color: "#4CAF50", fontWeight: "bold" },
  postTime: { fontSize: 12, color: "#666" },

  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },

  postAuthor: { marginBottom: 12 },
  authorName: { fontSize: 14, fontWeight: "600", color: "#2E7D32" },
  authorLocation: { fontSize: 12, color: "#666", marginTop: 2 },

  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  actionButton: { flex: 1, alignItems: "center" },
  actionText: { fontSize: 14, color: "#666" },

  // Comments Section
  commentsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  commentCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  bestAnswerBadge: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    marginBottom: 6,
  },
  commentActions: { flexDirection: "row", justifyContent: "space-between" },
  commentTime: { fontSize: 12, color: "#999" },
  commentLikes: { fontSize: 12, color: "#666" },

  addCommentSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    maxHeight: 80,
    fontSize: 14,
  },
  commentSubmit: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  commentSubmitText: { color: "white", fontSize: 14, fontWeight: "bold" },

  // Create Button
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: "white" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#4CAF50",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  modalClose: { fontSize: 24, color: "white" },
  modalContent: { flex: 1, padding: 20 },

  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
    marginTop: 15,
  },
  categoryScroll: { marginBottom: 10 },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categorySelected: { backgroundColor: "#4CAF50" },
  categorySelectorIcon: { fontSize: 16, marginRight: 6 },
  categorySelectorText: { fontSize: 14, color: "#666" },

  titleInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
    textAlignVertical: "top",
    minHeight: 120,
  },
  locationInfo: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default CommunityScreen;
