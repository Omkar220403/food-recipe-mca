import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";
import MasonryList from "@react-native-seoul/masonry-list";
import Loading from "../components/loading";
import { CachedImage } from "../helpers/image";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export default function AddIngredientsScreen() {
  const navigation = useNavigation();
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = useCallback(async () => {
    const trimmedIngredient = ingredient.trim();
    if (trimmedIngredient && !ingredientsList.includes(trimmedIngredient)) {
      const updatedList = [...ingredientsList, trimmedIngredient];
      setIngredientsList(updatedList);
      setIngredient("");
      setLoading(true);
      await fetchRecipes(updatedList);
      setLoading(false);
    } else {
      Alert.alert("Invalid ingredient", "Please enter a valid ingredient.");
    }
  }, [ingredient, ingredientsList]);

  const handleRemoveIngredient = useCallback(
    index => {
      const updatedList = ingredientsList.filter((_, i) => i !== index);
      setIngredientsList(updatedList);
      setLoading(true);
      fetchRecipes(updatedList).then(() => setLoading(false));
    },
    [ingredientsList]
  );

  const fetchRecipes = useCallback(
    async (ingredients = ingredientsList) => {
      try {
        const recipeMap = {};
        const fetchPromises = ingredients.map(ing =>
          axios.get(`https://themealdb.com/api/json/v1/1/filter.php?i=${ing}`)
        );

        const responses = await Promise.all(fetchPromises);

        responses.forEach(response => {
          if (response && response.data && response.data.meals) {
            response.data.meals.forEach(meal => {
              if (recipeMap[meal.idMeal]) {
                recipeMap[meal.idMeal].count += 1;
              } else {
                recipeMap[meal.idMeal] = { ...meal, count: 1 };
              }
            });
          }
        });

        const filteredRecipes = Object.values(recipeMap).filter(
          meal => meal.count === ingredients.length
        );

        setSuggestedRecipes(filteredRecipes);
      } catch (err) {
        console.log("Error fetching recipes:", err.message);
        Alert.alert("Error", "Unable to fetch recipes. Please try again.");
      }
    },
    [ingredientsList]
  );

  const RenderRecipeCard = ({ item, index }) => {
    let isEven = index % 2 === 0;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)
          .duration(600)
          .springify()
          .damping(12)}
      >
        <Pressable
          style={{
            width: "100%",
            paddingLeft: isEven ? 0 : 8,
            paddingRight: isEven ? 8 : 0,
          }}
          onPress={() => navigation.navigate("RecipeDetail", { ...item })}
        >
          <CachedImage
            uri={item.strMealThumb || "https://example.com/default-image.jpg"}
            style={{
              width: "100%",
              height: index % 3 === 0 ? hp(25) : hp(35),
              borderRadius: 35,
            }}
          />
          <Text
            style={{ fontSize: hp(1.5) }}
            className='font-semibold ml-2 text-neutral-600'
          >
            {item.strMeal.length > 20
              ? item.strMeal.slice(0, 20) + "..."
              : item.strMeal}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View className='flex-1 p-5 bg-white'>
      <Text className='text-2xl font-bold text-gray-900 mb-5'>
        Add Ingredients
      </Text>
      <TextInput
        placeholder='Enter ingredient'
        value={ingredient}
        onChangeText={setIngredient}
        className='border border-gray-300 px-3 py-2 rounded-md bg-gray-100 mb-3'
      />
      <Button
        title='Add Ingredient'
        onPress={handleAddIngredient}
        color='#FFC107'
      />
      <View className='my-3'>
        {ingredientsList.length === 0 ? (
          <Text className='text-gray-600'>No ingredients added yet.</Text>
        ) : (
          ingredientsList.map((item, index) => (
            <View
              key={index}
              className='flex-row justify-between items-center py-2'
            >
              <Text className='text-lg text-gray-800'>{item}</Text>
              <TouchableOpacity
                className='bg-yellow-400 px-3 py-1 rounded-md'
                onPress={() => handleRemoveIngredient(index)}
              >
                <Text className='text-white font-bold'>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <Text className='text-xl font-bold text-gray-900 my-3'>
        Suggested Recipes
      </Text>

      {loading ? (
        <Loading
          size='large'
          className='mt-5'
        />
      ) : (
        <MasonryList
          data={suggestedRecipes}
          keyExtractor={item => item.idMeal}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RenderRecipeCard
              item={item}
              index={index}
            />
          )}
          onEndReachedThreshold={0.1}
          className='mx-4 space-y-3'
        />
      )}
    </View>
  );
}
