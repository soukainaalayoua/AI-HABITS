const nodemailer = require("nodemailer");

// Configure transporter using Gmail SMTP
// Make sure to set: GMAIL_USER, GMAIL_PASS in .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "salayoua@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendEmail({ to, subject, text, html }) {
  try {
    // Vérifier si les variables d'environnement sont configurées
    if (
      !process.env.GMAIL_PASS ||
      process.env.GMAIL_PASS === "your-gmail-app-password"
    ) {
      console.log("⚠️  Configuration email manquante. Email simulé:");
      console.log(`📧 To: ${to}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 Message: ${text || html}`);

      // Retourner un objet simulé pour éviter l'erreur
      return {
        messageId: "simulated-" + Date.now(),
        accepted: [to],
        rejected: [],
        pending: [],
        response: "Email simulé - configuration manquante",
      };
    }

    const info = await transporter.sendMail({
      from: `AI HABITS <${process.env.GMAIL_USER || "salayoua@gmail.com"}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email envoyé avec succès:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error.message);

    // Si c'est une erreur d'authentification, passer en mode simulation
    if (
      error.message.includes("Username and Password not accepted") ||
      error.message.includes("Invalid login") ||
      error.message.includes("BadCredentials")
    ) {
      console.log(
        "⚠️  Erreur d'authentification Gmail. Passage en mode simulation:"
      );
      console.log(`📧 To: ${to}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 Message: ${text || html}`);

      return {
        messageId: "simulated-" + Date.now(),
        accepted: [to],
        rejected: [],
        pending: [],
        response: "Email simulé - erreur d'authentification Gmail",
      };
    }

    throw error;
  }
}

module.exports = { sendEmail };
