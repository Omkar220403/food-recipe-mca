import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  const navigation = useNavigation();

  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;
    setTimeout(
      () => (ring1padding.value = withSpring(ring1padding.value + hp(5))),
      100
    );
    setTimeout(
      () => (ring2padding.value = withSpring(ring2padding.value + hp(5.5))),
      300
    );
    //setTimeout(() => navigation.navigate('Login'),2500);
  }, []);

  return (
    <View className='flex-1 justify-start items-center space-y-10 bg-amber-500 pt-20'>
      <StatusBar style='light' />
      {/* title and punchline*/}
      <View className='mt-10 mb-4 items-center'>
        <Text className='text-4xl font-bold text-white'>
          Welcome to Cooking App
        </Text>
        <Text className='text-lg font-bold text-white'>
          Start exploring delicious recipes
        </Text>
      </View>

      {/* logo image with rings */}
      <Animated.View
        className='bg-white/20 rounded-full'
        style={{ padding: ring2padding }}
      >
        <Animated.View
          className='bg-white/20 rounded-full'
          style={{ padding: ring1padding }}
        >
          <Image
            source={require("../../assets/images/welcome.png")}
            style={{ width: hp(20), height: hp(20) }}
          />
        </Animated.View>
      </Animated.View>

      <View className='space-y-4'>
        <TouchableOpacity
          onPress={() => navigation.navigate("AuthScreen")}
          className='py-3 bg-amber-100 px-32 rounded-xl mt-20'
        >
          <Text className='text-xl font-bold text-center text-gray-700'>
            Sign Up
          </Text>
        </TouchableOpacity>
        <View className='flex-row justify-center'>
          <Text className='text-white font-semibold'>
            Alreadry have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("AuthScreen")}>
            <Text className='font-semibold text-amber-100'>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
