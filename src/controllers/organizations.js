import { body, validationResult } from 'express-validator';
import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required.')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required.')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters.'),
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required.')
        .isEmail()
        .withMessage('Please provide a valid email address.')
];

const organizationsPage = async (req, res) => {

    const organizations = await getAllOrganizations();

    const title = 'Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res, next) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    
    if (!organizationDetails) {
        const err = new Error('Organization not found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    
    const title = 'Organization Details';
    res.render('organization', {title, organizationDetails, projects});
};

const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', { 
        title: 'Create New Organization', 
        organization: {}, 
        errors: [] 
    });
};

const processNewOrganizationForm = async (req, res, next) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - convert to error messages
        const errors = results.array().map(err => err.msg);
        return res.status(400).render('new-organization', {
            title: 'Create New Organization',
            errors,
            organization: req.body
        });
    }

    try {
        const { name, description, email } = req.body;
        const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

        const organizationId = await createOrganization(name, description, email, logoFilename);
        res.redirect(`/organization/${organizationId}`);
    } catch (err) {
        next(err);
    }
};

const showEditOrganizationForm = async (req, res, next) => {
    const organizationId = req.params.id;
    const organization = await getOrganizationDetails(organizationId);

    if (!organization) {
        const err = new Error('Organization not found');
        err.status = 404;
        return next(err);
    }

    res.render('edit-organization', { 
        title: 'Edit Organization', 
        organization, 
        errors: [] 
    });
};

const processEditOrganizationForm = async (req, res, next) => {
    const organizationId = req.params.id;
    
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - convert to error messages
        const errors = results.array().map(err => err.msg);
        return res.status(400).render('edit-organization', {
            title: 'Edit Organization',
            errors,
            organization: { organization_id: organizationId, ...req.body }
        });
    }

    try {
        const { name, description, email } = req.body;

        const updated = await updateOrganization(organizationId, name, description, email);
        if (!updated) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }

        res.redirect(`/organization/${organizationId}`);
    } catch (err) {
        next(err);
    }
};

export { 
    organizationsPage, 
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};