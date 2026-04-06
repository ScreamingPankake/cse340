import db from './db.js';

const getUserByEmail = async (email) => {
  const query = `
    SELECT user_id, name, email, password_hash, role
    FROM users
    WHERE LOWER(email) = LOWER($1);
  `;

  const result = await db.query(query, [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getUserById = async (userId) => {
  const query = `
    SELECT user_id, name, email, role
    FROM users
    WHERE user_id = $1;
  `;

  const result = await db.query(query, [userId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getAllUsers = async () => {
  const query = `
    SELECT user_id, name, email, role
    FROM users
    ORDER BY name;
  `;

  const result = await db.query(query);
  return result.rows;
};

const createUser = async (name, email, passwordHash, role = 'user') => {
  const query = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, LOWER($2), $3, $4)
    RETURNING user_id, name, email, role;
  `;

  const result = await db.query(query, [name, email, passwordHash, role]);
  return result.rows[0];
};

export { getUserByEmail, getUserById, getAllUsers, createUser };