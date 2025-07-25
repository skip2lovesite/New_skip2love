import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, MessageCircle, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">💕</div>
              <h1 className="text-2xl font-bold text-gray-900">Skip2Love</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-pink-500 hover:bg-pink-600">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Find Love, Friends & More</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Skip2Love is your local classified platform for meaningful connections. Post ads, browse listings, and
            connect with people in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-lg px-8 py-3">
                Start Connecting
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                Browse Ads
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Skip2Love?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy to connect with like-minded people in your area
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <CardTitle>Find Love</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Connect with potential romantic partners through personalized ads</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Make Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find activity partners, study buddies, or just new friends to hang out with
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Easy Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Built-in messaging system to communicate safely with other users</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Safe & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your privacy and safety are our top priorities with secure authentication
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have found meaningful connections through Skip2Love
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-2xl">💕</div>
            <h4 className="text-xl font-bold">Skip2Love</h4>
          </div>
          <p className="text-gray-400">© 2024 Skip2Love. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
