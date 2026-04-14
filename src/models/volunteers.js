import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
    INSERT INTO public.project_volunteers (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING;
  `;

    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
    DELETE FROM public.project_volunteers
    WHERE user_id = $1 AND project_id = $2;
  `;

    await db.query(query, [userId, projectId]);
};

const isVolunteer = async (userId, projectId) => {
    const query = `
    SELECT EXISTS (
      SELECT 1
      FROM public.project_volunteers
      WHERE user_id = $1 AND project_id = $2
    ) AS is_volunteer;
  `;

    const result = await db.query(query, [userId, projectId]);
    return result.rows[0]?.is_volunteer === true;
};

const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.date,
      o.name AS organization_name
    FROM public.project_volunteers pv
    JOIN public.projects p ON pv.project_id = p.project_id
    JOIN public.organizations o ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.date;
  `;

    const result = await db.query(query, [userId]);
    return result.rows;
};

export { addVolunteer, removeVolunteer, isVolunteer, getVolunteerProjectsByUserId };