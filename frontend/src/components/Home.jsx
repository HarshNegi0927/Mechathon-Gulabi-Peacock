import React from 'react';

function Home() {
    return (
        <div className="w-full min-h-screen bg-gray-100 text-gray-800 p-6">
            {/* Welcome Message */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-orange-600">Welcome to Your Budget Tracker</h1>
                <p className="text-lg">Track your expenses, set budgets, and achieve your financial goals.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 shadow rounded text-center">
                    <h2 className="text-xl font-semibold">Total Expenses</h2>
                    <p className="text-2xl text-red-500">$1,200</p>
                </div>
                <div className="bg-white p-6 shadow rounded text-center">
                    <h2 className="text-xl font-semibold">Remaining Budget</h2>
                    <p className="text-2xl text-green-500">$800</p>
                </div>
                <div className="bg-white p-6 shadow rounded text-center">
                    <h2 className="text-xl font-semibold">Current Savings</h2>
                    <p className="text-2xl text-blue-500">$3,000</p>
                </div>
                <div className="bg-white p-6 shadow rounded text-center">
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    <p className="text-2xl text-gray-700">5</p>
                </div>
            </div>

            {/* Monthly Budget Overview (Pie Chart Placeholder) */}
            <div className="bg-white p-6 shadow rounded mb-8">
                <h2 className="text-2xl font-bold mb-4">Monthly Budget Overview</h2>
                <div className="w-full h-64 bg-gray-300 rounded flex items-center justify-center">
                    {/* Placeholder for Pie Chart */}
                    <span className="text-gray-600">Pie Chart Here</span>
                </div>
            </div>

            {/* Expense Categories */}
            <div className="bg-white p-6 shadow rounded mb-8">
                <h2 className="text-2xl font-bold mb-4">Expense Categories</h2>
                <ul>
                    <li className="flex justify-between py-2 border-b">
                        <span>Food</span>
                        <span className="text-red-500">-$400</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                        <span>Utilities</span>
                        <span className="text-red-500">-$300</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                        <span>Entertainment</span>
                        <span className="text-red-500">-$150</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                        <span>Others</span>
                        <span className="text-red-500">-$350</span>
                    </li>
                </ul>
            </div>

            {/* Upcoming Bills */}
            <div className="bg-white p-6 shadow rounded mb-8">
                <h2 className="text-2xl font-bold mb-4">Upcoming Bills</h2>
                <ul>
                    <li className="flex justify-between py-2 border-b">
                        <span>Electricity Bill</span>
                        <span className="text-gray-700">Due on 12/11/2024</span>
                    </li>
                    <li className="flex justify-between py-2 border-b">
                        <span>Internet Bill</span>
                        <span className="text-gray-700">Due on 15/11/2024</span>
                    </li>
                </ul>
            </div>

            {/* Budget Progress */}
            <div className="bg-white p-6 shadow rounded mb-8">
                <h2 className="text-2xl font-bold mb-4">Budget Progress</h2>
                <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-center mt-2">60% of your budget used</p>
            </div>

            {/* Tips */}
            <div className="bg-orange-100 p-6 shadow rounded text-center">
                <h2 className="text-xl font-bold mb-2">Financial Tip of the Day</h2>
                <p>"Track every expense to get a clear view of your spending habits!"</p>
            </div>
        </div>
    );
}

export default Home;
