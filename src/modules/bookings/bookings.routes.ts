import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingsController } from "./bookings.controller";

const router = Router();

router.post("/", auth("admin","customer"), bookingsController.createBookings)

export const bookingRoutes = router;