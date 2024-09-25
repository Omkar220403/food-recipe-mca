import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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
    <View style={styles.container}>
      <StatusBar style='dark' />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        style={styles.scrollView}
      >
        {/* Greetings and punchline */}
        <View style={styles.greetingsContainer}>
          <Text style={styles.greetingText}>Hello, Omkar!</Text>
          <View>
            <Text style={styles.punchlineText}>Make your own food,</Text>
          </View>
          <Text style={styles.punchlineText}>
            stay at <Text style={styles.highlightText}>home</Text>
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder='Search any recipe'
            placeholderTextColor={"gray"}
            style={styles.searchInput}
            onChangeText={setSearchText}
            value={searchText}
          />
          <View style={styles.searchIconContainer}>
            <MagnifyingGlassIcon
              size={hp(2.5)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    paddingBottom: 50,
  },
  greetingsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  greetingText: {
    fontSize: hp(1.7),
    color: "gray",
  },
  punchlineText: {
    fontSize: hp(3.8),
    fontWeight: "600",
    color: "black",
  },
  highlightText: {
    color: "#FFC107",
  },
  searchContainer: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.7),
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchIconContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 8,
  },
});
