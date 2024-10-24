import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";
import AuthScreen from "../screens/LoginScreen";
import AddIngredientsScreen from "../screens/IngredientsScreen";
import IndianRecipesScreen from "../screens/IndianRecipesScreen";
import IndianRecipeDetailsScreen from "../screens/IndianRecipesDetailedScreen";

// Create Stack Navigator
const Stack = createNativeStackNavigator();

// Create Drawer Navigator
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerIcon: ({ focused, size }) => {
          let iconName;

          if (route.name === "HomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "AddIngredients") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? "#e91e63" : "gray"}
            />
          );
        },
      })}
    >
      <Drawer.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{ drawerLabel: "Home" }}
      />
      <Drawer.Screen
        name='AddIngredients'
        component={AddIngredientsScreen}
        options={{ drawerLabel: "Add Ingredients" }}
      />
      <Drawer.Screen
        name='Local Recipes'
        component={IndianRecipesScreen}
        options={{ drawerLabel: "Indian Recipes" }}
      />
    </Drawer.Navigator>
  );
}

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name='AuthScreen'
          component={AuthScreen}
        />
        <Stack.Screen
          name='MainDrawer' // The drawer navigator as the main entry point
          component={MainDrawer}
        />
        <Stack.Screen
          name='Welcome'
          component={WelcomeScreen}
        />
        <Stack.Screen
          name='RecipeDetail'
          component={RecipeDetailsScreen}
        />
        <Stack.Screen
          name='IndianRecipeDetail'
          component={IndianRecipeDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
