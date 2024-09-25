import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser, loginUser } from "../helpers/api";

const AuthScreen = () => {
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    try {
      let response;
      if (isSignUp) {
        response = await registerUser(name, email, password);
      } else {
        response = await loginUser(email, password);
      }

      if (response.status === "ok") {
        Alert.alert(
          "Success",
          isSignUp ? "Account Created Successfully" : "Logged in successfully"
        );
        navigation.navigate("MainDrawer", { screen: "HomeScreen" }); // Change to "Drawer" and screen: "Home" for DrawerNavigator
      } else {
        Alert.alert("Error", response.data || "An unknown error occurred");
      }
    } catch (error) {
      console.error("API call failed:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
      <Image
        source={{ uri: "https://via.placeholder.com/150" }} // Replace with your image URL
        style={styles.image}
      />
      <View style={styles.formContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setIsSignUp(false)}>
            <Text style={!isSignUp ? styles.activeTab : styles.inactiveTab}>
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignUp(true)}>
            <Text style={isSignUp ? styles.activeTab : styles.inactiveTab}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
        {isSignUp && (
          <TextInput
            placeholder='Name'
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          placeholder='Email'
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder='Password'
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={handleAuth}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isSignUp ? "Sign up" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  activeTab: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFC107",
  },
  inactiveTab: {
    fontSize: 18,
    color: "#999",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: "#FFC107",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AuthScreen;
