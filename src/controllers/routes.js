import express from 'express';

import { homePage } from './index.js';
import { organizationsPage } from './organizations.js';
import { projectsPage, projectDetailsPage } from './projects.js';
import { categoriesPage, categoryDetailsPage } from './categories.js';
import { testErrorPage } from './errors.js';
import { showOrganizationDetailsPage } from './organizations.js';

const router = express.Router();

router.get('/', homePage);
router.get('/organizations', organizationsPage);
router.get('/projects', projectsPage);
router.get('/project/:id', projectDetailsPage);
router.get('/categories', categoriesPage);
router.get('/category/:id', categoryDetailsPage);
router.get('/test-error', testErrorPage);
router.get('/organization/:id', showOrganizationDetailsPage);

export default router;