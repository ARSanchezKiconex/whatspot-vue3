const { Router } = require("express");
const router = Router();

const {
  getRooms
} = require("../controllers/room_ctrl");

router.route("/")
  .get(getRooms);

module.exports = router;
