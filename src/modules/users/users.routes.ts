import { Router } from "express";
import { userController } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router()

// get all users
router.get("/", userController.getAllusers);

router.put("/:userId", auth("admin","customer"), userController.updateUser)

export const userRoutes = router;