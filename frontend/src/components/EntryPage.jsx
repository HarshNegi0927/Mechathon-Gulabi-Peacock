"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CreditCard, PieChart, TrendingUp, Shield, ChevronRight, Users, Zap, Coffee, Sun, Moon } from "lucide-react"

// Shadcn UI components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Theme provider and toggle
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

const ThemeContext = React.createContext()

const ThemeToggle = () => {
  const { theme, toggleTheme } = React.useContext(ThemeContext)

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Navigation component
const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <PieChart className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">TakeTrack</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/">
              Home
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#about">
              About
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#features">
              Features
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Hero component
const Hero = () => {
  const handleGetStarted = () => {
    // This will now work as sign up
    console.log("Sign up process initiated")
    // Add your signup logic here
  }

  return (
    <section className="py-20 md:py-32 bg-background text-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-1/2 mb-10 md:mb-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Master Your Finances with <span className="text-primary">Unparalleled Ease</span>
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Track, analyze, and optimize your expenses like never before. Take control of your financial future today
            with TakeTrack's revolutionary platform.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="TakeTrack Dashboard"
            className="rounded-lg shadow-2xl w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  )
}

// About component
const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            About <span className="text-primary">TakeTrack</span>
          </h2>
          <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
            TakeTrack was born from the simple belief that managing your finances shouldn't be complicated. We
            understand the challenges individuals and businesses face when trying to keep track of their expenses,
            budgets, and financial goals.
          </p>
          <p className="text-lg mb-8 text-muted-foreground leading-relaxed">
            Our mission is to empower you with the tools and insights needed to make informed financial decisions.
            Whether you're a student managing a tight budget, a freelancer tracking business expenses, or a small
            business owner looking for comprehensive financial oversight, TakeTrack provides the clarity and control you
            need to succeed.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Built with cutting-edge technology and designed with user experience at its core, TakeTrack transforms the
            way you interact with your financial data. Join thousands of users who have already taken control of their
            financial future with TakeTrack.
          </p>
        </div>
      </div>
    </section>
  )
}

// Features component
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader>
          <div className="mb-2 text-primary">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const Features = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why TakeTrack <span className="text-primary">Stands Out</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<CreditCard className="w-12 h-12" />}
            title="Effortless Expense Logging"
            description="Log your expenses with our intuitive web interface and smart categorization system."
            delay={0.1}
          />
          <FeatureCard
            icon={<PieChart className="w-12 h-12" />}
            title="Comprehensive Analytics"
            description="Gain valuable insights with our detailed financial reports and predictive analytics dashboard."
            delay={0.2}
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12" />}
            title="Smart Budget Planning"
            description="Set, track, and adjust budgets with AI-powered recommendations to reach your financial goals."
            delay={0.3}
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12" />}
            title="Bank-Grade Security"
            description="Your financial data is protected with state-of-the-art encryption and never shared with third parties."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  )
}

// Footer component
const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About TakeTrack</h3>
            <p className="text-muted-foreground">
              Empowering individuals and businesses to take control of their finances through innovative tracking and
              analytics.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Users className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Coffee className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Zap className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2024 TakeTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ScrollProgress component
const ScrollProgress = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollPercentage(scrollPercent)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <motion.div className="fixed bottom-0 left-0 h-1 bg-primary z-50" style={{ width: `${scrollPercentage}%` }} />
}

// WeatherWidget component
const WeatherWidget = () => {
  const [weather, setWeather] = useState({ temp: 25, condition: "Sunny" })

  useEffect(() => {
    // Simulating weather API call
    const fetchWeather = async () => {
      setWeather({ temp: 25, condition: "Sunny" })
    }

    fetchWeather()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="shadow-lg">
        <CardContent className="flex items-center p-4">
          <Sun className="w-8 h-8 text-yellow-500 mr-2" />
          <div>
            <CardTitle className="text-sm">{weather.condition}</CardTitle>
            <CardDescription>{weather.temp}°C</CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main component
const EnhancedLandingPage = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <Hero />
        <About />
        <Features />
        <Footer />
        <ScrollProgress />
        <WeatherWidget />
      </div>
    </ThemeProvider>
  )
}

export default EnhancedLandingPage
