import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeSvg from "../assets/home.svg";
import PeopleSvg from "../assets/people.svg";
import CarSvg from "../assets/car.svg";

import { MyCars } from "../screens/MyCars";
import { AppStackRoutes } from "./app.stack.routes";
import { useTheme } from "styled-components";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { Profile } from "../screens/Profile";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppTabRoutes() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.main,
        tabBarInactiveTintColor: theme.colors.text_detail,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 20,
          paddingBottom: 20 + insets.bottom,
          height: 78,
          backgroundColor: theme.colors.background_primary,
        },
        headerShown: false,
      }}
    >
      <Screen
        name="Main"
        component={AppStackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={24} height={24} fill={color} />
          ),
        }}
      />

      <Screen
        name="MyCars"
        component={MyCars}
        options={{
          tabBarIcon: ({ color }) => (
            <CarSvg width={24} height={24} fill={color} />
          ),
        }}
      />

      <Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <PeopleSvg width={24} height={24} fill={color} />
          ),
        }}
      />
    </Navigator>
  );
}
