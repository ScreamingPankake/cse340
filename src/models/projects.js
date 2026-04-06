import db from './db.js';

const getAllProjects = async () => {
  const query = `
    SELECT 
        p.project_id, 
        p.organization_id, 
        p.title, 
        p.description, 
        p.location, 
        p.date, 
        o.name AS organization_name
    FROM public.projects p
    JOIN organizations o
      ON p.organization_id = o.organization_id
    WHERE p.date >= NOW()
    ORDER BY p.date
    LIMIT 5;
    `;

  const result = await db.query(query);
  return result.rows;
}

const getProjectById = async (projectId) => {
  const query = `
      SELECT
        p.project_id,
        p.organization_id,
        p.title,
        p.description,
        p.location,
        p.date,
        o.name AS organization_name,
        o.description AS organization_description,
        o.email AS organization_email,
        o.logofile AS organization_logo_filename
      FROM projects p
      JOIN organizations o ON p.organization_id = o.organization_id
      WHERE p.project_id = $1;
    `;

  const query_params = [projectId];
  const result = await db.query(query, query_params);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM projects
        WHERE organization_id = $1
        ORDER BY date;
      `;

  const query_params = [organizationId];
  const result = await db.query(query, query_params);

  return result.rows;
};

const createProject = async (organizationId, title, description, location, date) => {
  const query = `
    INSERT INTO projects (organization_id, title, description, location, date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;
  
  const query_params = [organizationId, title, description, location, date];
  const result = await db.query(query, query_params);
  
  return result.rows[0].project_id;
};

const updateProject = async (projectId, organizationId, title, description, location, date) => {
  const query = `
    UPDATE projects
    SET organization_id = $1, title = $2, description = $3, location = $4, date = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;
  
  const query_params = [organizationId, title, description, location, date, projectId];
  const result = await db.query(query, query_params);
  
  return result.rows.length > 0;
};

export { getAllProjects, getProjectById, getProjectsByOrganizationId, createProject, updateProject };