import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './components/Layout.jsx'
// import Header from './components/Header.jsx'
import Home from './components/Home.jsx'
import User from './components/User.jsx'
import Budget from './components/Budget.jsx'
import Report from './components/Report.jsx'
import Expense from './components/Expense.jsx'
import Footer from './components/Footer.jsx'
// import LandingPage from './components/EntryPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './components/login.jsx'
import RegisterPage from './components/Register.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
<>
      <Route path="/" element={<LandingPage />} />
      <Route path='/login' element = {<LoginPage/>}/>
      <Route path = '/register' element ={<RegisterPage/>}/>
      <Route path="dashboard" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="expense" element={<Expense />} />
        <Route path="budget" element={<Budget />} />
        <Route path="report" element={<Report />} />
        <Route path="user" element={<User />} />
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)