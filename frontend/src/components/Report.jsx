import React from 'react';

function Report() {
    return (
        <div className="w-full min-h-screen bg-gray-100 text-gray-800 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-600">Financial Report</h1>
                    <p className="text-lg text-gray-600">A detailed report of your financial activity, trends, and suggestions.</p>
                </div>

                {/* Main Report Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

                    {/* Expense Summary Section */}
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Expense Summary</h2>
                        <ul>
                            <li className="flex justify-between py-2 border-b">
                                <span>Food</span>
                                <span className="text-red-500">-$300</span>
                            </li>
                            <li className="flex justify-between py-2 border-b">
                                <span>Entertainment</span>
                                <span className="text-red-500">-$150</span>
                            </li>
                            <li className="flex justify-between py-2 border-b">
                                <span>Utilities</span>
                                <span className="text-red-500">-$100</span>
                            </li>
                            <li className="flex justify-between py-2">
                                <span>Transportation</span>
                                <span className="text-red-500">-$80</span>
                            </li>
                        </ul>
                    </div>

                    {/* Budget Overview Section */}
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Budget Overview</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-semibold text-gray-800">Total Budget</p>
                                <p className="text-xl font-semibold text-green-500">$1,200</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-semibold text-gray-800">Total Spent</p>
                                <p className="text-xl font-semibold text-red-500">$630</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-semibold text-gray-800">Remaining Budget</p>
                                <p className="text-xl font-semibold text-blue-500">$570</p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Spending Trends Section */}
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Monthly Spending Trends</h2>
                        <div className="h-56 bg-gray-200 flex items-center justify-center">
                            {/* Placeholder for Graph */}
                            <p className="text-gray-500">Graph/Chart will be here</p>
                        </div>
                    </div>

                    {/* Top Spending Categories Section */}
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Top Spending Categories</h2>
                        <ul>
                            <li className="flex justify-between py-2 border-b">
                                <span>Food</span>
                                <span className="text-red-500">-$300</span>
                            </li>
                            <li className="flex justify-between py-2 border-b">
                                <span>Entertainment</span>
                                <span className="text-red-500">-$150</span>
                            </li>
                            <li className="flex justify-between py-2 border-b">
                                <span>Utilities</span>
                                <span className="text-red-500">-$100</span>
                            </li>
                            <li className="flex justify-between py-2 border-b">
                                <span>Transportation</span>
                                <span className="text-red-500">-$80</span>
                            </li>
                        </ul>
                    </div>

                    {/* Expense History Section */}
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Expense History</h2>
                        <ul>
                            <li className="flex justify-between py-2 border-b">
                                <span>Groceries</span>
                                <span className="text-red-500">-$50</span>
                            </li>
                            <li className="flex justify-between py-2 border-b">
                                <span>Movie Tickets</span>
                                <span className="text-red-500">-$30</span>
                            </li>
                            <li className="flex justify-between py-2 border-b">
                                <span>Electricity Bill</span>
                                <span className="text-red-500">-$100</span>
                            </li>
                        </ul>
                    </div>

                    {/* Suggestions for Improvement Section */}
                    <div className="bg-blue-50 p-6 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Suggestions for Improvement</h2>
                        <p className="text-lg text-gray-800">
                            "Consider cutting back on entertainment expenses. You could save up to $100 more this month by switching to a more affordable plan."
                        </p>
                    </div>
                </div>

                {/* Detailed Financial Insights Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-12">
                    <h2 className="text-2xl font-bold mb-4">Financial Insights</h2>
                    <p className="text-lg text-gray-800 mb-4">
                        "You are spending a significant portion of your budget on food and entertainment. Try meal prepping or finding cheaper leisure activities."
                    </p>
                    <p className="text-lg text-gray-800">
                        "Based on your spending habits, consider setting a savings goal for the next month and allocating at least 20% of your income to savings."
                    </p>
                </div>

                {/* Comparison Section */}
                <div className="bg-white p-6 shadow-lg rounded-lg mb-12">
                    <h2 className="text-2xl font-bold mb-4">Comparison: Actual vs Budgeted</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-semibold text-gray-800">Food (Budgeted vs Actual)</p>
                            <p className="text-xl font-semibold text-red-500">Actual: -$300 | Budgeted: -$250</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xl font-semibold text-gray-800">Entertainment (Budgeted vs Actual)</p>
                            <p className="text-xl font-semibold text-red-500">Actual: -$150 | Budgeted: -$120</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;
