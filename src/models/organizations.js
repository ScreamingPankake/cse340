import db from './db.js';

const getAllOrganizations = async () => {
    const query = `
    Select organization_id, name, description, email, logofile
    FROM public.organizations
    `;
    
    const result = await db.query(query);
    return result.rows;
}

export { getAllOrganizations };