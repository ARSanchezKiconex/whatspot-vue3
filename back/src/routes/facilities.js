const { Router } = require("express");
const router = Router();

const {
  getFacilities, getFacility,
  createFacility, editFacility, deleteFacility
} = require("../controllers/facility_ctrl");

router.route("/")
  .get(getFacilities);

router.route("/:uuid")
  .get(getFacility);

router.route("/:uuid")
  .put(editFacility);

router.route("/")
  .post(createFacility);

router.route("/:uuid")
  .delete(deleteFacility);

module.exports = router;
