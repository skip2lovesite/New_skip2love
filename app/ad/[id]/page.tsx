"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, DollarSign, MessageCircle, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import Image from "next/image"

interface AdDetail {
  id: string
  title: string
  description: string
  price: number
  category: string
  location: string
  images: string[]
  created_at: string
  user_id: string
  profiles: {
    email: string
    city: string | null
    avatar_url: string | null
  }
}

export default function AdDetailPage() {
  const [ad, setAd] = useState<AdDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    checkUser()
    fetchAd()
  }, [params.id])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const fetchAd = async () => {
    try {
      const { data, error } = await supabase
        .from("ads")
        .select(`
          *,
          profiles (
            email,
            city,
            avatar_url
          )
        `)
        .eq("id", params.id)
        .eq("is_active", true)
        .single()

      if (error) throw error
      setAd(data)
    } catch (error) {
      console.error("Error fetching ad:", error)
      toast.error("Ad not found")
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleContact = async () => {
    if (!user) {
      toast.error("Please log in to contact the seller")
      router.push("/auth/login")
      return
    }

    if (user.id === ad?.user_id) {
      toast.error("You cannot contact yourself")
      return
    }

    // Navigate to messaging or show contact info
    toast.success("Contact feature coming soon!")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad?.title,
          text: ad?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad not found</h2>
          <p className="text-gray-600 mb-4">This ad may have been removed or doesn't exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 truncate">{ad.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {ad.images && ad.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={ad.images[currentImageIndex] || "/placeholder.svg"}
                      alt={ad.title}
                      width={800}
                      height={400}
                      className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                    />
                    {ad.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {ad.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {ad.images.length > 1 && (
                    <div className="p-4">
                      <div className="flex gap-2 overflow-x-auto">
                        {ad.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex ? "border-pink-500" : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`${ad.title} ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Ad Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{ad.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {ad.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(ad.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {ad.category}
                    </Badge>
                    {ad.price > 0 && (
                      <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                        <DollarSign className="h-5 w-5" />
                        {ad.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ad.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Seller Info and Actions */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={ad.profiles.avatar_url || ""} />
                    <AvatarFallback>{ad.profiles.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ad.profiles.email.split("@")[0]}</p>
                    {ad.profiles.city && <p className="text-sm text-gray-600">{ad.profiles.city}</p>}
                  </div>
                </div>
                <Button
                  onClick={handleContact}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  disabled={user?.id === ad.user_id}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {user?.id === ad.user_id ? "Your Ad" : "Contact Seller"}
                </Button>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safety Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Meet in a public place</li>
                  <li>• Bring a friend if possible</li>
                  <li>• Trust your instincts</li>
                  <li>• Don't share personal info</li>
                  <li>• Use secure payment methods</li>
                </ul>
              </CardContent>
            </Card>

            {/* Report Ad */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  Report this ad
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
