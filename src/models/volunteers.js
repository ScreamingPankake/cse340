import db from './db.js';

/**
 * Add a user as a volunteer to a project
 * @param {number} userId - The user ID
 * @param {number} projectId - The project ID
 * @returns {Object} The volunteer record
 */
const addVolunteer = async (userId, projectId) => {
  const query = `
    INSERT INTO volunteers (user_id, project_id)
    VALUES ($1, $2)
    RETURNING volunteer_id, user_id, project_id, volunteered_at;
  `;

  const result = await db.query(query, [userId, projectId]);
  return result.rows[0];
};

/**
 * Remove a user as a volunteer from a project
 * @param {number} userId - The user ID
 * @param {number} projectId - The project ID
 * @returns {boolean} Whether the operation was successful
 */
const removeVolunteer = async (userId, projectId) => {
  const query = `
    DELETE FROM volunteers
    WHERE user_id = $1 AND project_id = $2;
  `;

  const result = await db.query(query, [userId, projectId]);
  return result.rowCount > 0;
};

/**
 * Check if a user is already a volunteer for a project
 * @param {number} userId - The user ID
 * @param {number} projectId - The project ID
 * @returns {Object|null} The volunteer record if exists, null otherwise
 */
const isVolunteer = async (userId, projectId) => {
  const query = `
    SELECT volunteer_id, user_id, project_id, volunteered_at
    FROM volunteers
    WHERE user_id = $1 AND project_id = $2;
  `;

  const result = await db.query(query, [userId, projectId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Get all projects a user has volunteered for
 * @param {number} userId - The user ID
 * @returns {Array} Array of project objects
 */
const getUserVolunteerProjects = async (userId) => {
  const query = `
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.date,
      o.name AS organization_name,
      v.volunteered_at
    FROM volunteers v
    JOIN projects p ON v.project_id = p.project_id
    JOIN organizations o ON p.organization_id = o.organization_id
    WHERE v.user_id = $1
    ORDER BY p.date;
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
};

/**
 * Get all volunteers for a project
 * @param {number} projectId - The project ID
 * @returns {Array} Array of volunteer objects with user info
 */
const getProjectVolunteers = async (projectId) => {
  const query = `
    SELECT
      v.volunteer_id,
      u.user_id,
      u.name,
      u.email,
      v.volunteered_at
    FROM volunteers v
    JOIN users u ON v.user_id = u.user_id
    WHERE v.project_id = $1
    ORDER BY v.volunteered_at;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows;
};

export {
  addVolunteer,
  removeVolunteer,
  isVolunteer,
  getUserVolunteerProjects,
  getProjectVolunteers
};
