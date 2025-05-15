const { Router } = require("express");
const router = Router();

const {
  getBookings,
} = require("../controllers/booking_ctrl");

router.route("/")
  .get(getBookings);

module.exports = router;
