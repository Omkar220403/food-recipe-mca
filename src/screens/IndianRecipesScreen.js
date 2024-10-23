import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import recipesData from "../constants/indianRecipes.json"; // Assuming the JSON is saved in this path
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { CachedImage } from "../helpers/image"; // Assuming you have an image caching helper
import MasonryList from "@react-native-seoul/masonry-list";

const cuisines = [
  {
    strCategory: "All",
    strCategoryThumb: "https://link_to_image_for_all_cuisines",
  },
  {
    strCategory: "Punjabi",
    strCategoryThumb:
      "https://lh3.googleusercontent.com/gg/ACM6BIt6pwy9W3WujWoRZXJDa4gzDLu6riGgtgXdQJYKxY7epDddM34qFP5CdGdOBdse0hR3sTQZzg2Oy509Tog4WAdNOd_ZWxmIQojbkMQ1rBZkZ_1caODXhRCvSuMrhUW7lEzMk2Rfa5rW_3dH2QllYilEYmM7Ny35O0VwWashB3OCzGhSVBw",
  },
  {
    strCategory: "Mughlai",
    strCategoryThumb: "https://link_to_image_for_mughlai",
  },
  {
    strCategory: "Maharashtrian",
    strCategoryThumb:
      "https://images.pexels.com/photos/17223835/pexels-photo-17223835/free-photo-of-photo-of-a-meal-on-a-tray.jpeg",
  },
  {
    strCategory: "North Indian",
    strCategoryThumb: "https://link_to_image_for_north_indian",
  },
];

export default function IndianRecipes() {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigation = useNavigation();

  // Filter recipes based on the active category
  const filteredRecipes =
    activeCategory === "All"
      ? recipesData.recipes
      : recipesData.recipes.filter(recipe => recipe.cuisine === activeCategory);

  const handleChangeCategory = category => {
    setActiveCategory(category);
  };

  const renderRecipeCard = ({ item, index }) => {
    let isEven = index % 2 === 0; // Even items for padding adjustments

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)
          .duration(600)
          .springify()
          .damping(12)}
        style={{ paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }}
      >
        <TouchableOpacity
          className='bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-4'
          onPress={() => navigation.navigate("RecipeDetail", { ...item })}
        >
          <CachedImage
            source={{ uri: item.strMealThumb }}
            className='w-full h-40 rounded-lg'
          />
          <Text className='text-lg font-semibold text-center my-2'>
            {item.strMeal.length > 20
              ? item.strMeal.slice(0, 20) + "..."
              : item.strMeal}
          </Text>
          <Text className='text-sm text-gray-500 text-center mb-2'>
            {item.cuisine}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className='flex-1 bg-white p-5'>
      <Text className='text-2xl font-bold text-gray-800 mb-5'>
        Indian Recipes
      </Text>

      <Animated.View entering={FadeInDown.duration(500).springify()}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className='space-x-4 mb-5'
        >
          {cuisines.map((cat, index) => {
            let isActive = cat.strCategory === activeCategory;
            let activeButtonClass = isActive ? "bg-yellow-500" : "bg-gray-200";

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleChangeCategory(cat.strCategory)}
                className='items-center'
              >
                <View className={`rounded-full p-1 ${activeButtonClass}`}>
                  <CachedImage
                    uri={cat.strCategoryThumb}
                    className='w-16 h-16 rounded-full'
                  />
                </View>
                <Text className='text-sm text-gray-600 mt-1'>
                  {cat.strCategory}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      <MasonryList
        data={filteredRecipes}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={renderRecipeCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}
