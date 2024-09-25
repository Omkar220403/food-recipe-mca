import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import Recipes from "../components/recipes";
import Categories from "../components/categories"; // Import Categories component

export default function AddIngredientsScreen() {
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  // Fetch categories when the component mounts
  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://themealdb.com/api/json/v1/1/categories.php"
      );
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log("Error fetching categories:", err.message);
    }
  };

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      const updatedList = [...ingredientsList, ingredient.trim()];
      setIngredientsList(updatedList);
      setIngredient("");
      fetchRecipes(updatedList); // Fetch recipes based on new ingredients
    }
  };

  const handleRemoveIngredient = index => {
    const updatedList = ingredientsList.filter((_, i) => i !== index);
    setIngredientsList(updatedList);
    fetchRecipes(updatedList); // Re-fetch recipes based on updated ingredients
  };

  const handleCategoryChange = category => {
    setActiveCategory(category);
    fetchRecipes(ingredientsList, category); // Fetch recipes based on ingredients and category
  };

  const fetchRecipes = async (
    ingredients = ingredientsList,
    category = activeCategory
  ) => {
    try {
      const recipeMap = {};

      for (const ing of ingredients) {
        const response = await axios.get(
          `https://themealdb.com/api/json/v1/1/filter.php?i=${ing}`
        );
        if (response && response.data && response.data.meals) {
          response.data.meals.forEach(meal => {
            if (recipeMap[meal.idMeal]) {
              recipeMap[meal.idMeal].count += 1;
            } else {
              recipeMap[meal.idMeal] = { ...meal, count: 1 };
            }
          });
        }
      }

      const filteredRecipes = Object.values(recipeMap).filter(
        meal => meal.count === ingredients.length
      );

      setSuggestedRecipes(filteredRecipes);
    } catch (err) {
      console.log("Error fetching recipes:", err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
      {/* Display Categories */}
      <Categories
        categories={categories}
        activeCategory={activeCategory}
        handleChangeCategory={handleCategoryChange}
      />

      {/* Display Suggested Recipes */}
      <Recipes
        categories={[]}
        meals={suggestedRecipes}
      />
    </ScrollView>
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
});
