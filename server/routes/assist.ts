import { RequestHandler } from "express";

function classifyMood(text: string): "crisis" | "negative" | "neutral" | "positive" {
  const t = text.toLowerCase();
  if (/suicide|kill myself|end my life|self-harm|cutting|jump|die|death/.test(t)) return "crisis";
  if (/(anxious|sad|depressed|overwhelmed|stressed|panic|lonely|worthless|fail|useless)/.test(t)) return "negative";
  if (/(grateful|happy|calm|okay|fine|better|hopeful|relieved)/.test(t)) return "positive";
  return "neutral";
}

function buildResponse(message: string): string {
  const mood = classifyMood(message);
  const tips = [
    "Try a 4-4-6 breath: inhale 4, hold 4, exhale 6—repeat x3.",
    "Would you like a two-minute grounding: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste?",
    "A short walk or stretching can release built-up tension—just 3 minutes helps.",
  ];
  const pick = tips[Math.floor(Math.random() * tips.length)];

  if (mood === "crisis") {
    return [
      "I'm really glad you told me. Your feelings matter and you're not alone.",
      "Right now, it's important to talk to someone who can help immediately.",
      "In India, you can call the Kiran Helpline at 1800-599-0019 (24x7) or contact local emergency services.",
      "If you want, I can stay with you and keep checking in. Would grounding help right now? " + pick,
    ].join(" ");
  }
  if (mood === "negative") {
    return [
      "Thank you for sharing that. It sounds heavy, and I'm here with you—no judgment.",
      pick,
      "If you'd like, we can journal a few thoughts or plan one small, kind step for yourself today.",
    ].join(" ");
  }
  if (mood === "positive") {
    return [
      "That's wonderful to hear. Noticing these moments builds resilience.",
      "Would you like to log this in your dashboard to strengthen your streak?",
    ].join(" ");
  }
  return [
    "I'm listening. Tell me a bit more about what's on your mind or what's been challenging lately.",
    pick,
  ].join(" ");
}

export const handleAssist: RequestHandler = async (req, res) => {
  try {
    const message = (req.body?.message as string) || "";
    const reply = buildResponse(message);
    res.status(200).json({ reply });
  } catch (e) {
    res.status(200).json({ reply: "I'm here for you. Let's take a slow breath together: inhale 4, hold 4, exhale 6." });
  }
};
