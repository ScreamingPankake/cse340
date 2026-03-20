import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

const categoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  console.log('Categories retrieved:', categories);

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

export { categoriesPage, categoryDetailsPage };