"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, MapPin, Calendar, DollarSign, User, LogOut } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Ad {
  id: string
  title: string
  description: string
  price: number | null
  category: string
  location: string
  images: string[]
  created_at: string
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

export default function Dashboard() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
    }
    getUser()
  }, [router, supabase.auth])

  useEffect(() => {
    const fetchAds = async () => {
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
          .order("created_at", { ascending: false })

        if (error) throw error
        setAds(data || [])
      } catch (error) {
        console.error("Error fetching ads:", error)
        toast.error("Failed to load ads")
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-pink-600">Skip2Love</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/create-ad">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Ad
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredAds.length} of {ads.length} ads
          </p>
        </div>

        {/* Ads Grid */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ads found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Be the first to post an ad!"}
            </p>
            <Button asChild>
              <Link href="/create-ad">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Ad
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAds.map((ad) => (
              <Link key={ad.id} href={`/ad/${ad.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      {ad.images && ad.images.length > 0 ? (
                        <img
                          src={ad.images[0] || "/placeholder.svg"}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {ad.category}
                        </Badge>
                        {ad.price && (
                          <div className="flex items-center text-green-600 font-semibold">
                            <DollarSign className="h-3 w-3" />
                            {ad.price}
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{ad.title}</h3>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.description}</p>

                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ad.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(ad.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-4 py-3 bg-gray-50 rounded-b-lg">
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={ad.profiles.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">{ad.profiles.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600 truncate">{ad.profiles.full_name || "Anonymous"}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
