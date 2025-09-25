import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import BarChartMini from "../components/BarChartMini";
import AreaChart from "../components/AreaChart";
import MiniDonutChart from "../components/MiniDonutChart";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState({});
  const [form, setForm] = useState({
    title: "",
    type: "build",
    target: 1,
    frequency: "daily",
    reminderTime: "",
    duration: 30,
  });
  const [formErrors, setFormErrors] = useState({});
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, habitsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/habits"),
        ]);
        console.log("User data from API:", meRes.data.user);
        setUser(meRes.data.user);
        setHabits(habitsRes.data.habits || []);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Le titre de l'habitude est requis";
    if (form.target < 1 || form.target > 365)
      errors.target = "L'objectif doit être entre 1 et 365";
    if (form.duration < 1 || form.duration > 365)
      errors.duration = "La durée doit être entre 1 et 365";
    if (
      form.reminderTime &&
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(form.reminderTime)
    ) {
      errors.reminderTime = "Veuillez utiliser le format HH:MM (24h)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await api.post("/habits", form);
      setHabits([res.data.habit, ...habits]);
      setForm({
        title: "",
        type: "build",
        target: 1,
        frequency: "daily",
        reminderTime: "",
        duration: 30,
      });
      setShowCreateForm(false);
      setFormErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = {};
        err.response.data.errors.forEach((error) => {
          if (error.includes("title")) errors.title = error;
          if (error.includes("target")) errors.target = error;
          if (error.includes("duration")) errors.duration = error;
          if (error.includes("reminder")) errors.reminderTime = error;
        });
        setFormErrors(errors);
      } else {
        alert(
          err.response?.data?.message || "Échec de la création de l'habitude"
        );
      }
    }
  };

  const visibleHabits = habits
    .filter((h) => h.title.toLowerCase().includes(query.toLowerCase()))
    .filter((h) => (type ? h.type === type : true))
    .filter((h) => (frequency ? h.frequency === frequency : true))
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "success")
        return (b.stats?.successRate || 0) - (a.stats?.successRate || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  let done7 = 0;
  let missed7 = 0;
  for (const h of habits) {
    const tracking = h.trackingHistory || [];
    for (const t of tracking) {
      const td = new Date(t.date);
      const minDay = new Date();
      minDay.setDate(minDay.getDate() - 6);
      minDay.setHours(0, 0, 0, 0);

      if (td >= minDay) {
        if (t.status === "done") done7 += 1;
        if (t.status === "missed") missed7 += 1;
      }
    }
  }

  const neutral7 = Math.max(0, habits.length * 7 - (done7 + missed7));

  const trackHabit = async (habitId, status) => {
    setTrackingLoading({ ...trackingLoading, [habitId]: true });

    try {
      const res = await api.post("/tracking", {
        habitId,
        status,
        note: "",
      });

      setHabits(
        habits.map((habit) =>
          habit._id === habitId
            ? {
                ...habit,
                stats: res.data.stats,
                aiFeedback: res.data.aiFeedback,
                lastTracking: res.data.tracking,
              }
            : habit
        )
      );
    } catch (err) {
      if (err.response?.data?.message?.includes("already tracked")) {
        alert("Vous avez déjà suivi cette habitude aujourd'hui !");
      } else {
        alert("Échec du suivi de l'habitude. Veuillez réessayer.");
      }
    } finally {
      setTrackingLoading({ ...trackingLoading, [habitId]: false });
    }
  };

  const deleteHabit = async (habitId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette habitude ? Cela supprimera aussi toutes les données de suivi."
      )
    )
      return;

    try {
      await api.delete(`/habits/${habitId}`);
      setHabits(habits.filter((h) => h._id !== habitId));
    } catch (err) {
      alert("Échec de la suppression de l'habitude. Veuillez réessayer.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">
            Chargement de votre tableau de bord...
          </p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">
            Impossible de charger les données utilisateur
          </p>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Aller à la Connexion
          </button>
        </div>
      </div>
    );

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              Hello,{" "}
              {user?.name?.split(" ")[0] ||
                user?.username ||
                user?.email?.split("@")[0] ||
                "User"}{" "}
              👋
            </h1>
            <p className="text-gray-300 mt-2">
              Track your habits and progress every day
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/chat")}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              🤖 Chat IA
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-fuchsia-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              + Nouvelle Habitude
            </button>
            <button
              onClick={handleLogout}
              className="border-2 border-fuchsia-500 text-fuchsia-400 px-4 py-2 rounded-full font-semibold hover:bg-fuchsia-600 hover:text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Habitudes</p>
                <p className="text-2xl font-bold text-white">{habits.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-violet-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Réussites (7j)</p>
                <p className="text-2xl font-bold text-cyan-400">{done7}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Missed (7d)</p>
                <p className="text-2xl font-bold text-fuchsia-400">{missed7}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">❌</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Taux de Réussite</p>
                <p className="text-2xl font-bold text-violet-400">
                  {Math.round((done7 / (done7 + missed7 || 1)) * 100)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              Progression de la Semaine
            </h3>
            <span className="text-sm text-gray-300">
              {done7} sur {done7 + missed7 + neutral7} habitudes
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((done7 / (done7 + missed7 + neutral7 || 1)) * 100)
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart - Progression hebdomadaire */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Progression Hebdomadaire
            </h3>
            <BarChartMini
              values={[
                Math.round((done7 / (done7 + missed7 + neutral7 || 1)) * 100),
                Math.round((done7 / (done7 + missed7 + neutral7 || 1)) * 100) *
                  0.8,
                Math.round((done7 / (done7 + missed7 + neutral7 || 1)) * 100) *
                  0.9,
                Math.round((done7 / (done7 + missed7 + neutral7 || 1)) * 100) *
                  0.7,
                Math.round((done7 / (done7 + missed7 + neutral7 || 1)) * 100) *
                  0.85,
                Math.round((done7 / (done7 + missed7 + neutral7 || 1)) * 100) *
                  0.95,
                Math.round((done7 / (done7 + missed7 + neutral7 || 1)) * 100),
              ]}
              barColor="#8B5CF6"
              labels={["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
            />
          </div>

          {/* Line Chart - Tendance des habitudes */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Tendance des Habitudes
            </h3>
            <div className="flex justify-center">
              <AreaChart
                values={[
                  habits.length * 0.6,
                  habits.length * 0.7,
                  habits.length * 0.8,
                  habits.length * 0.75,
                  habits.length * 0.85,
                  habits.length * 0.9,
                  habits.length,
                ]}
                width={260}
                height={100}
                lineColor="#06B6D4"
                fillColor="rgba(6,182,212,0.2)"
                labels={[
                  "Sem 1",
                  "Sem 2",
                  "Sem 3",
                  "Sem 4",
                  "Sem 5",
                  "Sem 6",
                  "Maintenant",
                ]}
              />
            </div>
          </div>

          {/* Pie Chart - Répartition des types */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Répartition des Types
            </h3>
            <div className="flex justify-center">
              <MiniDonutChart
                segments={[
                  {
                    label: "Construire",
                    value: habits.filter((h) => h.type === "build").length,
                    color: "#06B6D4",
                  },
                  {
                    label: "Arrêter",
                    value: habits.filter((h) => h.type === "break").length,
                    color: "#EC4899",
                  },
                ]}
                size={120}
                stroke={14}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search habits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All types</option>
              <option value="build">Build</option>
              <option value="break">Break</option>
            </select>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">Most recent</option>
              <option value="title">Name</option>
              <option value="success">Success rate</option>
            </select>
          </div>
        </div>

        {/* Habits List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleHabits.map((habit) => (
            <div
              key={habit._id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {habit.title}
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        habit.type === "build"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30"
                      }`}
                    >
                      {habit.type === "build" ? "Construire" : "Arrêter"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                      {habit.frequency === "daily"
                        ? "Quotidien"
                        : "Hebdomadaire"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteHabit(habit._id)}
                  className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                >
                  🗑️
                </button>
              </div>

              {/* Progress Stats */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Taux de réussite</span>
                  <span>{habit.stats?.successRate || 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${habit.stats?.successRate || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* AI Feedback */}
              {habit.aiFeedback && (
                <div className="mb-4 p-3 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-violet-500/30">
                  <p className="text-sm text-gray-200">
                    <span className="font-semibold text-violet-300">
                      🤖 IA:
                    </span>{" "}
                    {habit.aiFeedback}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => trackHabit(habit._id, "done")}
                  disabled={trackingLoading[habit._id]}
                  className="flex-1 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-fuchsia-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {trackingLoading[habit._id] ? "⏳" : "✅"} Done
                </button>
                <button
                  onClick={() => trackHabit(habit._id, "missed")}
                  disabled={trackingLoading[habit._id]}
                  className="flex-1 border-2 border-fuchsia-500 text-fuchsia-400 px-4 py-2 rounded-xl font-semibold hover:bg-fuchsia-600 hover:text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {trackingLoading[habit._id] ? "⏳" : "❌"} Missed
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {visibleHabits.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-fuchsia-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Aucune habitude trouvée
            </h3>
            <p className="text-gray-300 mb-6">
              {habits.length === 0
                ? "Commencez par créer votre première habitude !"
                : "Aucune habitude ne correspond à vos filtres."}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-fuchsia-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Create Habit
            </button>
          </div>
        )}

        {/* Create Habit Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                Create New Habit
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.title ? "border-red-500" : "border-white/30"
                    }`}
                    placeholder="Ex: Drink 8 glasses of water"
                  />
                  {formErrors.title && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="build">Build a habit</option>
                    <option value="break">Break a habit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    min="1"
                    max="365"
                    className={`w-full px-4 py-3 bg-white/20 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.duration ? "border-red-500" : "border-white/30"
                    }`}
                  />
                  {formErrors.duration && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Heure de rappel (optionnel)
                  </label>
                  <input
                    type="time"
                    name="reminderTime"
                    value={form.reminderTime}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.reminderTime
                        ? "border-red-500"
                        : "border-white/30"
                    }`}
                  />
                  {formErrors.reminderTime && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.reminderTime}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 border-2 border-fuchsia-500 text-fuchsia-400 px-4 py-3 rounded-xl font-semibold hover:bg-fuchsia-600 hover:text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-fuchsia-500/40 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
