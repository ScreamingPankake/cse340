import express from 'express';

import { homePage } from './index.js';
import { 
    organizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './organizations.js';
import { 
    projectsPage, 
    projectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './projects.js';
import {
    categoriesPage,
    categoryDetailsPage,
    newCategoryPage,
    createCategoryPage,
    editCategoryPage,
    updateCategoryPage,
    categoryValidation
} from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

router.get('/', homePage);

// Organization routes
router.get('/organizations', organizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Project routes
router.get('/projects', projectsPage);
router.get('/project/:id', projectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Category routes
router.get('/categories', categoriesPage);
router.get('/category/:id', categoryDetailsPage);
router.get('/new-category', newCategoryPage);
router.post('/new-category', categoryValidation, createCategoryPage);
router.get('/edit-category/:id', editCategoryPage);
router.post('/edit-category/:id', categoryValidation, updateCategoryPage);

// Test error route
router.get('/test-error', testErrorPage);

export default router;