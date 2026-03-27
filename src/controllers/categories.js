import { getAllCategories, getCategoryById, getProjectsByCategoryId, createCategory, updateCategory } from '../models/categories.js';

const validateCategoryName = (category_name) => {
  const errors = [];

  if (!category_name || category_name.trim().length === 0) {
    errors.push('Category name is required.');
  } else {
    const trimmed = category_name.trim();
    if (trimmed.length < 3) {
      errors.push('Category name must be at least 3 characters.');
    }
    if (trimmed.length > 100) {
      errors.push('Category name must be 100 characters or fewer.');
    }
  }

  return errors;
};

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
  const categoryName = req.body.category_name;
  const errors = validateCategoryName(categoryName);

  if (errors.length > 0) {
    return res.status(400).render('new-category', {
      title: 'Create New Category',
      errors,
      category: { category_name: categoryName }
    });
  }

  try {
    await createCategory(categoryName.trim());
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
  const categoryName = req.body.category_name;
  const errors = validateCategoryName(categoryName);

  if (errors.length > 0) {
    return res.status(400).render('edit-category', {
      title: 'Edit Category',
      errors,
      category: { category_id: categoryId, category_name: categoryName }
    });
  }

  try {
    const updated = await updateCategory(categoryId, categoryName.trim());
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
  updateCategoryPage
};