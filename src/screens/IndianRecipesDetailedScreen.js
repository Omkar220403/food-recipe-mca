import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CachedImage } from "../helpers/image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loading from "../components/loading";
import {
  ChevronLeftIcon,
  ClockIcon,
  FireIcon,
} from "react-native-heroicons/outline";
import {
  HeartIcon,
  Square3Stack3DIcon,
  UsersIcon,
} from "react-native-heroicons/solid";
import YouTubeIframe from "react-native-youtube-iframe";
import indianRecipes from "../constants/indianRecipes.json";

export default function IndianRecipeDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [isFavourite, setIsFavourite] = useState(false);
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedMeal = indianRecipes.recipes.find(recipe => recipe.id === id);
    setMeal(selectedMeal || {});
    setLoading(false);
  }, [id]);

  const getYoutubeVideoId = url => {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <Loading
        size='large'
        className='mt-16'
      />
    );
  }

  const {
    strMeal,
    strMealThumb,
    cuisine,
    ingredients = [],
    instructions = [],
    strYoutube,
  } = meal;

  return (
    <ScrollView
      className='bg-white flex-1'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar style={"light"} />

      <View className='flex-row justify-center'>
        <CachedImage
          uri={strMealThumb}
          style={{
            width: wp(100),
            height: hp(50),
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        />
      </View>

      <View className='w-full absolute flex-row justify-between items-center pt-14'>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className='p-2 rounded-full ml-5 bg-white'
        >
          <ChevronLeftIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color='#fbbf24'
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsFavourite(!isFavourite)}
          className='p-2 rounded-full mr-5 bg-white'
        >
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color={isFavourite ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>

      <View className='px-4 flex justify-between space-y-4 pt-8'>
        <Text
          style={{ fontSize: hp(3) }}
          className='font-bold flex-1 text-neutral-700'
        >
          {strMeal}
        </Text>
        <Text
          style={{ fontSize: hp(2) }}
          className='font-medium flex-1 text-neutral-500'
        >
          {cuisine}
        </Text>

        {/* Recipe Stats */}
        <View className='flex-row justify-around'>
          {/* Repeat for other stats as needed */}
        </View>

        {/* Ingredients */}
        <View className='space-y-4'>
          <Text
            style={{ fontSize: hp(2.5) }}
            className='font-bold flex-1 text-neutral-700'
          >
            Ingredients
          </Text>
          {ingredients.map((item, index) => (
            <View
              key={index}
              className='flex-row space-x-4'
            >
              <View
                style={{ height: hp(1.5), width: hp(1.5) }}
                className='bg-amber-300 rounded-full'
              />
              <Text
                style={{ fontSize: hp(1.7) }}
                className='font-medium text-neutral-600'
              >
                {item.quantity} {item.ingredient}
              </Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className='space-y-4'>
          <Text
            style={{ fontSize: hp(2.5) }}
            className='font-bold flex-1 text-neutral-700'
          >
            Instructions
          </Text>
          {instructions.map((step, index) => (
            <Text
              key={index}
              style={{ fontSize: hp(1.6) }}
              className='text-neutral-700'
            >
              {index + 1}. {step}
            </Text>
          ))}

          {/* Recipe Video */}
          {strYoutube && (
            <View className='space-y-4'>
              <Text
                style={{ fontSize: hp(2.5) }}
                className='font-bold flex-1 text-neutral-700'
              >
                Recipe Video
              </Text>
              <YouTubeIframe
                videoId={getYoutubeVideoId(strYoutube)}
                height={hp(30)}
              />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
