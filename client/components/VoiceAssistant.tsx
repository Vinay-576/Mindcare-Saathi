import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Video, VideoOff, Volume2, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function pickFemaleVoice(preferLocale = "en-IN"): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const candidates = voices.filter((v) =>
    /female|woman|en-IN|india|english/i.test(`${v.name} ${v.lang}`),
  );
  return candidates[0] || voices.find((v) => v.lang.startsWith(preferLocale)) || voices[0] || null;
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickFemaleVoice();
  if (voice) utter.voice = voice;
  utter.rate = 1.0;
  utter.pitch = 1.1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export default function VoiceAssistant() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content:
      "Hi, I'm your Saathi—an empathetic companion. This space is private. Share what's on your mind, or press the mic to speak.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onVoices = () => {};
    window.speechSynthesis.onvoiceschanged = onVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null as any;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const toggleCamera = async () => {
    try {
      if (videoOn) {
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
        setVideoOn(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setVideoOn(true);
    } catch (e) {
      console.error("Media permission error", e);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setListening(false);
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript as string;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content) return;
    const next = [...messages, { role: "user", content } as Message];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      const reply: string = data.reply ?? "I'm here for you.";
      const merged = [...next, { role: "assistant", content: reply } as Message];
      setMessages(merged);
      speak(reply);
    } catch (e) {
      console.error(e);
      const fallback =
        "I'm here to support you. While I couldn't reach the server, we can try a breathing exercise: inhale for 4, hold 4, exhale 6—repeat 3 times.";
      setMessages((m) => [...m, { role: "assistant", content: fallback }]);
      speak(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-violet-50 dark:from-teal-900/20 dark:to-violet-900/20">
        <CardTitle className="text-xl">Your companion</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="order-2 md:order-1 flex flex-col h-[360px]">
          <div className="flex-1 space-y-3 overflow-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type how you're feeling…"
            />
            <Button type="button" variant={listening ? "secondary" : "default"} onClick={toggleListening} aria-label="Speak">
              <Mic className="h-4 w-4" />
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            This assistant is supportive and not a substitute for professional care. If you are in danger or thinking about self-harm, call Kiran Helpline 1800-599-0019 (India) or your local emergency number.
          </p>
        </div>
        <div className="order-1 md:order-2">
          <div className="aspect-video rounded-lg border overflow-hidden bg-black/5">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button onClick={toggleCamera} variant={videoOn ? "secondary" : "default"}>
              {videoOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              {videoOn ? "Stop camera" : "Start camera"}
            </Button>
            <div className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${listening ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "text-muted-foreground"}`}>
              <Volume2 className="h-3.5 w-3.5" /> {listening ? "Listening…" : "Mic off"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
