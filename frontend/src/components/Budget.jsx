"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Archive, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BudgetDashboard() {
  const [budgets, setBudgets] = useState([])
  const [error, setError] = useState('')
  const [showNewBudgetForm, setShowNewBudgetForm] = useState(false)
  const [showEditBudgetForm, setShowEditBudgetForm] = useState(false)
  const [editBudgetId, setEditBudgetId] = useState(null)
  const [expandedBudgets, setExpandedBudgets] = useState({})
  
  const [newBudget, setNewBudget] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    categories: [{ name: '', allocatedAmount: 0, spent: 0 }]
  })

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/budget', {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch budgets')
      const data = await response.json()
      setBudgets(data)
    } catch (err) {
      setError('Error fetching budgets')
    }
  }

  const handleCreateBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/api/budget/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newBudget)
      })

      if (!response.ok) throw new Error('Failed to create budget')
      
      await fetchBudgets()
      setShowNewBudgetForm(false)
      setNewBudget({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        categories: [{ name: '', allocatedAmount: 0, spent: 0 }]
      })
    } catch (err) {
      setError('Error creating budget')
    }
  }

  const handleUpdateSpent = async (budgetId, categoryName, spent) => {
    try {
      const response = await fetch('http://localhost:3001/api/budget/category/spent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ budgetId, categoryName, spent })
      })

      if (!response.ok) throw new Error('Failed to update category')
      await fetchBudgets()
    } catch (err) {
      setError('Error updating category spent amount')
    }
  }

  const handleArchiveBudget = async (budgetId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/budget/archive/${budgetId}`, {
        method: 'PUT',
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to archive budget')
      await fetchBudgets()
    } catch (err) {
      setError('Error archiving budget')
    }
  }

  const handleEditBudget = (budget) => {
    setEditBudgetId(budget._id)
    setNewBudget(budget)
    setShowEditBudgetForm(true)
  }

  const handleUpdateBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3001/api/budget/edit/${editBudgetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newBudget)
      })

      if (!response.ok) throw new Error('Failed to update budget')
      await fetchBudgets()
      setShowEditBudgetForm(false)
      setEditBudgetId(null)
      setNewBudget({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        categories: [{ name: '', allocatedAmount: 0, spent: 0 }]
      })
    } catch (err) {
      setError('Error updating budget')
    }
  }

  const addCategory = () => {
    setNewBudget(prev => ({
      ...prev,
      categories: [...prev.categories, { name: '', allocatedAmount: 0, spent: 0 }]
    }))
  }

  const removeCategory = (index) => {
    setNewBudget(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }))
  }

  const toggleBudgetExpansion = (budgetId) => {
    setExpandedBudgets(prev => ({
      ...prev,
      [budgetId]: !prev[budgetId]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800">Budget Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewBudgetForm(!showNewBudgetForm)}
            className="bg-purple-600 text-white px-6 py-3 rounded-md flex items-center gap-2 shadow-md hover:bg-purple-700 transition-all duration-300 text-lg font-semibold"
          >
            <Plus size={24} />
            New Budget
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(showNewBudgetForm || showEditBudgetForm) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-purple-50 p-6 rounded-md shadow-md mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-purple-800">
                {showEditBudgetForm ? 'Edit Budget' : 'Create New Budget'}
              </h2>
              <form onSubmit={showEditBudgetForm ? handleUpdateBudget : handleCreateBudget} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Budget Name"
                    className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    value={newBudget.name}
                    onChange={e => setNewBudget(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    value={newBudget.description}
                    onChange={e => setNewBudget(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <input
                    type="date"
                    className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    value={newBudget.startDate}
                    onChange={e => setNewBudget(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                  <input
                    type="date"
                    className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    value={newBudget.endDate}
                    onChange={e => setNewBudget(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-purple-800">Categories</h3>
                  {newBudget.categories.map((category, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <input
                        type="text"
                        placeholder="Category Name"
                        className="flex-grow p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        value={category.name}
                        onChange={e => {
                          const updatedCategories = [...newBudget.categories]
                          updatedCategories[index].name = e.target.value
                          setNewBudget(prev => ({ ...prev, categories: updatedCategories }))
                        }}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Allocated Amount"
                        className="w-40 p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        value={category.allocatedAmount}
                        onChange={e => {
                          const updatedCategories = [...newBudget.categories]
                          updatedCategories[index].allocatedAmount = parseFloat(e.target.value)
                          setNewBudget(prev => ({ ...prev, categories: updatedCategories }))
                        }}
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        <Trash2 size={24} />
                      </motion.button>
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addCategory}
                    className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-2 transition-colors duration-300"
                  >
                    <Plus size={20} /> Add Category
                  </motion.button>
                </div>

                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setShowNewBudgetForm(false)
                      setShowEditBudgetForm(false)
                    }}
                    className="px-6 py-3 border border-purple-500 text-purple-500 rounded-md hover:bg-purple-100 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-purple-700 transition-all duration-300 font-semibold"
                  >
                    {showEditBudgetForm ? 'Update Budget' : 'Create Budget'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-8"
        >
          {budgets.map(budget => (
            <motion.div
              key={budget._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-md shadow-md flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-800">{budget.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{budget.description}</p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditBudget(budget)}
                    className="text-purple-600 hover:text-purple-800 transition-colors duration-300"
                  >
                    <Edit size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleArchiveBudget(budget._id)}
                    className="text-purple-600 hover:text-purple-800 transition-colors duration-300"
                  >
                    <Archive size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleBudgetExpansion(budget._id)}
                    className="text-purple-600 hover:text-purple-800 transition-colors duration-300"
                  >
                    {expandedBudgets[budget._id] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {expandedBudgets[budget._id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    {budget.categories.map((category, index) => {
                      const progress = (category.spent / category.allocatedAmount) * 100
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-purple-700">{category.name}</span>
                            <span className="font-bold text-purple-800">
                              ₹{category.spent.toFixed(2)} / ₹{category.allocatedAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                                  {progress.toFixed(0)}%
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-purple-600">
                                  ₹{category.spent.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                              <motion.div
                                style={{ width: `${progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                          <input
                            type="number"
                            placeholder="Spent"
                            className="w-full p-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            value={category.spent}
                            onChange={(e) =>
                              handleUpdateSpent(budget._id, category.name, parseFloat(e.target.value))
                            }
                          />
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

