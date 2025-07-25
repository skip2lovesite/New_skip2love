import { View, StyleSheet, ScrollView, Dimensions } from "react-native"
import { Card, Text, Chip } from "react-native-paper"
import { Image } from "expo-image"

const { width } = Dimensions.get("window")
const imageWidth = width - 64

interface AdCardProps {
  ad: {
    id: string
    title: string
    description: string
    price: number
    images: string[]
    category: string
    location: string
    created_at: string
    profiles?: {
      city: string | null
    }
  }
  onPress: () => void
  showPrice?: boolean
}

export default function AdCard({ ad, onPress, showPrice = true }: AdCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        {ad.images && ad.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer} pagingEnabled>
            {ad.images.slice(0, 4).map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} contentFit="cover" />
            ))}
          </ScrollView>
        )}

        <View style={styles.contentContainer}>
          <Text variant="headlineSmall" style={styles.title} numberOfLines={2}>
            {ad.title}
          </Text>

          <Text variant="bodyMedium" style={styles.description} numberOfLines={3}>
            {ad.description}
          </Text>

          <View style={styles.tagsContainer}>
            <Chip mode="outlined" style={styles.chip}>
              {ad.category}
            </Chip>
            {ad.profiles?.city && (
              <Chip mode="outlined" style={styles.chip}>
                📍 {ad.profiles.city}
              </Chip>
            )}
          </View>

          <View style={styles.footer}>
            {showPrice && (
              <Text variant="headlineMedium" style={styles.price}>
                ${ad.price.toFixed(2)}
              </Text>
            )}
            <Text variant="bodySmall" style={styles.date}>
              {formatDate(ad.created_at)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },
  cardContent: {
    padding: 0,
  },
  imageContainer: {
    height: 200,
  },
  image: {
    width: imageWidth,
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    color: "#2D2D2D",
    marginBottom: 8,
  },
  description: {
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#FFB4B4",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    color: "#FF6B9D",
    fontWeight: "bold",
  },
  date: {
    color: "#999",
  },
})
