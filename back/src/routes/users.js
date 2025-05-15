const { Router } = require("express");
const router = Router();

const {
  getUsers, getUser,
  createUser, editUser, deleteUser
} = require("../controllers/user_ctrl");

router.route("/")
  .get(getUsers);

router.route("/:uuid")
  .get(getUser);

// router.route("/:uuid")
//   .put(editUser);

// router.route("/")
//   .post(createUser);

// router.route("/:uuid")
//   .delete(deleteUser);

module.exports = router;
