const { Router } = require("express");
const router = Router();

const {
  getRooms, getRoom, getRoomsByFacility,
  createRoom, editRoom, deleteRoom
} = require("../controllers/room_ctrl");

router.route("/")
  .get(getRooms);

router.route("/:uuid")
  .get(getRoom);

router.route("/facility/:facility_uuid")
  .get(getRoomsByFacility);

router.route("/:uuid")
  .put(editRoom);

router.route("/")
  .post(createRoom);

router.route("/:uuid")
  .delete(deleteRoom);

module.exports = router;
