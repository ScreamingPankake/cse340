import bcrypt from 'bcrypt';
import db from './db.js';

const getUserByEmail = async (email) => {
    const query = `
    SELECT user_id, full_name, email, password_hash
    FROM public.users
    WHERE email = $1;
  `;

    const result = await db.query(query, [email.toLowerCase()]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getUserById = async (userId) => {
    const query = `
    SELECT user_id, full_name, email
    FROM public.users
    WHERE user_id = $1;
  `;

    const result = await db.query(query, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const createUser = async ({ fullName, email, password }) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const query = `
    INSERT INTO public.users (full_name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING user_id, full_name, email;
  `;

    const result = await db.query(query, [fullName, email.toLowerCase(), passwordHash]);
    return result.rows[0];
};

const verifyUser = async (email, password) => {
    const user = await getUserByEmail(email);
    if (!user) {
        return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
};

export { getUserByEmail, getUserById, createUser, verifyUser };