import { Router } from "express";
import auth from "../../middleware/auth";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", auth("admin"), vehiclesController.createVehicles)

router.get("/", vehiclesController.getAllVehicles)

router.get("/:vehicleId", vehiclesController.getSingleVehicle)

router.put("/:vehicleId", auth("admin"), vehiclesController.updateVehicle)

router.delete("/:vehicleId", auth("admin"), vehiclesController.deleteVehicle)
export const vehicleRoutes = router;