import { getAllUsers } from '../models/users.js';

const usersPage = async (req, res) => {
  const users = await getAllUsers();
  res.render('users', { title: 'Registered Users', users });
};

export { usersPage };