const Budget = require("../models/Budget");

exports.createBudget = async (req, res) => {
    try {
        const { name, description, startDate, endDate, categories } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return res.status(400).json({
                message: "End date must be after start date",
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                message: "At least one category is required",
            });
        }

        const budget = new Budget({
            userId: req.user._id,
            name,
            description,
            startDate: start,
            endDate: end,
            categories: categories.map((category) => ({
                name: category.name,
                allocatedAmount: category.allocatedAmount,
                spent: category.spent || 0,
            })),
        });
        console.log(budget);
        await budget.save();

        res.status(201).json({
            message: "Budget created successfully",
            budget,
        });
    } catch (error) {
        console.error("Error creating budget:", error);
        res.status(500).json({
            message: "Error creating budget",
            error: error.message,
        });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({
            userId: req.user._id,
            status: { $ne: "archived" },
        }).sort({ createdAt: -1 });
        return res.status(200).send(budgets);
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({
            message: "Error fetching budgets",
            error: error.message,
        });
    }
};

exports.getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.budgetId,
            userId: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found",
            });
        }

        res.json(budget);
    } catch (error) {
        console.error("Error fetching budget:", error);
        res.status(500).json({
            message: "Error fetching budget",
            error: error.message,
        });
    }
};

exports.updateCategorySpent = async (req, res) => {
    try {
        const { categoryName, amount, budgetId } = req.body;
        if(amount === undefined || categoryName == undefined){
            return
        }
        // Find the specific budget by ID and ensure it's active
        const activeBudget = await Budget.findOne({
            _id: budgetId,
            status: { $ne: "archive" }
        });

        console.log(budgetId);
        console.log(amount);
        console.log(activeBudget);
        // console.log(categoryName)
        if (!activeBudget) {
            return res.status(404).json({
                message: "No active budget found for the provided ID",
            });
        }

        // Find the category in the budget
        const category = activeBudget.categories.find(
            (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        
        console.log(category)
        if (category) {
            if (!category.spent) category.spent = 0;

            // Update the spent amount
            category.spent += Number(amount);

            // Save the updated budget
            await activeBudget.save();

            return res.json({
                message: "Category updated successfully",
                updatedBudget: activeBudget,
            });
        }

        return res.status(404).json({
            message: "No matching category found in the active budget",
        });
    } catch (error) {
        console.error("Error updating category spent:", error);
        res.status(500).json({
            message: "Error updating category spent",
            error: error.message,
        });
    }
};


exports.archiveBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndUpdate(
            {
                _id: req.params.budgetId,
                userId: req.user._id,
            },
            { status: "archived" },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found",
            });
        }

        res.json({
            message: "Budget archived successfully",
            budget,
        });
    } catch (error) {
        console.error("Error archiving budget:", error);
        res.status(500).json({
            message: "Error archiving budget",
            error: error.message,
        });
    }
};

exports.editBudget = async (req, res) => {
    const { budgetId } = req.params;
    const updatedBudget = req.body;

    try {
        const budget = await Budget.findByIdAndUpdate(budgetId, updatedBudget, {
            new: true,
        });
        if (!budget) return res.status(404).json({ message: "Budget not found" });
        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: "Error updating budget" });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const userId = req.user._id;
        const budgets = await Budget.find({ userId, status: "active" });

        if (!budgets || budgets.length === 0) {
            return res
                .status(404)
                .json({ message: "No active budgets found for the user" });
        }

        const allCategories = budgets.flatMap((budget) => budget.categories);

        const uniqueCategories = allCategories.filter(
            (category, index, self) =>
                index === self.findIndex((c) => c.name === category.name)
        );

        res.json(uniqueCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};

exports.updateBudgetFromExpense = async (userId, expenseData) => {
    try {
        const budget = await Budget.find({
            budgetIdId,
            status: "active",
            startDate: { $lte: new Date(expenseData.date) },
            endDate: { $gte: new Date(expenseData.date) },
        });

        if (!budget) {
            console.log("No active budget found for this date range");
            return null;
        }

        const category = budget.categories.find(
            (cat) => cat.name === expenseData.category
        );
        if (!category) {
            console.log("Category not found in budget");
            return null;
        }

        category.spent += parseFloat(expenseData.amount);
        await budget.save();

        return budget;
    } catch (error) {
        console.error("Error updating budget from expense:", error);
        throw error;
    }
};

exports.handleExpenseCreated = async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;
        const userId = req.user._id;

        await exports.updateBudgetFromExpense(userId, {
            description,
            amount,
            category,
            date,
        });

        res.status(200).json({ message: "Budget updated successfully" });
    } catch (error) {
        console.error("Error handling expense creation:", error);
        res.status(500).json({
            message: "Error updating budget from expense",
            error: error.message,
        });
    }
};
exports.getBudgetReport = async (req, res) => {
    try {
        // Fetch all active budgets for the logged-in user
        const budgets = await Budget.find({
            userId: req.user._id, // Filter by user ID
            status: { $ne: "archived" }, // Only fetch budgets that are not archived
        }).sort({ startDate: -1 }); // Sort by startDate (most recent first)

        // Debugging: Log fetched budgets to ensure multiple active budgets exist
        console.log("Fetched Active Budgets:", budgets);

        // If no active budgets found for the user, return a response indicating that
        if (budgets.length === 0) {
            return res.status(404).json({
                message: "No active budgets found for this user.",
            });
        }

        // Process the fetched active budgets
        const budgetReports = budgets.map((budget) => {
            const totalAllocated = budget.categories.reduce(
                (sum, category) => sum + category.allocatedAmount,
                0
            );
            const totalSpent = budget.categories.reduce(
                (sum, category) => sum + (category.spent || 0),
                0
            );

            return {
                _id: budget._id,
                name: budget.name,
                description: budget.description,
                startDate: budget.startDate,
                endDate: budget.endDate,
                totalAllocated,
                totalSpent,
                totalRemaining: totalAllocated - totalSpent,
                spentPercentage: ((totalSpent / totalAllocated) * 100).toFixed(1),
                categories: budget.categories.map((category) => ({
                    name: category.name,
                    allocatedAmount: category.allocatedAmount,
                    spent: category.spent || 0,
                    remaining: category.allocatedAmount - (category.spent || 0),
                    spentPercentage: (
                        ((category.spent || 0) / category.allocatedAmount) *
                        100
                    ).toFixed(1),
                })),
            };
        });

        res.json(budgetReports);
    } catch (error) {
        console.error("Error fetching active budget reports:", error);
        res.status(500).json({
            message: "Error fetching active budget reports.",
            error: error.message,
        });
    }
};
