"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, RefreshControl, Alert } from "react-native"
import { Searchbar, FAB } from "react-native-paper"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/AuthContext"
import { router } from "expo-router"
import AdCard from "../../components/AdCard"

interface Ad {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  location: string
  created_at: string
  profiles: {
    id: string
    email: string
    city: string | null
  }
}

export default function DashboardScreen() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from("ads")
        .select(`
          *,
          profiles (
            id,
            email,
            city
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAds(data || [])
    } catch (error) {
      console.error("Error fetching ads:", error)
      Alert.alert("Error", "Failed to load ads")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchAds()
  }

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAdPress = (ad: Ad) => {
    router.push({
      pathname: "/ad-detail",
      params: { adId: ad.id },
    })
  }

  const handleCreateAd = () => {
    if (!profile) {
      Alert.alert("Profile Required", "Please complete your profile before posting an ad.", [
        { text: "Cancel", style: "cancel" },
        { text: "Go to Profile", onPress: () => router.push("/(tabs)/profile") },
      ])
      return
    }
    router.push("/(tabs)/create-ad")
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search ads..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredAds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdCard
            ad={item}
            onPress={() => handleAdPress(item)}
            showPrice={false} // Only show price on dashboard until clicked
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FAB icon="plus" style={styles.fab} onPress={handleCreateAd} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F8",
  },
  searchbar: {
    margin: 16,
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#FF6B9D",
  },
})
