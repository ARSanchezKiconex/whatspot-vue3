const { Router } = require("express");
const router = Router();

const {
  getUsers,
} = require("../controllers/user_ctrl");

router.route("/")
  .get(getUsers);

module.exports = router;
