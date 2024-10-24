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
    strCategoryThumb:
      "https://www.nativeplanet.com/img/2023/11/a-platter-of-traditional-punjabi-dishes-served-in-ludhiana_1700893871869-1200x675-20231125120802.jpg",
  },
  {
    strCategory: "Punjabi",
    strCategoryThumb:
      "https://www.goindigo.in/content/dam/indigov2/6e-website/destinations/get-inspired/food-tripping/chole-bhature.jpg",
  },
  {
    strCategory: "Mughlai",
    strCategoryThumb:
      "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
  },
  {
    strCategory: "Maharashtrian",
    strCategoryThumb:
      "https://images.pexels.com/photos/17223835/pexels-photo-17223835/free-photo-of-photo-of-a-meal-on-a-tray.jpeg",
  },
  {
    strCategory: "North Indian",
    strCategoryThumb:
      "https://www.thespruceeats.com/thmb/hqqNrNhIpqPqV2u0T0K-IUzUsEo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SES-cuisine-of-north-india-1957883-d32a933f506d43f59ac38a8eb956884a.jpg",
  },
  {
    strCategory: "Hyderabadi",
    strCategoryThumb: "https://static.toiimg.com/photo/92522961.cms",
  },
  {
    strCategory: "Andhra",
    strCategoryThumb:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Vegetarian_Andhra_Meal.jpg/240px-Vegetarian_Andhra_Meal.jpg",
  },
  {
    strCategory: "Kashmiri",
    strCategoryThumb:
      "https://www.khyberhotels.com/blog/wp-content/uploads/2024/07/kashmiri_wazwan-683x1024.jpg",
  },
  {
    strCategory: "Goan",
    strCategoryThumb:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiBAfnecUwFCbVXmbG8uXJ3WUinzSLwdzvDQ&s",
  },
  {
    strCategory: "Chettinad",
    strCategoryThumb:
      "https://assets.cntraveller.in/photos/60ba17670f3a5367ec9fe1cf/master/pass/NV-Horizontal-Thali-Shot1-jpg.jpg",
  },
  {
    strCategory: "Kerala",
    strCategoryThumb:
      "https://media.istockphoto.com/id/838927480/photo/onam-sadya-on-a-banana-leaf.jpg?s=612x612&w=0&k=20&c=gwLv5UccfysMWJn2nEPXoQfczkCTBylrmenTmHonHrc=",
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

  const RenderRecipeCard = ({ item, index }) => {
    let isEven = index % 2 === 0;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)
          .duration(600)
          .springify()
          .damping(12)}
        style={{
          width: "100%",
          paddingLeft: isEven ? 0 : 8,
          paddingRight: isEven ? 8 : 0,
        }}
      >
        <TouchableOpacity
          className='flex justify-center mb-4 space-y-1'
          onPress={() => navigation.navigate("IndianRecipeDetail", { ...item })}
        >
          <CachedImage
            uri={item.strMealThumb}
            style={{
              width: "100%",
              height: index % 3 === 0 ? 200 : 250, // Adjust height as needed
              borderRadius: 35,
            }}
            className='bg-black/5'
          />
          <Text
            style={{ fontSize: 16 }}
            className='font-semibold ml-2 text-neutral-600'
          >
            {item.strMeal.length > 20
              ? item.strMeal.slice(0, 20) + "..."
              : item.strMeal}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className='flex-1 bg-white p-5'>
      <Text className='text-2xl font-bold text-gray-800 mb-5'>
        Local Recipes
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
        renderItem={RenderRecipeCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}
