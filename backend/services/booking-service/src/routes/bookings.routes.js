import express from "express";
import {
  createBookingHandler,
  getBookingHandler,
  cancelBookingHandler,
  getMyBookingsHandler
} from "../controllers/bookings.controller.js";
import  authenticate  from "../middleware/authenticate.js";

const router = express.Router();

router.get("/me", authenticate, getMyBookingsHandler);
router.get("/:id", authenticate, getBookingHandler);
router.delete("/:id", authenticate, cancelBookingHandler);
router.post("/", authenticate,createBookingHandler);


export default router;
