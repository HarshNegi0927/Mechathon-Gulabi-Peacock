import React, { useState } from 'react';

function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [expense, setExpense] = useState({ description: '', amount: '', category: '', date: '' });
    const [customCategories, setCustomCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [filter, setFilter] = useState('daily');

    // Handle adding a custom category
    const handleAddCategory = () => {
        if (newCategory && !customCategories.includes(newCategory)) {
            setCustomCategories([...customCategories, newCategory]);
            setNewCategory('');
        }
    };

    // Handle adding an expense
    const handleAddExpense = () => {
        if (expense.description && expense.amount && expense.category) {
            setExpenses([...expenses, expense]);
            setExpense({ description: '', amount: '', category: '', date: '' });
        }
    };

    // Filter expenses based on the selected filter (daily, monthly, yearly)
    const filteredExpenses = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        const currentDate = new Date();

        if (filter === 'daily') {
            return expDate.toDateString() === currentDate.toDateString();
        } else if (filter === 'monthly') {
            return expDate.getMonth() === currentDate.getMonth() && expDate.getFullYear() === currentDate.getFullYear();
        } else if (filter === 'yearly') {
            return expDate.getFullYear() === currentDate.getFullYear();
        }
        return true;
    });

    // Calculate total expenses
    const totalExpenses = filteredExpenses.reduce((total, exp) => total + parseFloat(exp.amount), 0);

    return (
        <div className="w-full min-h-screen bg-gray-100 text-gray-800 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-yellow-600">Expense Tracker</h1>
                    <p className="text-lg text-gray-600">Track your daily, monthly, and yearly expenses, and create your own custom categories!</p>
                </div>

                {/* Expense Filter Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Filter Expenses</h2>
                        <select
                            id="filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="p-2 rounded-lg border border-gray-300"
                        >
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                {/* Add Expense Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
                    <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Description"
                            value={expense.description}
                            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={expense.amount}
                            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="date"
                            value={expense.date}
                            onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        
                        {/* Category Dropdown */}
                        <div className="flex flex-col space-y-2">
                            <select
                                value={expense.category}
                                onChange={(e) => setExpense({ ...expense, category: e.target.value })}
                                className="p-3 w-full border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Category</option>
                                {customCategories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Add New Category */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Add New Category"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="p-3 w-full border border-gray-300 rounded-lg"
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="bg-yellow-600 text-white p-3 rounded-lg"
                                >
                                    Add Category
                                </button>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleAddExpense}
                            className="w-full bg-yellow-600 text-white p-3 rounded-lg mt-4"
                        >
                            Add Expense
                        </button>
                    </div>
                </div>

                {/* Total Expenses Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Total Expenses ({filter})</h2>
                        <p className="text-2xl font-semibold text-red-500">${totalExpenses.toFixed(2)}</p>
                    </div>
                </div>

                {/* Expense List Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-6">Expense History</h2>
                    <ul className="space-y-4">
                        {filteredExpenses.map((exp, index) => (
                            <li key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">{exp.description}</p>
                                    <p className="text-sm text-gray-600 italic">{exp.category}</p>
                                </div>
                                <p className="text-red-500 font-semibold">-${exp.amount}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Expense;
