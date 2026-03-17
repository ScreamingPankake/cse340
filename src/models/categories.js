import db from './db.js';

// Get all categories for projects
const getCategoriesByProject = async () => {
  const query = `
    SELECT DISTINCT
      pc.project_id,
      c.category_id,
      c.category_name
    FROM project_categories pc
    JOIN categories c ON pc.category_id = c.category_id
    ORDER BY pc.project_id;
  `;

  const result = await db.query(query);
  return result.rows; // [{ project_id, category_id, category_name }, ...]
}

export { getCategoriesByProject };