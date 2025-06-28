"use client"

import { useState, createContext, useContext } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import About from "../components/About"
import Features from "../components/Features"
import Footer from "../components/Footer"

export const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <Navbar />
        <Hero />
        <About />
        <Features />
        <Footer />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
