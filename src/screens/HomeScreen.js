import { View, Text, ScrollView, TextInput, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Categories from "../components/categories";
import axios from "axios";
import Recipes from "../components/recipes";
import { debounce } from "lodash";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Chicken");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getCategories();
    getRecipes(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (searchText.trim() === "") {
      getRecipes(activeCategory);
    } else {
      handleSearch(searchText);
    }
  }, [searchText]);

  const handleChangeCategory = category => {
    setActiveCategory(category);
    setMeals([]);
    getRecipes(category);
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
      Alert.alert("Error", "Failed to fetch categories");
      console.log("error: ", err.message);
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
      Alert.alert("Error", "Failed to fetch recipes");
      console.log("error: ", err.message);
    }
  };

  const handleSearch = useCallback(
    debounce(async text => {
      try {
        const response = await axios.get(
          `https://themealdb.com/api/json/v1/1/search.php?s=${text}`
        );
        if (response && response.data) {
          setMeals(response.data.meals || []);
        }
      } catch (err) {
        Alert.alert("Error", "Failed to fetch recipes");
        console.log("error: ", err.message);
      }
    }, 300),
    []
  );

  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className='pb-12'
      >
        {/* Greetings and punchline */}
        <View className='mx-4 mb-4'>
          <Text className='text-gray-500 text-sm'>Hello, Omkar!</Text>
          <Text className='text-4xl font-semibold text-black'>
            Make your own food,
          </Text>
          <Text className='text-4xl font-semibold text-black'>
            stay at <Text className='text-yellow-400'>home</Text>
          </Text>
        </View>

        {/* Search */}
        <View className='flex-row items-center bg-gray-100 rounded-full px-4 mx-4 mb-4'>
          <TextInput
            placeholder='Search any recipe'
            placeholderTextColor='gray'
            className='flex-1 text-sm py-2 px-4'
            onChangeText={setSearchText}
            value={searchText}
          />
          <View className='bg-white p-2 rounded-full'>
            <MagnifyingGlassIcon
              size={20}
              strokeWidth={3}
              color='gray'
            />
          </View>
        </View>

        {/* Categories */}
        <View>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        {/* Recipes */}
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
