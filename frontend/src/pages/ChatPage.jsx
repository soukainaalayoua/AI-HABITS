import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ChatPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/chat", {
        message: inputMessage,
        context: "habits",
      });

      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        sender: "ai",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent"
            >
              Chat with AI 🤖
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-300 mt-2"
            >
              Posez vos questions sur vos habitudes et recevez des conseils
              personnalisés
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-3 mt-4 sm:mt-0"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-fuchsia-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              📊 Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              className="border-2 border-fuchsia-500 text-fuchsia-400 px-4 py-2 rounded-full font-semibold hover:bg-fuchsia-600 hover:text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              🗑️ Clear
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="border-2 border-fuchsia-500 text-fuchsia-400 px-4 py-2 rounded-full font-semibold hover:bg-fuchsia-600 hover:text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Logout
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 h-[600px] flex flex-col"
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-r from-fuchsia-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <span className="text-white text-3xl">🤖</span>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  Start a conversation
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-gray-300 mb-6"
                >
                  Ask me questions about your habits, request advice or discuss
                  your goals!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 rounded-xl p-4 border border-white/20"
                  >
                    <h4 className="font-semibold text-fuchsia-400 mb-2">
                      💡 Tips
                    </h4>
                    <p className="text-sm text-gray-300">
                      "How to create a lasting habit?"
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 rounded-xl p-4 border border-white/20"
                  >
                    <h4 className="font-semibold text-cyan-400 mb-2">
                      📊 Analysis
                    </h4>
                    <p className="text-sm text-gray-300">
                      "Analyze my performance this week"
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 rounded-xl p-4 border border-white/20"
                  >
                    <h4 className="font-semibold text-violet-400 mb-2">
                      🎯 Goals
                    </h4>
                    <p className="text-sm text-gray-300">
                      "Help me define my goals"
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 rounded-xl p-4 border border-white/20"
                  >
                    <h4 className="font-semibold text-blue-400 mb-2">
                      🔄 Motivation
                    </h4>
                    <p className="text-sm text-gray-300">
                      "How to stay motivated?"
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white"
                        : message.isError
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-white/20 text-gray-100 border border-white/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.sender === "ai" && (
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">🤖</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                        <p className="text-xs opacity-70 mt-2">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">👤</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/20 text-gray-100 border border-white/30 rounded-2xl p-4 max-w-[70%]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/20 p-6">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-fuchsia-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "⏳" : "📤"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
