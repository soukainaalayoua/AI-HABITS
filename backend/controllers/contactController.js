const { sendEmail } = require("../utils/mailer");

// Envoyer un email de contact
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation des données
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Le nom, l'email et le message sont requis",
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format d'email invalide",
      });
    }

    // Préparer le contenu de l'email
    const emailContent = {
      to: "salayoua@gmail.com", // Votre email
      subject: `Nouveau message de contact - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🤖 Nouveau message de contact</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">AI-HABITS Platform</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Informations du contact</h2>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #667eea;">👤 Nom :</strong>
              <p style="margin: 5px 0; color: #555; font-size: 16px;">${name}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #667eea;">📧 Email :</strong>
              <p style="margin: 5px 0; color: #555; font-size: 16px;">${email}</p>
            </div>
            
            ${
              phone
                ? `
            <div style="margin-bottom: 20px;">
              <strong style="color: #667eea;">📱 Téléphone :</strong>
              <p style="margin: 5px 0; color: #555; font-size: 16px;">${phone}</p>
            </div>
            `
                : ""
            }
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #667eea;">💬 Message :</strong>
              <div style="margin: 10px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1976d2; font-weight: bold;">📅 Date : ${new Date().toLocaleString(
                "fr-FR",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            <p>Ce message a été envoyé depuis le formulaire de contact de AI-HABITS</p>
            <p>Pour répondre, utilisez l'adresse email : <strong>${email}</strong></p>
          </div>
        </div>
      `,
    };

    // Envoyer l'email
    await sendEmail(emailContent);

    res.status(200).json({
      success: true,
      message: "Message envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de contact:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  sendContactEmail,
};

