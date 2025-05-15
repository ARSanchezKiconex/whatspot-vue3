const { Router } = require("express");
const router = Router();

const {
  getFacilities,
} = require("../controllers/facility_ctrl");

router.route("/")
  .get(getFacilities);

module.exports = router;
