import { RequestHandler } from "express";

function classifyMood(text: string): "crisis" | "negative" | "neutral" | "positive" {
  const t = text.toLowerCase();
  if (/suicide|kill myself|end my life|self-harm|cutting|jump|die|death/.test(t)) return "crisis";
  if (/(anxious|sad|depressed|overwhelmed|stressed|panic|lonely|worthless|fail|useless)/.test(t)) return "negative";
  if (/(grateful|happy|calm|okay|fine|better|hopeful|relieved)/.test(t)) return "positive";
  return "neutral";
}

function isHindi(text: string, langHint?: string) {
  return /[\u0900-\u097F]/.test(text) || langHint?.toLowerCase() === "hi-in";
}

function buildResponse(message: string, langHint?: string): string {
  const mood = classifyMood(message);
  const hindi = isHindi(message, langHint);

  if (hindi) {
    const tips = [
      "4-4-6 श्वास लें: 4 तक साँस लें, 4 तक रोकें, 6 तक छोड़ें — तीन बार दोहराएँ।",
      "क्या आप दो मिनट का ग्राउंडिंग व्यायाम करना चाहेंगे: 5 चीज़ें जो आप देखते हैं, 4 जिन्हें आप छू सकते हैं, 3 जो आप सुनते हैं, 2 जो आप सूंघते हैं, 1 जो आप चखते हैं?",
      "हल्का चलना या स्ट्रेचिंग तनाव को कम कर सकता है — सिर्फ 3 मिनट भी मदद करता है।",
    ];
    const pick = tips[Math.floor(Math.random() * tips.length)];
    if (mood === "crisis") {
      return [
        "आपने बताया, यह बहुत हिम्मत की बात है। आपकी भावनाएँ महत्वपूर्ण हैं और आप अकेले नहीं हैं।",
        "अभी किसी से तुरंत बात करना ज़रूरी है जो मदद कर सके।",
        "भारत में, आप किरण हेल्पलाइन 1800-599-0019 (24x7) पर कॉल कर सकते हैं या स्थानीय आपातकालीन सेवाओं से संपर्क करें।",
        "मैं आपके साथ हूँ। क्या अभी ग्राउंडिंग मदद करेगी? " + pick,
      ].join(" ");
    }
    if (mood === "negative") {
      return [
        "शेयर करने के लिए धन्यवाद। यह भारी लग रहा है, और मैं बिना किसी जजमेंट के आपके साथ हूँ।",
        pick,
        "यदि चाहें, तो हम कुछ विचार लिख सकते हैं या आज अपने लिए एक छोटा, दयालु कदम ��य कर सकते हैं।",
      ].join(" ");
    }
    if (mood === "positive") {
      return [
        "यह सुनकर अच्छा लगा। ऐसे पलों को नोटिस करना दृढ़ता बनाता है।",
        "क्या आप इसे अपनी डैशबोर्ड में लॉग करना चाहेंगे ताकि स्ट्रिक मजबूत हो?",
      ].join(" ");
    }
    return [
      "मैं सुन रहा/रही हूँ। जो भी आपके मन में है या जो मुश्किल हो रहा है, उसके बारे में थोड़ा और बताइए।",
      pick,
    ].join(" ");
  }

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
    const lang = (req.body?.lang as string) || undefined;
    const reply = buildResponse(message, lang);
    res.status(200).json({ reply });
  } catch (e) {
    res.status(200).json({ reply: "I'm here for you. Let's take a slow breath together: inhale 4, hold 4, exhale 6." });
  }
};
