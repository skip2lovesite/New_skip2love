"use client"

import { useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { Text, Button } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../contexts/AuthContext"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

export default function WelcomeScreen() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)/dashboard")
    }
  }, [user, loading])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="headlineMedium">Skip2Love</Text>
      </View>
    )
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#FF8E9B", "#FFB4B4"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text variant="displayLarge" style={styles.logo}>
            💕
          </Text>
          <Text variant="headlineLarge" style={styles.title}>
            Skip2Love
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Find your perfect match through meaningful connections
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push("/(auth)/login")}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Get Started
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push("/(auth)/signup")}
            style={[styles.button, styles.outlineButton]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.outlineButtonLabel}
          >
            Create Account
          </Button>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F8",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.15,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineButton: {
    borderColor: "#FFFFFF",
    borderWidth: 2,
  },
  outlineButtonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})
