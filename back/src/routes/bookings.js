const { Router } = require("express");
const router = Router();

const {
  getBookings, getBooking, getBookingByUser,
  createBooking, editBooking, deleteBooking
} = require("../controllers/booking_ctrl");

router.route("/")
  .get(getBookings)
  .post(createBooking);

router.route("/:uuid")
  .get(getBooking)
  .put(editBooking)
  .delete(deleteBooking);

router.route("/user/:user_uuid")
  .get(getBookingByUser);

module.exports = router;