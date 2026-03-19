import { getAllProjects } from '../models/projects.js';


const projectsPage = async (req, res) => {

  const projects = await getAllProjects();
  console.log('Projects retrieved:', projects);

  const title = 'Projects';
  res.render('projects', { title, projects });
};


export { projectsPage };