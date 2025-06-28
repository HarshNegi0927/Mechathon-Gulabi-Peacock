import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, AlertCircle, DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';

const BudgetReport = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];
  const CHART_COLORS = {
    primary: '#0ea5e9',
    secondary: '#22c55e',
    accent: '#f59e0b'
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('https://mechathon-gulabi-peacock-8.onrender.com/api/budget/report/aggregate', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }

      const data = await response.json();
      setBudgets(data);
      setSelectedBudget(data[0]);
      setError(null);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError('Failed to load budgets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const LoadingState = () => (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const overviewData = [
    {
      title: "Total Budget",
      amount: selectedBudget?.totalAllocated || 0,
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-sky-500",
      textColor: "text-sky-500",
      percentage: 100
    },
    {
      title: "Total Spent",
      amount: selectedBudget?.totalSpent || 0,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      percentage: ((selectedBudget?.totalSpent || 0) / (selectedBudget?.totalAllocated || 1)) * 100
    },
    {
      title: "Remaining",
      amount: (selectedBudget?.totalAllocated || 0) - (selectedBudget?.totalSpent || 0),
      icon: <TrendingDown className="h-6 w-6" />,
      color: "bg-amber-500",
      textColor: "text-amber-500",
      percentage: ((selectedBudget?.totalAllocated - selectedBudget?.totalSpent) / selectedBudget?.totalAllocated) * 100
    }
  ];

  const pieChartData = selectedBudget?.categories?.map(category => ({
    name: category.name,
    value: category.spent,
    percentage: (category.spent / selectedBudget.totalSpent) * 100
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900">Budget Report</CardTitle>
                <CardDescription className="text-gray-500">Select a budget period to view details</CardDescription>
              </div>
              <Select
                value={selectedBudget?._id}
                onValueChange={(value) => {
                  const selected = budgets.find(budget => budget._id === value);
                  setSelectedBudget(selected);
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map(budget => (
                    <SelectItem key={budget._id} value={budget._id}>
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{budget.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {overviewData.map((item, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">{item.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${item.color} bg-opacity-10`}>
                    {React.cloneElement(item.icon, { className: `h-5 w-5 ${item.textColor}` })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(item.amount)}
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  <div className="text-sm text-gray-500">
                    {formatPercentage(item.percentage)} of total budget
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Spending Distribution</CardTitle>
                <PieChartIcon className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
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
                    <Tooltip
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 shadow-lg rounded-lg border">
                              <p className="text-sm font-medium text-gray-900">{data.name}</p>
                              <p className="text-sm text-gray-500">{formatCurrency(data.value)}</p>
                              <p className="text-sm text-gray-500">{formatPercentage(data.percentage)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
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

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Category Analysis</CardTitle>
                <BarChart className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedBudget?.categories || []}>
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
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-white p-2 shadow-lg rounded-lg border">
                              <p className="text-sm font-medium text-gray-900">{label}</p>
                              {payload.map((item, index) => (
                                <p key={index} className="text-sm" style={{ color: item.color }}>
                                  {item.name}: {formatCurrency(item.value)}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="allocatedAmount" 
                      fill={CHART_COLORS.primary} 
                      name="allocatedAmount"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="spent" 
                      fill={CHART_COLORS.secondary} 
                      name="Spent"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Category Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">allocatedAmount</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Spent</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Remaining</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBudget?.categories?.map((category, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-4 text-sm text-gray-900">{category.name}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">{formatCurrency(category.allocatedAmount)}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">{formatCurrency(category.spent)}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-900">{formatCurrency(category.allocatedAmount - category.spent)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Progress 
                            value={(category.spent / category.allocatedAmount) * 100} 
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">
                            {formatPercentage((category.spent / category.allocatedAmount) * 100)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetReport;