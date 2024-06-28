import { View, Text, ScrollView, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Categories from "../components/categories"; // Import your Categories component
import axios from "axios";
import Recipes from "../components/recipes"; // Import your Recipes component

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Chicken");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    getCategories();
  }, []); // No need to fetch all recipes here

  const handleChangeCategory = category => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "https://themealdb.com/api/json/v1/1/categories.php"
      );
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const handleChangeSearch = text => {
    if (text.trim() === "") {
      // Check if search text is empty (after trimming)
      getRecipes(activeCategory); // Re-fetch recipes for the active category
    } else {
      const filteredRecipes = meals.filter(meal =>
        meal.strMeal.toLowerCase().includes(text.toLowerCase())
      );
      setMeals(filteredRecipes);
    }
  };

  const getRecipes = async (category = "Chicken") => {
    try {
      const response = await axios.get(
        `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className='space-y-6 pt-14'
      >
        {/* avatar and bell icon */}
        <View className='mx-4 flex-row justify-between items-center mb-2'>
          <Image
            source={require("../../assets/images/avatar.png")}
            style={{ height: hp(5), width: hp(5.5) }}
          />
          <BellIcon
            size={hp(4)}
            color='gray'
          />
        </View>

        {/* greetings and punchline */}
        <View className='mx-4 space-y-2 mb-2'>
          <Text
            style={{ fontSize: hp(1.7) }}
            className='text-neutral-600'
          >
            Hello, Omkar!
          </Text>
          <View>
            <Text
              style={{ fontSize: hp(3.8) }}
              className='font-semibold text-neutral-600'
            >
              Make your own food,
            </Text>
          </View>
          <Text
            style={{ fontSize: hp(3.8) }}
            className='font-semibold text-neutral-600'
          >
            stay at <Text className='text-amber-400'>home</Text>
          </Text>
        </View>

        {/* Search */}
        <View className='mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]'>
          <TextInput
            placeholder='Search any recipe'
            placeholderTextColor={"gray"}
            style={{ fontSize: hp(1.7) }}
            className='flex-1 text-base mb-1 pl-3 tracking-wider'
            onChangeText={handleChangeSearch}
          />
          <View className='bg-white rounded-full p-3'>
            <MagnifyingGlassIcon
              size={hp(2.5)}
              strokeWidth={3}
              color='gray'
            />
          </View>
        </View>

        {/* categories */}
        <View>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        {/* recipes */}
        <View>
          <Recipes
            meals={meals}
            categories={categories}
          />
        </View>
      </ScrollView>
    </View>
  );
}
