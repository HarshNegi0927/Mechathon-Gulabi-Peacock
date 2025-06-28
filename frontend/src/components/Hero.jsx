import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight, Smartphone, PieChart, TrendingUp } from 'lucide-react';
import { useTheme } from '../pages/LandingPage';

const Hero = () => {
  const { isDarkMode } = useTheme();

  return (
    <section id="home" className="pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            className="mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="block">Take control of your</span>
              <span className="block text-blue-600">finances with TickTracker</span>
            </h1>
            <p className={`mt-3 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0`}>
              Track expenses, set budgets, and gain valuable insights into your spending habits.
              Start your journey to financial freedom today!
            </p>
            <div className="mt-8 sm:flex">
              <motion.div
                className="rounded-md shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                >
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </motion.div>
              <motion.div
                className="mt-3 sm:mt-0 sm:ml-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/register"
                  className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${
                    isDarkMode
                      ? 'text-white bg-gray-800 hover:bg-gray-700'
                      : 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                  } md:py-4 md:text-lg md:px-10 transition-colors duration-300`}
                >
                  Learn more
                </a>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                alt="Financial planning"
                className="w-full h-full object-center object-cover"
              />
            </div>
            <motion.div
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-75 backdrop-filter backdrop-blur-sm rounded-lg p-6 shadow-xl`}>
                <div className="flex items-center justify-center mb-4">
                  <CreditCard className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Smart Expense Tracking</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Effortlessly manage your finances with our intuitive tools.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-6 flex items-start`}>
            <Smartphone className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Best ExpenseTracker</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Track your expenses on-the-go with our user-friendly mobile app.</p>
            </div>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-6 flex items-start`}>
            <PieChart className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Budget Planning</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Set and manage budgets for different expense categories.</p>
            </div>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-6 flex items-start`}>
            <TrendingUp className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Financial Insights</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Gain valuable insights into your spending habits with detailed reports.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

