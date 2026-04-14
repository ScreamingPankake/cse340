import { getAllProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { addVolunteer, removeVolunteer, isVolunteer } from '../models/volunteers.js';

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
  const userId = req.session?.user?.id;
  const volunteerStatus = userId ? await isVolunteer(userId, projectId) : false;

  const title = `Project: ${project.title}`;
  res.render('project', { title, project, categories, isVolunteer: volunteerStatus });
};

const volunteerForProject = async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.session?.user?.id;

  if (!userId) {
    const err = new Error('Authentication required');
    err.status = 401;
    return next(err);
  }

  await addVolunteer(userId, projectId);
  res.redirect(`/project/${projectId}`);
};

const removeVolunteerFromProject = async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.session?.user?.id;

  if (!userId) {
    const err = new Error('Authentication required');
    err.status = 401;
    return next(err);
  }

  await removeVolunteer(userId, projectId);
  res.redirect(req.get('Referrer') || '/dashboard');
};

export { projectsPage, projectDetailsPage, volunteerForProject, removeVolunteerFromProject };