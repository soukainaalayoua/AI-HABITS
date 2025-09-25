const router = require("express").Router();
const { sendContactEmail } = require("../controllers/contactController");

// POST /api/contact - Envoyer un email de contact
router.post("/", sendContactEmail);

module.exports = router;

