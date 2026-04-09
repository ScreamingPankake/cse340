import { body, validationResult } from 'express-validator';
import { getAllProjects, getProjectById, getProjectsByOrganizationId, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { addVolunteer, removeVolunteer, isVolunteer, getUserVolunteerProjects } from '../models/volunteers.js';

// Define validation and sanitization rules for project form
const projectValidation = [
    body('organization_id')
        .notEmpty()
        .withMessage('Organization is required.')
        .trim(),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required.')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required.')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters.'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required.')
        .isLength({ max: 200 })
        .withMessage('Project location cannot exceed 200 characters.'),
    body('date')
        .notEmpty()
        .withMessage('Project date is required.')
        .isISO8601()
        .withMessage('Please provide a valid date.')
];

const projectsPage = async (req, res) => {
  const projects = await getAllProjects();
  console.log('Projects retrieved:', projects);

  const title = 'Projects';
  res.render('projects', { title, projects });
};

const projectDetailsPage = async (req, res, next) => {
  const projectId = req.params.id;

  const project = await getProjectById(projectId);
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    return next(err);
  }

  const categories = await getCategoriesByProjectId(projectId);
  
  // Check if current user is volunteering for this project
  let isUserVolunteering = false;
  if (req.session.user) {
    const volunteerRecord = await isVolunteer(req.session.user.user_id, projectId);
    isUserVolunteering = volunteerRecord !== null;
  }

  const title = `Project: ${project.title}`;
  res.render('project', { title, project, categories, isUserVolunteering });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('new-project', { 
        title: 'Create New Project', 
        project: {},
        organizations,
        errors: [] 
    });
};

const processNewProjectForm = async (req, res, next) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - convert to error messages
        const errors = results.array().map(err => err.msg);
        const organizations = await getAllOrganizations();
        return res.status(400).render('new-project', {
            title: 'Create New Project',
            errors,
            project: req.body,
            organizations
        });
    }

    try {
        const { organization_id, title, description, location, date } = req.body;

        const projectId = await createProject(organization_id, title, description, location, date);
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

const showEditProjectForm = async (req, res, next) => {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    const organizations = await getAllOrganizations();

    if (!project) {
        const err = new Error('Project not found');
        err.status = 404;
        return next(err);
    }

    res.render('edit-project', { 
        title: 'Edit Project', 
        project,
        organizations,
        errors: [] 
    });
};

const processEditProjectForm = async (req, res, next) => {
    const projectId = req.params.id;
    
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - convert to error messages
        const errors = results.array().map(err => err.msg);
        const organizations = await getAllOrganizations();
        return res.status(400).render('edit-project', {
            title: 'Edit Project',
            errors,
            project: { project_id: projectId, ...req.body },
            organizations
        });
    }

    try {
        const { organization_id, title, description, location, date } = req.body;

        const updated = await updateProject(projectId, organization_id, title, description, location, date);
        if (!updated) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

const volunteerForProject = async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.session.user.user_id;

  try {
    // Check if user is already volunteering
    const existingVolunteer = await isVolunteer(userId, projectId);
    if (existingVolunteer) {
      req.session.flash = { type: 'info', message: 'You are already volunteering for this project.' };
      return res.redirect(`/project/${projectId}`);
    }

    // Add volunteer
    await addVolunteer(userId, projectId);
    req.session.flash = { type: 'success', message: 'You have successfully volunteered for this project!' };
    res.redirect(`/project/${projectId}`);
  } catch (err) {
    next(err);
  }
};

const removeVolunteerFromProject = async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.session.user.user_id;

  try {
    const removed = await removeVolunteer(userId, projectId);
    if (removed) {
      req.session.flash = { type: 'success', message: 'You have been removed as a volunteer from this project.' };
    } else {
      req.session.flash = { type: 'info', message: 'You were not volunteering for this project.' };
    }
    res.redirect(`/project/${projectId}`);
  } catch (err) {
    next(err);
  }
};

const showDashboard = async (req, res, next) => {
  const userId = req.session.user.user_id;

  try {
    const volunteerProjects = await getUserVolunteerProjects(userId);
    const title = 'My Dashboard';
    res.render('dashboard', { title, volunteerProjects });
  } catch (err) {
    next(err);
  }
};

export { 
    projectsPage, 
    projectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
    volunteerForProject,
    removeVolunteerFromProject,
    showDashboard
};