const { Router } = require("express");
const router = Router();

const {
  getBookings, getBooking, getBookingByUser,
  createBooking, editBooking, deleteBooking
} = require("../controllers/booking_ctrl");

router.route("/")
  .get(getBookings);

router.route("/:uuid")
  .get(getBooking);

router.route("/user/:user_uuid")
  .get(getBookingByUser);

router.route("/:uuid")
  .put(editBooking);

router.route("/")
  .post(createBooking);

router.route("/:uuid")
  .delete(deleteBooking);

module.exports = router;