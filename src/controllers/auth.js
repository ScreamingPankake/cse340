import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { createUser, getUserByEmail } from '../models/users.js';

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters.'),
  body('email')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .isLength({ max: 200 })
    .withMessage('Email cannot exceed 200 characters.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be between 8 and 100 characters.'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('Please confirm your password.')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match.')
];

const loginValidation = [
  body('email')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
];

const showRegisterForm = (req, res) => {
  res.render('register', { title: 'Register', formData: {}, errors: [] });
};

const processRegisterForm = async (req, res, next) => {
  const results = validationResult(req);
  const formData = {
    name: req.body.name,
    email: req.body.email
  };

  if (!results.isEmpty()) {
    const errors = results.array().map(err => err.msg);
    return res.status(400).render('register', {
      title: 'Register',
      errors,
      formData
    });
  }

  try {
    const existingUser = await getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).render('register', {
        title: 'Register',
        errors: ['A user with that email address already exists.'],
        formData
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await createUser(req.body.name, req.body.email, passwordHash);

    req.session.user = user;
    req.session.flash = { type: 'success', message: `Welcome, ${user.name}!` };
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login', formData: {}, errors: [] });
};

const processLoginForm = async (req, res, next) => {
  const results = validationResult(req);
  const formData = { email: req.body.email };

  if (!results.isEmpty()) {
    const errors = results.array().map(err => err.msg);
    return res.status(400).render('login', {
      title: 'Login',
      errors,
      formData
    });
  }

  try {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
      return res.status(400).render('login', {
        title: 'Login',
        errors: ['Invalid email or password.'],
        formData
      });
    }

    const passwordMatches = await bcrypt.compare(req.body.password, user.password_hash);
    if (!passwordMatches) {
      return res.status(400).render('login', {
        title: 'Login',
        errors: ['Invalid email or password.'],
        formData
      });
    }

    req.session.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    req.session.flash = { type: 'success', message: `Welcome back, ${user.name}!` };
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

export {
  showRegisterForm,
  processRegisterForm,
  showLoginForm,
  processLoginForm,
  logout,
  registerValidation,
  loginValidation
};