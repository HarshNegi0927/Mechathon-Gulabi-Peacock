import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar, Tag, PiggyBank, Wallet, Plus, ArrowRight } from 'lucide-react';
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const scrollRef = useRef(null);

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await axios.get('https://mechathon-gulabi-peacock-9.onrender.com/api/budget', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setBudgets(response.data);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch budgets');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, []);

  const fetchExpenses = useCallback(async (budgetId) => {
    if (!budgetId) return;
    
    try {
      const response = await axios.get(`https://mechathon-gulabi-peacock-9.onrender.com/api/budget/expenses/${budgetId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setExpenses(response.data.expenses);
        setTotalAmount(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setErrorMessage('Failed to fetch expenses');
      setTimeout(() => setErrorMessage(''), 3000);
    }

  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  useEffect(() => {
    if (selectedBudget?._id) {
      fetchExpenses(selectedBudget._id);
    }
  }, [selectedBudget, fetchExpenses]);

const updateCategorySpent  = useCallback(async (budgetId,categoryName,amount) =>{
  try {
    const response = await axios.put('https://mechathon-gulabi-peacock-9.onrender.com/api/budget//category/spent',{
      categoryName, amount, date:expense.date,budgetId:budgetId
    },{
      withCredentials:true,
    })
    console.log(response.data)
  } catch (error) {
    console.log("Something Went Wrong!!!!",error)
  }
},[])
useEffect(() => {
  if (selectedBudget?._id) {
    updateCategorySpent(selectedBudget._id);
  }
}, [selectedBudget, fetchExpenses,updateCategorySpent]);
  const addExpense = useCallback(async () => {
    if (!expense.description || !expense.amount || !expense.category || !selectedBudget) {
      setErrorMessage('Please fill in all fields and select a budget');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
  
    try {
      const response = await axios.post('https://mechathon-gulabi-peacock-9.onrender.com/api/budget/addExpenses', {
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        budgetId: selectedBudget._id
      }, {
        withCredentials: true,
      });

      if (response.status === 201) {
        updateCategorySpent(selectedBudget._id,expense.category,expense.amount)
        setExpense({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
        setSuccessMessage('Expense added successfully!');
        fetchExpenses(selectedBudget._id);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setErrorMessage('Error adding expense');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [expense, selectedBudget, fetchExpenses,updateCategorySpent]);

  const handleBudgetSelection = useCallback((budget) => {
    setSelectedBudget(budget);
    setCategories(budget.categories || []);
  }, []);

  const calculateTotalAllocatedAmount = useCallback((budget) => {
    return budget.categories.reduce((acc, cat) => acc + cat.allocatedAmount, 0);
  }, []);

  const calculateProgress = useCallback((spent, total) => {
    return (spent / total) * 100;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6"
    >
      <div className="max-w-6xl mx-auto space-y-8" ref={scrollRef}>
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">Expense Tracker</h1>
        
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">Select a Budget</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => (
                <motion.div
                  key={budget._id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer transition-all duration-300 rounded-lg overflow-hidden ${
                    selectedBudget?._id === budget._id
                      ? 'ring-2 ring-purple-500 shadow-lg'
                      : 'shadow hover:shadow-md'
                  }`}
                  onClick={() => handleBudgetSelection(budget)}
                >
                  <div className="bg-white p-4">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2 truncate">{budget.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Total Budget:</span>
                      <span className="font-medium">₹{calculateTotalAllocatedAmount(budget)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Wallet className="w-4 h-4 mr-1 text-purple-500" />
                        Categories:
                      </span>
                      <span className="font-medium">{budget.categories.length}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {selectedBudget && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-purple-700 mb-4">Budget Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="flex items-center space-x-4">
                        <DollarSign className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Budget</p>
                          <p className="text-2xl font-bold text-gray-800">₹{calculateTotalAllocatedAmount(selectedBudget)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="flex items-center space-x-4">
                        <PiggyBank className="w-8 h-8 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Spent</p>
                          <p className="text-2xl font-bold text-gray-800">₹{totalAmount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="flex items-center space-x-4">
                        <Wallet className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Remaining Amount</p>
                          <p className="text-2xl font-bold text-gray-800">
                            ₹{(calculateTotalAllocatedAmount(selectedBudget) - totalAmount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Budget Utilization</p>
                    <Progress value={calculateProgress(totalAmount, calculateTotalAllocatedAmount(selectedBudget))} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-purple-700 mb-4">Add Expense</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Description"
                      value={expense.description}
                      onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={expense.amount}
                      onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                    />
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                      <Input
                        type="date"
                        value={expense.date}
                        onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={expense.category}
                      onValueChange={(value) => setExpense({ ...expense, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id || cat.name} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={addExpense}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Expense
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-purple-700 mb-4">Expense History</h2>
                  {expenses.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No expenses added yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {expenses.map((expense) => (
                        <li key={expense._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                          <div>
                            <p className="font-medium text-purple-600">{expense.description}</p>
                            <p className="text-sm text-gray-500">{expense.category} - {new Date(expense.date).toLocaleDateString()}</p>
                          </div>
                          <p className="text-lg font-semibold text-green-600">₹{expense.amount}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 bg-green-100 text-green-800 p-4 rounded-lg shadow-lg"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 bg-red-100 text-red-800 p-4 rounded-lg shadow-lg"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

