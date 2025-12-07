import { Router } from "express";
import auth from "../../middleware/auth";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", auth("admin"), vehiclesController.createVehicles)

router.get("/", vehiclesController.getAllVehicles)

router.get("/:vehicleId", vehiclesController.getSingleVehicle)

export const vehicleRoutes = router;