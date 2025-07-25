"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Ad {
  id: string
  title: string
  description: string
  price: number
  category: string
  location: string
  images: string[]
  created_at: string
  profiles: {
    email: string
    city: string | null
  }
}

export default function DashboardPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchAds()
  }, [])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/auth/login")
      return
    }
    setUser(session.user)
  }

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from("ads")
        .select(`
          *,
          profiles (
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
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">💕 Skip2Love</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search ads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/create-ad">
                <Button className="bg-pink-500 hover:bg-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Ad
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Ads</h2>
          <p className="text-gray-600">Discover what people in your area are looking for</p>
        </div>

        {filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ads found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Be the first to post an ad!"}
            </p>
            <Link href="/create-ad">
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Ad
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <Link key={ad.id} href={`/ad/${ad.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {ad.images && ad.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image src={ad.images[0] || "/placeholder.svg"} alt={ad.title} fill className="object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{ad.title}</CardTitle>
                      <Badge variant="secondary">{ad.category}</Badge>
                    </div>
                    <CardDescription className="line-clamp-3">{ad.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {ad.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(ad.created_at).toLocaleDateString()}
                      </div>
                      {ad.price > 0 && <div className="text-lg font-semibold text-green-600">${ad.price}</div>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
