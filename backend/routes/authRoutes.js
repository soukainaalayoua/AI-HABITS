const router = require("express").Router();
const {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");
const { protect, protectAdmin } = require("../middleware/authMiiddlware");

router.get("/", protect, getUsers);
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;
