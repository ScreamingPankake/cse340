import db from './db.js';

const getAllOrganizations = async () => {
    const query = `
    Select organization_id, name, description, email, logofile
    FROM public.organizations
    `;
    
    const result = await db.query(query);
    return result.rows;
}

const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        organization_id,
        name,
        description,
        email,
        logofile
      FROM organizations
      WHERE organization_id = $1;
    `;

      const query_params = [organizationId];
      const result = await db.query(query, query_params);

      
      return result.rows.length > 0 ? result.rows[0] : null;
};

const createOrganization = async (name, description, email, logofile) => {
  const query = `
    INSERT INTO organizations (name, description, email, logofile)
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id;
  `;
  
  const query_params = [name, description, email, logofile];
  const result = await db.query(query, query_params);
  
  return result.rows[0].organization_id;
};

const updateOrganization = async (organizationId, name, description, email) => {
  const query = `
    UPDATE organizations
    SET name = $1, description = $2, email = $3
    WHERE organization_id = $4
    RETURNING organization_id;
  `;
  
  const query_params = [name, description, email, organizationId];
  const result = await db.query(query, query_params);
  
  return result.rows.length > 0;
};

export { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization };