const OpenAI = require("openai");
const Habit = require("../models/habitModel");
const Tracking = require("../models/trackingModel");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/chat
// body: { message: string, habitId?: string }
const chatWithAI = async (req, res) => {
  try {
    const { message, habitId } = req.body || {};
    const user = req.user;

    if (!message || typeof message !== "string" || message.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Please provide a valid message" });
    }

    // Fetch habits for context
    const habits = await Habit.find({ user: user._id }).sort({ createdAt: -1 });

    let focusedHabit = null;
    let trackingHistory = [];
    if (habitId) {
      focusedHabit = await Habit.findOne({ _id: habitId, user: user._id });
      if (!focusedHabit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      trackingHistory = await Tracking.find({ habit: habitId, user: user._id })
        .sort({ date: -1 })
        .limit(60);
    }

    // Compute simple stats for all habits
    const habitsStats = [];
    for (const h of habits) {
      const history = await Tracking.find({ habit: h._id, user: user._id });
      const totalAttempts = history.length;
      const doneCount = history.filter((t) => t.status === "done").length;
      const missedCount = history.filter((t) => t.status === "missed").length;
      const successRate =
        totalAttempts > 0 ? ((doneCount / totalAttempts) * 100).toFixed(1) : 0;
      habitsStats.push({
        title: h.title,
        type: h.type,
        frequency: h.frequency,
        target: h.target,
        totalAttempts,
        doneCount,
        missedCount,
        successRate,
      });
    }

    const contextLines = [
      `User: ${user.firstName} ${user.lastName}`,
      `Total habits: ${habits.length}`,
    ];
    if (focusedHabit) {
      contextLines.push(
        `Focused habit: ${focusedHabit.title} (${focusedHabit.type}, ${focusedHabit.frequency})`
      );
      const totalAttempts = trackingHistory.length;
      const doneCount = trackingHistory.filter(
        (t) => t.status === "done"
      ).length;
      const missedCount = trackingHistory.filter(
        (t) => t.status === "missed"
      ).length;
      const successRate =
        totalAttempts > 0 ? ((doneCount / totalAttempts) * 100).toFixed(1) : 0;
      contextLines.push(
        `Recent stats → attempts: ${totalAttempts}, done: ${doneCount}, missed: ${missedCount}, success: ${successRate}%`
      );
    }

    const habitsSummary = habitsStats
      .slice(0, 6)
      .map(
        (s) =>
          `- ${s.title} [${s.type}/${s.frequency}] success ${s.successRate}% (${s.doneCount}/${s.totalAttempts})`
      )
      .join("\n");

    // Generate varied responses based on message content and context
    const messageLower = message.toLowerCase().trim();
    const currentTime = new Date();
    const timeContext =
      currentTime.getHours() < 12
        ? "morning"
        : currentTime.getHours() < 18
        ? "afternoon"
        : "evening";

    // Analyze message intent for specific, targeted responses
    let responseStyle = "conversational";
    let focusArea = "specific";
    let questionType = "general";
    let isDashboardQuestion = false;
    let isVagueQuestion = false;
    let isGreeting = false;

    // Check for greetings and simple messages
    if (
      messageLower.includes("salut") ||
      messageLower.includes("bonjour") ||
      messageLower.includes("bonsoir") ||
      messageLower.includes("hello") ||
      messageLower.includes("hi") ||
      messageLower.includes("coucou") ||
      messageLower.includes("ça va") ||
      messageLower.includes("comment allez-vous")
    ) {
      isGreeting = true;
      questionType = "greeting";
      responseStyle = "welcoming";
    }
    // Check if question is about dashboard/data
    else if (
      messageLower.includes("dashboard") ||
      messageLower.includes("mes données") ||
      messageLower.includes("mes stats") ||
      messageLower.includes("mes performances") ||
      messageLower.includes("mes habitudes") ||
      messageLower.includes("mes résultats") ||
      messageLower.includes("analyse") ||
      messageLower.includes("statistiques")
    ) {
      isDashboardQuestion = true;
      questionType = "dashboard-analysis";
      responseStyle = "analytical";
    }
    // Check if question is vague/general
    else if (
      messageLower.includes("conseil") ||
      messageLower.includes("aide") ||
      messageLower.includes("comment faire") ||
      messageLower.includes("que faire") ||
      messageLower.includes("habitude") ||
      messageLower.includes("motivation") ||
      messageLower.includes("objectif") ||
      messageLower.includes("but") ||
      messageLower.includes("améliorer") ||
      messageLower.includes("mieux")
    ) {
      isVagueQuestion = true;
      questionType = "vague";
      responseStyle = "clarifying";
    }
    // Detect specific question types for targeted responses
    else if (
      messageLower.includes("comment") ||
      messageLower.includes("que faire")
    ) {
      questionType = "how-to";
      responseStyle = "instructional";
    } else if (
      messageLower.includes("pourquoi") ||
      messageLower.includes("pour quoi")
    ) {
      questionType = "explanation";
      responseStyle = "analytical";
    } else if (
      messageLower.includes("quand") ||
      messageLower.includes("à quelle heure")
    ) {
      questionType = "timing";
      responseStyle = "scheduling";
    } else if (
      messageLower.includes("combien") ||
      messageLower.includes("fréquence")
    ) {
      questionType = "quantity";
      responseStyle = "quantitative";
    } else if (
      messageLower.includes("quel") ||
      messageLower.includes("quelle")
    ) {
      questionType = "selection";
      responseStyle = "recommendatory";
    } else if (
      messageLower.includes("problème") ||
      messageLower.includes("difficulté") ||
      messageLower.includes("échoué")
    ) {
      questionType = "problem";
      responseStyle = "diagnostic";
    } else if (
      messageLower.includes("succès") ||
      messageLower.includes("réussi") ||
      messageLower.includes("bien")
    ) {
      questionType = "success";
      responseStyle = "celebratory";
    } else if (
      messageLower.includes("motivation") ||
      messageLower.includes("démotivé")
    ) {
      questionType = "motivation";
      responseStyle = "motivational";
    } else if (
      messageLower.includes("objectif") ||
      messageLower.includes("but")
    ) {
      questionType = "goal";
      responseStyle = "strategic";
    }

    const systemPrompt = `You are a conversational AI assistant specialized in habit coaching. Your responses must be:

${
  isGreeting
    ? `GREETING MODE:
- Respond naturally and welcomingly
- Be friendly and conversational
- Ask how you can help them with their habits
- Keep it brief and warm
- Example: "Salut ! Comment puis-je vous aider avec vos habitudes aujourd'hui ?"`
    : isDashboardQuestion
    ? `DASHBOARD ANALYSIS MODE:
- Provide DIRECT feedback based on their actual dashboard data
- Highlight specific numbers, trends, and patterns
- Give concrete insights about their performance
- Suggest specific improvements based on their data
- Use their real statistics: ${
        habitsStats.length > 0
          ? `Best: ${habitsStats[0]?.title} (${
              habitsStats[0]?.successRate
            }%), Worst: ${habitsStats[habitsStats.length - 1]?.title} (${
              habitsStats[habitsStats.length - 1]?.successRate
            }%)`
          : "No data yet"
      }`
    : isVagueQuestion
    ? `VAGUE QUESTION MODE:
- Ask politely for more specific details
- Request clarification on their exact situation
- Do NOT provide generic advice
- Example: "Pourriez-vous préciser quelle habitude vous pose problème ?" ou "Quel aspect spécifique voulez-vous améliorer ?"
- Only provide advice after they give specific details`
    : `SPECIFIC QUESTION MODE:
- Answer ONLY the specific question asked
- Give concrete, actionable steps
- Use specific numbers, times, or methods
- Reference their actual habit data
- Be direct and precise
- No general advice or motivational fluff`
}

- CONCISE - maximum 120 words
- NATURAL and CONVERSATIONAL tone
- PERSONALIZED using their actual habit data
- STYLE: ${responseStyle}`;

    const userPrompt = `
QUESTION TYPE: ${questionType}
${
  isGreeting
    ? "GREETING DETECTED"
    : isDashboardQuestion
    ? "DASHBOARD ANALYSIS REQUESTED"
    : isVagueQuestion
    ? "VAGUE QUESTION DETECTED"
    : "SPECIFIC QUESTION"
}
USER MESSAGE: "${message.trim()}"

YOUR DATA:
- Time: ${timeContext}
- Total habits: ${habits.length}
- Habits: ${habitsSummary || "(no habits yet)"}
- Best performer: ${
      habitsStats.length > 0
        ? `${habitsStats[0]?.title} (${habitsStats[0]?.successRate}%)`
        : "None"
    }
- Needs improvement: ${
      habitsStats.length > 1
        ? `${habitsStats[habitsStats.length - 1]?.title} (${
            habitsStats[habitsStats.length - 1]?.successRate
          }%)`
        : "None"
    }

${
  isGreeting
    ? `GREETING INSTRUCTIONS:
- Respond warmly and naturally
- Ask how you can help with their habits
- Be friendly and conversational
- Keep it brief and welcoming`
    : isDashboardQuestion
    ? `DASHBOARD ANALYSIS INSTRUCTIONS:
- Analyze their actual performance data
- Highlight specific trends and patterns
- Give concrete feedback on their dashboard
- Suggest specific improvements based on their data
- Use exact numbers and percentages`
    : isVagueQuestion
    ? `VAGUE QUESTION INSTRUCTIONS:
- Ask for specific clarification
- Request more details about their situation
- Do NOT provide generic advice
- Examples of clarifying questions:
  * "Quelle habitude spécifique vous pose problème ?"
  * "Quel aspect de votre routine voulez-vous améliorer ?"
  * "Pouvez-vous préciser votre objectif exact ?"`
    : `SPECIFIC QUESTION INSTRUCTIONS:
- Answer ONLY the specific question asked
- Give concrete, actionable steps
- Use specific numbers, times, or methods
- Reference their actual habit data
- Be direct and precise`
}
`;

    let replyText = "";
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.3,
        presence_penalty: 0.2,
        frequency_penalty: 0.1,
      });
      replyText = completion.choices?.[0]?.message?.content?.trim() || "";
    } catch (aiErr) {
      replyText =
        "I'm having trouble reaching the AI service right now. Try again in a moment.";
    }

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to process chat", error: error.message });
  }
};

module.exports = { chatWithAI };
