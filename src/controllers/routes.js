import express from 'express';

import { homePage } from './index.js';
import { organizationsPage } from './organizations.js';
import { projectsPage, projectDetailsPage, volunteerForProject, removeVolunteerFromProject } from './projects.js';
import {
    categoriesPage,
    categoryDetailsPage,
    newCategoryPage,
    createCategoryPage,
    editCategoryPage,
    updateCategoryPage
} from './categories.js';
import { testErrorPage } from './errors.js';
import { showOrganizationDetailsPage } from './organizations.js';
import {
    loginPage,
    loginAction,
    registerPage,
    registerAction,
    logoutPage,
    dashboardPage,
    requireAuth
} from './auth.js';

const router = express.Router();

router.get('/', homePage);
router.get('/organizations', organizationsPage);
router.get('/projects', projectsPage);
router.get('/project/:id', projectDetailsPage);
router.get('/project/:id/volunteer', requireAuth, volunteerForProject);
router.get('/project/:id/remove-volunteer', requireAuth, removeVolunteerFromProject);
router.get('/dashboard', requireAuth, dashboardPage);
router.get('/login', loginPage);
router.post('/login', loginAction);
router.get('/register', registerPage);
router.post('/register', registerAction);
router.get('/logout', logoutPage);
router.get('/categories', categoriesPage);
router.get('/category/:id', categoryDetailsPage);

router.get('/new-category', newCategoryPage);
router.post('/new-category', createCategoryPage);
router.get('/edit-category/:id', editCategoryPage);
router.post('/edit-category/:id', updateCategoryPage);

router.get('/test-error', testErrorPage);
router.get('/organization/:id', showOrganizationDetailsPage);

export default router;