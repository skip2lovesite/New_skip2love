import { Stack } from "expo-router"
import { AuthProvider } from "../contexts/AuthContext"
import { PaperProvider } from "react-native-paper"
import { StatusBar } from "expo-status-bar"

const theme = {
  colors: {
    primary: "#FF6B9D",
    secondary: "#FF8E9B",
    tertiary: "#FFB4B4",
    background: "#FFF5F8",
    surface: "#FFFFFF",
    error: "#FF5252",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onBackground: "#2D2D2D",
    onSurface: "#2D2D2D",
  },
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  )
}
