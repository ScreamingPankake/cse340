import db from './db.js';

// Get all categories for projects
const getAllCategories = async () => {
  const query = `
    SELECT DISTINCT
      c.category_id,
      c.category_name
    FROM categories c
    ORDER BY c.category_name;
  `;

  const result = await db.query(query);
  return result.rows; // [{ category_id, category_name }, ...]
}

const getCategoryById = async (categoryId) => {
  const query = `
    SELECT
      category_id,
      category_name
    FROM categories
    WHERE category_id = $1;
  `;

  const query_params = [categoryId];
  const result = await db.query(query, query_params);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT
      c.category_id,
      c.category_name
    FROM project_categories pc
    JOIN categories c ON pc.category_id = c.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_name;
  `;

  const query_params = [projectId];
  const result = await db.query(query, query_params);

  return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.date,
      o.name AS organization_name
    FROM project_categories pc
    JOIN projects p ON pc.project_id = p.project_id
    JOIN organizations o ON p.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY p.date;
  `;

  const query_params = [categoryId];
  const result = await db.query(query, query_params);

  return result.rows;
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId };