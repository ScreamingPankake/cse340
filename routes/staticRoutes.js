import express from "express"
import baseController from "../controllers/baseController.js"

const router = express.Router()

router.get("/", baseController.buildHome)
router.get("/organizations", baseController.buildOrganizations)
router.get("/projects", baseController.buildProjects)
router.get("/categories", baseController.buildCategories)

export default router