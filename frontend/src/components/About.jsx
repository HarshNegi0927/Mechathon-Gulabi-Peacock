"use client"
import { motion } from "framer-motion"
import { Shield, Users, Zap } from "lucide-react"
import { useTheme } from "../pages/LandingPage"

const About = () => {
  const { isDarkMode } = useTheme()

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected with bank-level security.",
    },
    {
      icon: Users,
      title: "Community-Driven",
      description: "Join a community of users committed to improving their financial health.",
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Our web platform is optimized for speed, allowing you to manage your finances quickly.",
    },
  ]

  return (
    <section id="about" className={`py-20 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-3xl font-extrabold sm:text-4xl mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            About <span className="text-blue-600">TakeTrack</span>
          </h2>
          <p className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
            TakeTrack is your personal finance companion, designed to help you manage your expenses and achieve your
            financial goals. With intuitive features and powerful insights, we make it easy for you to take control of
            your money.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {feature.title}
              </h3>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg overflow-hidden shadow-lg`}>
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center">
              <div className="lg:w-1/2">
                <h3 className={`text-2xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"} sm:text-3xl`}>
                  Join thousands of users improving their financial health
                </h3>
                <p className={`mt-4 text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  TakeTrack has helped countless individuals and families take control of their finances. Our
                  user-friendly interface and powerful features make it easy to track expenses, set budgets, and work
                  towards your financial goals.
                </p>
                <div className="mt-8">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                  >
                    Get Started
                  </a>
                </div>
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <img
                  className="w-full h-64 object-cover object-center rounded-lg sm:h-80 lg:h-96"
                  src="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                  alt="People using TakeTrack"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
