import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
        navigation.navigate("MainDrawer", { screen: "HomeScreen" });
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
      className='flex-1 justify-center items-center bg-gray-100 p-4'
    >
      <Image
        source={{ uri: "https://via.placeholder.com/150" }} // Replace with your image URL
        className='w-36 h-36 rounded-full mb-5'
      />
      <View className='w-full bg-white rounded-lg p-5 shadow-md'>
        <View className='flex-row justify-between mb-5'>
          <TouchableOpacity onPress={() => setIsSignUp(false)}>
            <Text
              className={`text-lg ${
                !isSignUp ? "font-bold text-yellow-500" : "text-gray-500"
              }`}
            >
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignUp(true)}>
            <Text
              className={`text-lg ${
                isSignUp ? "font-bold text-yellow-500" : "text-gray-500"
              }`}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
        {isSignUp && (
          <TextInput
            placeholder='Name'
            className='border-b border-gray-300 mb-4 p-2 text-lg'
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          placeholder='Email'
          className='border-b border-gray-300 mb-4 p-2 text-lg'
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder='Password'
          secureTextEntry
          className='border-b border-gray-300 mb-4 p-2 text-lg'
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={handleAuth}
          className='bg-yellow-500 py-3 rounded-full items-center'
        >
          <Text className='text-white text-lg font-bold'>
            {isSignUp ? "Sign up" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
