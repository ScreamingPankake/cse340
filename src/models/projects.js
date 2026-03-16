import db from './db.js';

const getAllProjects = async () => {
    const query = `
    Select project_id, organization_id, title, description, location, date, organizations.name as organization_name
    FROM public.projects
    JOIN organizations
    ON projects.organization_id = organizations.organization_id`;
    
    const result = await db.query(query);
    return result.rows;
}

export { getAllProjects };