import { Cloudinary } from "cloudinary-react-native"

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: "dyzhukr9m",
    apiKey: "865377189421577",
    apiSecret: "10zr0oYwvK_Wnok5v-TMJvb123g",
  },
})

export const uploadImage = async (imageUri: string): Promise<string> => {
  try {
    const result = await cld.uploader.upload(imageUri, {
      upload_preset: "skip2love_preset", // You'll need to create this in Cloudinary
      folder: "skip2love",
      resource_type: "image",
    })
    return result.secure_url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export const uploadMultipleImages = async (imageUris: string[]): Promise<string[]> => {
  try {
    const uploadPromises = imageUris.map((uri) => uploadImage(uri))
    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    console.error("Error uploading multiple images:", error)
    throw error
  }
}

export default cld
