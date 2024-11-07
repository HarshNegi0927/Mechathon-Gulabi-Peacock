import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, PieChart, TrendingUp, Shield, ChevronRight, Camera, Check } from 'lucide-react'

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

const TestimonialCard = ({ name, role, quote, image }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <p className="italic text-gray-700">"{quote}"</p>
    </div>
  )
}

const PhotoGallery = () => {
  const images = [
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400',
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <motion.div
          key={index}
          className="relative overflow-hidden rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <img src={src} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Camera className="text-white w-8 h-8" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const PricingCard = ({ title, price, features, isPopular }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${isPopular ? 'border-2 border-blue-500' : ''}`}>
      {isPopular && (
        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-4xl font-bold mb-6">${price}<span className="text-lg font-normal">/month</span></p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="text-green-500 w-5 h-5 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-2 rounded-full font-semibold ${isPopular ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
        Choose Plan
      </button>
    </div>
  )
}

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PieChart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">ExpenseTracker</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
          </nav>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Sign Up
          </button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">Master Your Finances with Ease</h1>
              <p className="text-xl mb-8">Track, analyze, and optimize your expenses. Take control of your financial future today.</p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center">
                Get Started Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src="/placeholder.svg?height=400&width=600" alt="Expense Tracking Dashboard" className="rounded-lg shadow-2xl" />
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose ExpenseTracker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<CreditCard className="w-12 h-12 text-blue-500" />}
                title="Easy Expense Logging"
                description="Quickly log your expenses on-the-go with our intuitive interface."
              />
              <FeatureCard 
                icon={<PieChart className="w-12 h-12 text-blue-500" />}
                title="Insightful Reports"
                description="Gain valuable insights with our detailed financial reports and analytics."
              />
              <FeatureCard 
                icon={<TrendingUp className="w-12 h-12 text-blue-500" />}
                title="Budget Planning"
                description="Set and track budgets to help you reach your financial goals."
              />
              <FeatureCard 
                icon={<Shield className="w-12 h-12 text-blue-500" />}
                title="Secure & Private"
                description="Your financial data is encrypted and never shared with third parties."
              />
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard 
                name="John Doe"
                role="Small Business Owner"
                quote="ExpenseTracker has revolutionized how I manage my business finances. It's intuitive and powerful!"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard 
                name="Jane Smith"
                role="Freelance Designer"
                quote="As a freelancer, keeping track of expenses was a nightmare. ExpenseTracker made it a breeze!"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard 
                name="Mike Johnson"
                role="Student"
                quote="ExpenseTracker helped me stick to my budget and save for my goals. It's a game-changer for students!"
                image="/placeholder.svg?height=100&width=100"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">ExpenseTracker in Action</h2>
            <PhotoGallery />
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard 
                title="Basic"
                price={9.99}
                features={[
                  "Expense Tracking",
                  "Basic Reports",
                  "1 User"
                ]}
                isPopular={false}
              />
              <PricingCard 
                title="Pro"
                price={19.99}
                features={[
                  "Everything in Basic",
                  "Advanced Analytics",
                  "5 Users",
                  "Priority Support"
                ]}
                isPopular={true}
              />
              <PricingCard 
                title="Enterprise"
                price={49.99}
                features={[
                  "Everything in Pro",
                  "Custom Integrations",
                  "Unlimited Users",
                  "Dedicated Account Manager"
                ]}
                isPopular={false}
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Take Control of Your Finances?</h2>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center">
              Start Your Free Trial
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <PieChart className="h-6 w-6" />
            <span className="text-xl font-semibold">ExpenseTracker</span>
          </div>
          <nav className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a>
          </nav>
          <div className="mt-4 md:mt-0">
            <p>&copy; 2024 ExpenseTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
