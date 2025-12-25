import express from "express";
import {
  createBookingHandler,
  getBookingHandler,
  cancelBookingHandler
} from "../controllers/bookings.controller.js";

const router = express.Router();

router.post("/", createBookingHandler);
router.get("/:id", getBookingHandler);
router.delete("/:id", cancelBookingHandler);

export default router;
