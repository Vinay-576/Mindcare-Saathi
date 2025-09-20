import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, AlertTriangle, PhoneCall } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

type MoodKey = "excellent" | "good" | "okay" | "bad" | "verybad";

const MOODS: { key: MoodKey; label: string; emoji: string; color: string }[] = [
  { key: "excellent", label: "Excellent", emoji: "🌞", color: "bg-teal-600" },
  { key: "good", label: "Good", emoji: "🙂", color: "bg-emerald-600" },
  { key: "okay", label: "Okay", emoji: "😐", color: "bg-blue-600" },
  { key: "bad", label: "Bad", emoji: "😔", color: "bg-orange-600" },
  { key: "verybad", label: "Very bad", emoji: "🌧️", color: "bg-rose-600" },
];

interface Entry {
  date: string;
  mood: MoodKey;
  saved?: boolean;
}

const key = "saathi.moods";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function formatYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}

function computeStreak(entries: Entry[]): number {
  const map = new Map(entries.map((e) => [e.date, e.saved !== false]));
  let streak = 0;
  let cur = startOfDay(new Date());
  while (map.get(formatYMD(cur))) {
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>(() => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  });
  const { toast } = useToast();
  const todayKey = formatYMD(new Date());
  const today = entries.find((e) => e.date === todayKey);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(entries));
  }, [entries]);

  const streak = useMemo(() => computeStreak(entries), [entries]);

  const setMood = (m: MoodKey) => {
    if (today?.saved) {
      toast({
        title: "Already submitted",
        description: "You've saved today's mood. Come back tomorrow.",
      });
      return;
    }
    setEntries((prev) => {
      const others = prev.filter((e) => e.date !== todayKey);
      return [...others, { date: todayKey, mood: m, saved: false }].sort(
        (a, b) => a.date.localeCompare(b.date),
      );
    });
  };

  const saveToday = () => {
    if (!today?.mood) {
      toast({
        title: "Select a mood",
        description: "Choose how you feel, then save.",
      });
      return;
    }
    if (today.saved) {
      toast({
        title: "Already submitted",
        description: "Today's mood is already saved.",
      });
      return;
    }
    setEntries((prev) =>
      prev.map((e) => (e.date === todayKey ? { ...e, saved: true } : e)),
    );
    toast({
      title: "Saved",
      description: "Today's mood saved. Keep your streak going!",
    });
  };

  const showEmergency = today?.mood === "bad" || today?.mood === "verybad";

  const last14 = useMemo(() => {
    const map = new Map(entries.map((e) => [e.date, e.mood]));
    const days: { date: string; mood: MoodKey | null }[] = [];
    const d = startOfDay(new Date());
    for (let i = 13; i >= 0; i--) {
      const day = new Date(d);
      day.setDate(d.getDate() - i);
      const k = formatYMD(day);
      days.push({ date: k, mood: (map.get(k) as MoodKey) ?? null });
    }
    return days;
  }, [entries]);

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Your wellness dashboard
          </h1>
          <p className="text-muted-foreground">
            Track how you feel and build a healthy streak.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-sm">Current streak</span>
          <span className="font-bold">
            {streak} day{streak === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {MOODS.map((m) => {
              const active = today?.mood === m.key;
              const disabled = !!today?.saved;
              return (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  disabled={disabled}
                  className={`group relative rounded-2xl border p-4 text-left transition-all ${disabled ? "opacity-70 cursor-not-allowed" : ""} ${active ? `${m.color} text-white border-transparent` : "hover:border-foreground/20"}`}
                >
                  <div className="text-2xl mb-2">{m.emoji}</div>
                  <div className="font-semibold">{m.label}</div>
                  {active && (
                    <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-white/90" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              {today?.saved
                ? "Today's mood is saved."
                : today?.mood
                  ? "Not saved yet."
                  : "Select a mood to save."}
            </div>
            <Button
              onClick={saveToday}
              disabled={!today?.mood || !!today?.saved}
            >
              {today?.saved ? "Saved" : "Save today"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showEmergency && (
        <Card className="border-destructive/40">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Emergency support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              If you’re feeling unsafe or thinking about self‑harm, please reach
              out now. You matter and help is available.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:18005990019">
                <Button
                  variant="destructive"
                  className="inline-flex items-center gap-2"
                >
                  <PhoneCall className="h-4 w-4" /> Call Kiran Helpline
                  (1800‑599‑0019)
                </Button>
              </a>
              <a href="tel:112">
                <Button variant="secondary">Call Emergency 112</Button>
              </a>
              <Link to="/ai">
                <Button>Open AI support</Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline">View resources</Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Saathi is supportive but not a substitute for professional care.
              If you’re in immediate danger, call your local emergency number.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Last 14 days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 sm:[grid-template-columns:repeat(14,minmax(0,1fr))] gap-2">
            {last14.map((d) => {
              const mood = d.mood;
              const color =
                mood === "excellent"
                  ? "bg-teal-500"
                  : mood === "good"
                    ? "bg-emerald-500"
                    : mood === "okay"
                      ? "bg-blue-500"
                      : mood === "bad"
                        ? "bg-orange-500"
                        : mood === "verybad"
                          ? "bg-rose-500"
                          : "bg-muted";
              return (
                <div
                  key={d.date}
                  className="flex flex-col items-center text-xs text-muted-foreground"
                >
                  <div
                    className={`h-8 w-8 rounded-md border ${color}`}
                    title={d.date}
                  />
                  <span className="mt-1 hidden sm:block">
                    {d.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
