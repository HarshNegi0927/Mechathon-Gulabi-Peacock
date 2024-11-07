import React, { useState } from 'react';

function Budget() {
    const [budgets, setBudgets] = useState([
        { category: 'Food', total: 500, spent: 0 },
        { category: 'Entertainment', total: 300, spent: 0 },
        { category: 'Utilities', total: 200, spent: 0 },
        { category: 'Transportation', total: 150, spent: 0 }
    ]);
    const [newBudget, setNewBudget] = useState({ category: '', total: '' });
    const [newExpense, setNewExpense] = useState({ category: '', amount: '' });
    
    // Handle adding a new budget
    const handleAddBudget = () => {
        if (newBudget.category && newBudget.total) {
            setBudgets([...budgets, { category: newBudget.category, total: parseFloat(newBudget.total), spent: 0 }]);
            setNewBudget({ category: '', total: '' });
        }
    };

    // Handle adding an expense to a category
    const handleAddExpense = () => {
        const updatedBudgets = budgets.map((budget) => {
            if (budget.category === newExpense.category) {
                budget.spent += parseFloat(newExpense.amount);
            }
            return budget;
        });
        setBudgets(updatedBudgets);
        setNewExpense({ category: '', amount: '' });
    };

    // Calculate total budget and total spent
    const totalBudget = budgets.reduce((total, budget) => total + budget.total, 0);
    const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0);
    const totalRemaining = totalBudget - totalSpent;

    return (
        <div className="w-full min-h-screen bg-gray-100 text-gray-800 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-yellow-600">Budget Tracker</h1>
                    <p className="text-lg text-gray-600">Set your budget goals and track your spending progress by category.</p>
                </div>

                {/* Budget Set Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
                    <h2 className="text-2xl font-bold mb-6">Set New Budget</h2>
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Category"
                                value={newBudget.category}
                                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="number"
                                placeholder="Budget Amount"
                                value={newBudget.total}
                                onChange={(e) => setNewBudget({ ...newBudget, total: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <button
                            onClick={handleAddBudget}
                            className="w-full bg-yellow-600 text-white p-3 rounded-lg mt-4"
                        >
                            Set Budget
                        </button>
                    </div>
                </div>

                {/* Budget Overview Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
                    <h2 className="text-2xl font-bold mb-6">Budget Overview</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-semibold text-gray-800">Total Budget</p>
                            <p className="text-xl font-semibold text-green-500">${totalBudget.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-semibold text-gray-800">Total Spent</p>
                            <p className="text-xl font-semibold text-red-500">${totalSpent.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-semibold text-gray-800">Remaining Budget</p>
                            <p className="text-xl font-semibold text-blue-500">${totalRemaining.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Budget Progress Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
                    <h2 className="text-2xl font-bold mb-6">Budget Progress</h2>
                    {budgets.map((budget, index) => (
                        <div key={index} className="mb-4">
                            <p className="text-lg font-semibold text-gray-800">{budget.category}</p>
                            <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full"
                                    style={{
                                        width: `${(budget.spent / budget.total) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-center mt-2">{((budget.spent / budget.total) * 100).toFixed(0)}% of your budget used</p>
                        </div>
                    ))}
                </div>

                {/* Add Expense Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
                    <h2 className="text-2xl font-bold mb-6">Add Expense</h2>
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <select
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Category</option>
                                {budgets.map((budget, index) => (
                                    <option key={index} value={budget.category}>{budget.category}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <button
                            onClick={handleAddExpense}
                            className="w-full bg-yellow-600 text-white p-3 rounded-lg mt-4"
                        >
                            Add Expense
                        </button>
                    </div>
                </div>

                {/* Budget History Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-6">Budget History</h2>
                    <ul className="space-y-4">
                        {budgets.map((budget, index) => (
                            <li key={index} className="flex justify-between py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg">
                                <p className="text-lg font-semibold text-gray-800">{budget.category}</p>
                                <p className="text-red-500 font-semibold">Spent: ${budget.spent.toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Budget;
