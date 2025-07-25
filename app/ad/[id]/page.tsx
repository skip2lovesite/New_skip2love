"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, Share2, Flag, MapPin, Calendar, DollarSign, User } from "lucide-react"
import { toast } from "sonner"

interface Ad {
  id: string
  title: string
  description: string
  price: number | null
  category: string
  location: string
  images: string[]
  created_at: string
  user_id: string
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

export default function AdDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data, error } = await supabase
          .from("ads")
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            )
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error
        setAd(data)
      } catch (error) {
        console.error("Error fetching ad:", error)
        toast.error("Failed to load ad")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAd()
    }
  }, [params.id, supabase])

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: ad?.title,
          text: ad?.description,
          url: url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy link")
      }
    }
  }

  const handleContact = () => {
    if (!user) {
      toast.error("Please log in to contact the seller")
      router.push("/auth/login")
      return
    }

    if (user.id === ad?.user_id) {
      toast.error("You cannot contact yourself")
      return
    }

    // For now, just show a success message
    // In a real app, this would open a messaging interface
    toast.success("Contact feature coming soon!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ad details...</p>
        </div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ad not found</h1>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="h-4 w-4 mr-2" />
              Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {ad.images && ad.images.length > 0 ? (
                  <div>
                    {/* Main Image */}
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      <img
                        src={ad.images[currentImageIndex] || "/placeholder.svg"}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Thumbnail Navigation */}
                    {ad.images.length > 1 && (
                      <div className="p-4 flex gap-2 overflow-x-auto">
                        {ad.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex ? "border-pink-500" : "border-gray-200"
                            }`}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${ad.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-2" />
                      <p>No images available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ad Details */}
          <div className="space-y-6">
            {/* Main Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">{ad.category}</Badge>
                  {ad.price && (
                    <div className="flex items-center text-2xl font-bold text-green-600">
                      <DollarSign className="h-5 w-5" />
                      {ad.price}
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">{ad.title}</h1>

                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {ad.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Posted {new Date(ad.created_at).toLocaleDateString()}
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={ad.profiles.avatar_url || undefined} />
                    <AvatarFallback>{ad.profiles.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ad.profiles.full_name || "Anonymous"}</p>
                    <p className="text-sm text-gray-600">Member since {new Date(ad.created_at).getFullYear()}</p>
                  </div>
                </div>

                <Button onClick={handleContact} className="w-full">
                  Contact Seller
                </Button>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Safety Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Meet in a public place</li>
                  <li>• Bring a friend if possible</li>
                  <li>• Trust your instincts</li>
                  <li>• Don't share personal information</li>
                  <li>• Report suspicious activity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
