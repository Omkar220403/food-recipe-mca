import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import MasonryList from "@react-native-seoul/masonry-list"; // Import MasonryList
import Loading from "../components/loading"; // Import Loading component
import { heightPercentageToDP as hp } from "react-native-responsive-screen"; // For responsive height
import Animated, { FadeInDown } from "react-native-reanimated"; // Import animation library
import { useNavigation } from "@react-navigation/native";

export default function AddIngredientsScreen() {
  const navigation = useNavigation();
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = async () => {
    const trimmedIngredient = ingredient.trim();
    if (trimmedIngredient && !ingredientsList.includes(trimmedIngredient)) {
      const updatedList = [...ingredientsList, trimmedIngredient];
      setIngredientsList(updatedList);
      setIngredient("");
      setLoading(true); // Start loading
      await fetchRecipes(updatedList); // Wait for fetching to complete
      setLoading(false); // End loading
    }
  };

  const handleRemoveIngredient = index => {
    const updatedList = ingredientsList.filter((_, i) => i !== index);
    setIngredientsList(updatedList);
    fetchRecipes(updatedList); // Re-fetch recipes based on updated ingredients
  };

  const fetchRecipes = async (ingredients = ingredientsList) => {
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
      // Optional: Show an alert or error message to the user
    }
  };

  const renderRecipeCard = (item, index) => {
    let isEven = index % 2 === 0; // Determine if index is even for styling

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)
          .duration(600)
          .springify()
          .damping(12)}
        style={styles.recipeCard}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            paddingLeft: isEven ? 0 : 8,
            paddingRight: isEven ? 8 : 0,
          }}
          onPress={() => navigation.navigate("RecipeDetail", { ...item })}
        >
          <Image
            source={{ uri: item.strMealThumb || "DEFAULT_IMAGE_URL" }} // Replace with a default image URL
            style={{
              width: "100%",
              height: index % 3 === 0 ? hp(25) : hp(35), // Responsive height
              borderRadius: 35,
            }}
          />
          <Text style={styles.recipeTitle}>
            {item.strMeal.length > 20
              ? item.strMeal.slice(0, 20) + "..."
              : item.strMeal}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Ingredients</Text>
      <TextInput
        placeholder='Enter ingredient'
        value={ingredient}
        onChangeText={setIngredient}
        style={styles.input}
      />
      <Button
        title='Add Ingredient'
        onPress={handleAddIngredient}
        color='#FFC107'
      />
      <View style={styles.listContainer}>
        {ingredientsList.map((item, index) => (
          <View
            key={index}
            style={styles.itemContainer}
          >
            <Text style={styles.ingredient}>{item}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveIngredient(index)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.suggestedTitle}>Suggested Recipes</Text>

      {loading ? (
        <Loading
          size='large'
          style={styles.loading}
        />
      ) : (
        <MasonryList
          data={suggestedRecipes}
          keyExtractor={item => item.idMeal}
          numColumns={2} // Same number of columns as in Recipes component
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderRecipeCard(item, index)}
          onEndReachedThreshold={0.1}
          className='mx-4 space-y-3' // Matching layout style from Recipes
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  ingredient: {
    fontSize: 18,
    color: "#333",
  },
  removeButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  suggestedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  recipeCard: {
    margin: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: hp(1.5), // Responsive font size
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 5, // Margin for better spacing
  },
  loading: {
    marginTop: 20,
  },
});
