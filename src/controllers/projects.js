import { getAllProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

  const title = `Project: ${project.title}`;
  res.render('project', { title, project, categories });
};

export { projectsPage, projectDetailsPage };