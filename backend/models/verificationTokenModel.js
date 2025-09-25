const mongoose = require("mongoose");
const crypto = require("crypto");

const verificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
    },
  },
  {
    timestamps: true,
  }
);

// Index pour nettoyer automatiquement les tokens expirés
verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Méthode statique pour générer un code de 6 chiffres
verificationTokenSchema.statics.generateToken = function (userId) {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Génère un code de 6 chiffres
  return this.create({
    userId,
    token: code,
  });
};

// Méthode statique pour vérifier un token
verificationTokenSchema.statics.verifyToken = async function (token) {
  const verificationToken = await this.findOne({
    token,
    expiresAt: { $gt: new Date() },
  }).populate("userId");

  if (!verificationToken) {
    return null;
  }

  // Supprimer le token après utilisation
  await this.deleteOne({ _id: verificationToken._id });

  return verificationToken.userId;
};

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);
module.exports = VerificationToken;
