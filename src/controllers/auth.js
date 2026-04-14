import { createUser, getUserByEmail, verifyUser } from '../models/users.js';
import { getVolunteerProjectsByUserId } from '../models/volunteers.js';

const loginPage = async (req, res) => {
    const title = 'Login';
    res.render('login', { title, error: null });
};

const registerPage = async (req, res) => {
    const title = 'Register';
    res.render('register', { title, error: null });
};

const loginAction = async (req, res) => {
    const { email, password } = req.body;

    const user = await verifyUser(email, password);
    if (!user) {
        const title = 'Login';
        return res.status(401).render('login', { title, error: 'Invalid email or password.' });
    }

    req.session.user = {
        id: user.user_id,
        fullName: user.full_name,
        email: user.email
    };

    res.redirect('/dashboard');
};

const registerAction = async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || password !== confirmPassword) {
        const title = 'Register';
        return res.status(400).render('register', { title, error: 'Please fill out all fields and make sure passwords match.' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        const title = 'Register';
        return res.status(400).render('register', { title, error: 'An account already exists for that email.' });
    }

    const user = await createUser({ fullName, email, password });
    req.session.user = {
        id: user.user_id,
        fullName: user.full_name,
        email: user.email
    };

    res.redirect('/dashboard');
};

const logoutPage = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Session destroy error:', error);
        }
        res.redirect('/');
    });
};

const dashboardPage = async (req, res) => {
    const title = 'Dashboard';
    const projects = await getVolunteerProjectsByUserId(req.session.user.id);
    res.render('dashboard', { title, projects });
};

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

export { loginPage, loginAction, registerPage, registerAction, logoutPage, dashboardPage, requireAuth };