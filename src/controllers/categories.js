import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, getProjectsByCategoryId, createCategory, updateCategory } from '../models/categories.js';

// Define validation and sanitization rules for category form
const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters.')
];

const categoriesPage = async (req, res) => {
  const categories = await getAllCategories();

  const title = 'Categories';
  res.render('categories', { title, categories });
};

const categoryDetailsPage = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  const projects = await getProjectsByCategoryId(categoryId);

  const title = `Category: ${category.category_name}`;
  res.render('category', { title, category, projects });
};

const newCategoryPage = (req, res) => {
  res.render('new-category', { title: 'Create New Category', category: {}, errors: [] });
};

const createCategoryPage = async (req, res, next) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - convert to error messages
    const errors = results.array().map(err => err.msg);
    return res.status(400).render('new-category', {
      title: 'Create New Category',
      errors,
      category: { category_name: req.body.category_name }
    });
  }

  try {
    const { category_name } = req.body;
    await createCategory(category_name);
    res.redirect('/categories');
  } catch (err) {
    next(err);
  }
};

const editCategoryPage = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('edit-category', { title: 'Edit Category', category, errors: [] });
};

const updateCategoryPage = async (req, res, next) => {
  const categoryId = req.params.id;
  
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - convert to error messages
    const errors = results.array().map(err => err.msg);
    return res.status(400).render('edit-category', {
      title: 'Edit Category',
      errors,
      category: { category_id: categoryId, category_name: req.body.category_name }
    });
  }

  try {
    const { category_name } = req.body;
    const updated = await updateCategory(categoryId, category_name);
    if (!updated) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }

    res.redirect(`/category/${categoryId}`);
  } catch (err) {
    next(err);
  }
};

export {
  categoriesPage,
  categoryDetailsPage,
  newCategoryPage,
  createCategoryPage,
  editCategoryPage,
  updateCategoryPage,
  categoryValidation
};