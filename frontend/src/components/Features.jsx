"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, PieChart, TrendingUp, Shield } from "lucide-react"
import { useTheme } from "../pages/LandingPage"

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0)
  const { isDarkMode } = useTheme()

  const features = [
    {
      icon: CreditCard,
      title: "Expense Tracking",
      description: "Easily log and categorize your expenses with our intuitive web interface.",
      details: [
        "Automatic categorization of expenses",
        "Receipt scanning and storage",
        "Multiple currency support",
        "Customizable categories and tags",
      ],
    },
    {
      icon: PieChart,
      title: "Budget Planning",
      description: "Set and manage budgets for different categories to stay on top of your finances.",
      details: [
        "Create monthly, quarterly, or annual budgets",
        "Visual budget progress indicators",
        "Flexible budget adjustments",
        "Budget vs. actual spending comparisons",
      ],
    },
    {
      icon: TrendingUp,
      title: "Financial Insights",
      description: "Get detailed reports and visualizations of your spending habits.",
      details: [
        "Interactive charts and graphs",
        "Spending trend analysis",
        "Category-wise breakdown",
        "Customizable date ranges for reports",
      ],
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your financial data is protected with state-of-the-art encryption.",
      details: ["End-to-end encryption", "Secure data storage", "Privacy-first approach", "Regular security audits"],
    },
  ]

  return (
    <section id="features" className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-3xl font-extrabold sm:text-4xl mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Powerful <span className="text-blue-600">Features</span>
          </h2>
          <p className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
            Discover the tools that will help you take control of your finances and achieve your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                activeFeature === index ? "ring-2 ring-blue-500" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveFeature(index)}
            >
              <div className="flex items-center mb-4">
                <feature.icon className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {feature.title}
                </h3>
              </div>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>{feature.description}</p>
              <AnimatePresence>
                {activeFeature === index && (
                  <motion.ul
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} space-y-2`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: detailIndex * 0.1 }}
                      >
                        • {detail}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg overflow-hidden`}>
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center">
              <div className="lg:w-1/2">
                <h3 className={`text-2xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"} sm:text-3xl`}>
                  Experience the power of TakeTrack
                </h3>
                <p className={`mt-4 text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Our comprehensive suite of features is designed to give you complete control over your finances. From
                  expense tracking to financial insights, TakeTrack has everything you need to achieve your financial
                  goals.
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
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                  alt="TakeTrack dashboard"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
