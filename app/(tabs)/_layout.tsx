"use client"

import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../../contexts/AuthContext"
import { router } from "expo-router"
import { useEffect } from "react"

export default function TabLayout() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/")
    }
  }, [user, loading])

  if (loading || !user) {
    return null
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6B9D",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#FFB4B4",
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: "#FF6B9D",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="message" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-ad"
        options={{
          title: "Post Ad",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="add-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
