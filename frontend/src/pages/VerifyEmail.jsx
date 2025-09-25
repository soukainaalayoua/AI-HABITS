import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("waiting"); // waiting, loading, success, error
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");
  const codeFromUrl = searchParams.get("code");

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      setMessage(
        `Un email de vérification a été envoyé à ${emailFromUrl}. Vérifiez votre boîte de réception et saisissez le code de vérification ci-dessous.`
      );
    }

    // Pré-remplir le code si fourni dans l'URL
    if (codeFromUrl) {
      setVerificationCode(codeFromUrl);
      setMessage(
        `Code de vérification reçu ! Utilisez le code ${codeFromUrl} pour vérifier votre compte.`
      );
    }

    if (token) {
      verifyEmail();
    }
  }, [token, emailFromUrl, codeFromUrl]);

  const verifyEmail = async () => {
    try {
      const response = await api.post("/auth/verify-email", { token });
      setStatus("success");
      setMessage(response.data.message);

      // Stocker le token et rediriger vers le dashboard
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message || "Erreur lors de la vérification"
      );
    }
  };

  const verifyWithCode = async () => {
    if (!verificationCode) {
      setMessage("Veuillez saisir le code de vérification");
      return;
    }

    setStatus("loading");
    try {
      const response = await api.post("/auth/verify-email", {
        token: verificationCode,
      });
      setStatus("success");
      setMessage(response.data.message);

      // Stocker le token et rediriger vers le dashboard
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message || "Code de vérification invalide"
      );
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setMessage("Veuillez entrer votre adresse email");
      return;
    }

    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      setMessage("Email de vérification renvoyé avec succès !");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Erreur lors du renvoi de l'email"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-md mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center"
        >
          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          >
            {status === "loading" && (
              <div className="w-20 h-20 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === "success" && (
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">✅</span>
              </div>
            )}
            {status === "error" && (
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">❌</span>
              </div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent"
          >
            {status === "loading" && "Vérification en cours..."}
            {status === "success" && "Email vérifié !"}
            {status === "error" && "Erreur de vérification"}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-300 mb-6"
          >
            {message}
          </motion.p>

          {/* Code verification form */}
          {status === "waiting" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Code de vérification
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Seulement 6 chiffres
                    setVerificationCode(value);
                  }}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl font-mono tracking-widest"
                />
              </div>
              <button
                onClick={verifyWithCode}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-fuchsia-500/40 transition-all duration-300"
              >
                Vérifier le code
              </button>
              <button
                onClick={resendVerification}
                disabled={isResending}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50"
              >
                {isResending ? "Envoi en cours..." : "Renvoyer l'email"}
              </button>
            </motion.div>
          )}

          {/* Resend form for errors */}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <div>
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={resendVerification}
                disabled={isResending}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-fuchsia-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending
                  ? "Envoi en cours..."
                  : "Renvoyer l'email de vérification"}
              </button>
            </motion.div>
          )}

          {/* Success actions */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-400">
                Redirection vers le dashboard dans quelques secondes...
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-cyan-500/40 transition-all duration-300"
              >
                Aller au Dashboard
              </Link>
            </motion.div>
          )}

          {/* Back to login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6"
          >
            <Link
              to="/login"
              className="text-gray-400 hover:text-fuchsia-400 transition-colors text-sm"
            >
              ← Retour à la connexion
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
