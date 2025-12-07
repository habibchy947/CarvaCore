import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingsController } from "./bookings.controller";

const router = Router();

router.post("/", auth("admin","customer"), bookingsController.createBookings);

router.get("/", auth("admin", "customer"), bookingsController.getAllBooking);

router.put("/:bookingId", auth("admin", "customer"), bookingsController.updateBooking)

export const bookingRoutes = router;