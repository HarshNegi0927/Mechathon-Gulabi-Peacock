import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, PiggyBank, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, Plus, CalendarIcon, PieChartIcon, BarChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);
};

const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

const FinancialDashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/budget/report/aggregate', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (err) {
      setError('Failed to load budget data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const totalBudget = budgets.reduce((acc, budget) => 
    acc + budget.categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0), 0
  );
  const totalSpent = budgets.reduce((acc, budget) => 
    acc + budget.categories.reduce((sum, cat) => sum + cat.spent, 0), 0
  );
  const totalRemaining = totalBudget - totalSpent;

  const overviewCards = [
    {
      title: "Total Budget",
      value: totalBudget,
      icon: Wallet,
      change: "+12.5%",
      positive: true,
      color: "text-blue-500"
    },
    {
      title: "Total Spent",
      value: totalSpent,
      icon: PiggyBank,
      change: formatCurrency(totalSpent),
      positive: false,
      color: "text-red-500"
    },
    {
      title: "Remaining Balance",
      value: totalRemaining,
      icon: TrendingUp,
      change: formatCurrency(totalRemaining),
      positive: true,
      color: "text-green-500"
    },
    {
      title: "Active Budgets",
      value: budgets.length,
      icon: Clock,
      change: `${budgets.length} active`,
      color: "text-purple-500"
    }
  ];

  const pieChartData = budgets.reduce((acc, budget) => {
    budget.categories.forEach(cat => {
      acc.push({
        name: cat.name,
        value: cat.spent,
        percentage: (cat.spent / totalSpent) * 100
      });
    });
    return acc;
  }, []);

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];

  const expenseTrend = budgets.map(budget => ({
    name: budget.name,
    spent: budget.categories.reduce((sum, cat) => sum + cat.spent, 0),
    allocated: budget.categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0)
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-500">Track your expenses and savings</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Budget
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gray-100 ${card.color}`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    {card.change && (
                      <div className={`flex items-center ${card.positive ? 'text-green-500' : 'text-red-500'}`}>
                        {card.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        <span className="text-sm font-medium">{card.change}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.title === 'Active Budgets' ? card.value : formatCurrency(card.value)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Spending Distribution</CardTitle>
                <PieChartIcon className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    value: {
                      label: "Value",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={2}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {pieChartData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm text-gray-400">({formatPercentage(item.percentage)})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Budget Trend</CardTitle>
                <BarChartIcon className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    allocated: {
                      label: "Allocated",
                      color: "hsl(var(--chart-1))",
                    },
                    spent: {
                      label: "Spent",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="name" 
                        className="text-xs"
                        tick={{ fill: '#666' }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fill: '#666' }}
                        tickFormatter={formatCurrency}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="allocated" 
                        fill="var(--color-allocated)" 
                        name="Allocated"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="spent" 
                        fill="var(--color-spent)" 
                        name="Spent"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Category Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgets.map(budget => (
                budget.categories.map((category, index) => (
                  <div key={`${budget._id}-${index}`} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{category.name}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(category.spent)} / {formatCurrency(category.allocatedAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={(category.spent / category.allocatedAmount) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {formatPercentage((category.spent / category.allocatedAmount) * 100)} used
                    </p>
                  </div>
                ))
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;

