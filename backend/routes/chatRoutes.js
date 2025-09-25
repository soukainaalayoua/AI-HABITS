const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { chatWithAI } = require("../controllers/chatController");

router.post("/", protect, chatWithAI);

module.exports = router;



