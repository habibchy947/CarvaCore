import { Router } from "express";
import { userController } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router()

// get all users
router.get("/", auth("admin"), userController.getAllusers)

export const userRoutes = router;