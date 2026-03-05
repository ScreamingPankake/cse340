const baseController = {}

baseController.buildHome = async (req, res) => {
  res.render("home", { title: "Home" })
}

baseController.buildOrganizations = async (req, res) => {
  res.render("organizations", { title: "Organizations" })
}

baseController.buildProjects = async (req, res) => {
  res.render("projects", { title: "Service Projects" })
}

baseController.buildCategories = async (req, res) => {
  res.render("categories", { title: "Service Project Categories" })
}

export default baseController