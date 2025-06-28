const Category = require('../models/category');

const categoryController = {
    async create(req, res, next) {
        try {
            const category = new Category({
                name: req.body.name
            });
            const savedCategory = await category.save();
            res.status(201).json(savedCategory);
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const categories = await Category.find().select('-__v').sort('name');
            res.json(categories);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = categoryController;